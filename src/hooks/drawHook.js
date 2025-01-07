import { useEffect, useCallback } from 'react';
import { applyMaskTransformation } from '../utils/image-utils';
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
}) => {
  const applyFilters = (ctx, filter) => {
    const filters = {
      none: 'none',
      grayscale: 'grayscale(100%)',
      sepia: 'sepia(100%)',
      invert: 'invert(100%)',
      outerspace: 'hue-rotate(240deg)',
      refulgence: 'contrast(150%) brightness(120%)',
      pink: 'hue-rotate(300deg)',
    };
    ctx.filter = filters[filter] || 'none';
  };

  const drawImage = useCallback(() => {
    if (!image || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { width } = resizeDimensions;

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
      const finalWidth = resizeDimensions.width - cropX;
      const finalHeight = resizeDimensions.height - cropY;

      canvas.width = finalWidth;
      canvas.height = finalHeight;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      applyFilters(ctx, filter);

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate((rotationAngle * Math.PI) / 180);
      ctx.translate(-centerX, -centerY);

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

      if (mask.length > 0) {
        const scale = width / image.width;
        applyMaskTransformation(
          ctx,
          mask,
          scale,
          'red',
          'source-over'
        );
      }
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
  ]);

  useEffect(() => {
    drawImage();
  }, [drawImage]);
};

export default useImageDrawer;
