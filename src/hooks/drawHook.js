import { useEffect, useCallback } from 'react';
import { applyMaskWithoutTransformations } from '../utils/image-utils';

const useImageDrawer = ({
  canvasRef,
  image,
  originalImage,
  showOriginal,
  filter,
  cropArea,
  resizeDimensions,
  rotationAngle,
  mask,
  appliedMask,
  tuneSettings,
  texts = [],
  brushSize,
}) => {
  const applyCombinedFilters = (ctx, filter, tuneSettings) => {
    const filters = {
      none: '',
      grayscale: 'grayscale(100%)',
      sepia: 'sepia(100%)',
      invert: 'invert(100%)',
      outerspace: 'hue-rotate(240deg)',
      refulgence: 'contrast(150%) brightness(120%)',
      pink: 'hue-rotate(300deg)',
    };
    const selectedFilter = filters[filter] || '';
    const { brightness, contrast, saturation, blur } = tuneSettings;
    const brightnessFactor = brightness / 50;
    const contrastFactor = contrast / 50;
    const saturationFactor = saturation / 50;
    const blurFactor = blur / 50;
    ctx.filter = `
    ${selectedFilter}
    brightness(${brightnessFactor})
    contrast(${contrastFactor})
    saturate(${saturationFactor})
    blur(${blurFactor}px)
  `;
  };
  const drawText = (ctx, text) => {
    ctx.font = `${text.fontSize}px ${text.fontFamily}`;
    ctx.fillStyle = text.color;
    ctx.fillText(text.content, text.x, text.y);
  };
  const drawImage = useCallback(() => {
    if (
      !image ||
      !canvasRef.current ||
      !resizeDimensions?.width ||
      !resizeDimensions?.height
    ) {
      return;
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { width, height } = resizeDimensions;
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (showOriginal && originalImage) {
      canvas.width = originalImage.width;
      canvas.height = originalImage.height;
      ctx.drawImage(
        originalImage,
        0,
        0,
        originalImage.width,
        originalImage.height
      );
    } else {
      const cropX = cropArea?.x || 0;
      const cropY = cropArea?.y || 0;
      const finalWidth = width - cropX;
      const finalHeight = height - cropY;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate((rotationAngle * Math.PI) / 180);
      ctx.translate(-centerX, -centerY);
      applyCombinedFilters(ctx, filter, tuneSettings);
      ctx.drawImage(
        image,
        cropX,
        cropY,
        image.width - cropX,
        image.height - cropY,
        0,
        0,
        finalWidth,
        finalHeight
      );
      ctx.restore();
      ctx.restore();
      if (mask.length > 0) {
        applyMaskWithoutTransformations(ctx, mask);
      }
      texts.forEach((text) => drawText(ctx, text));
    }
  }, [
    canvasRef,
    image,
    originalImage,
    showOriginal,
    filter,
    cropArea,
    resizeDimensions,
    rotationAngle,
    mask,
    appliedMask,
    tuneSettings,
    texts,
    brushSize,
  ]);
  useEffect(() => {
    drawImage();
  }, [drawImage]);
};

export default useImageDrawer;
