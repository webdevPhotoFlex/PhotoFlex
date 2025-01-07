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
  tuneSettings,
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
  const applyTuneSettings = (ctx, tuneSettings, canvas) => {
    if (!canvas || !canvas.width || !canvas.height) {
      console.error('Canvas dimensions are not properly defined.');
      return;
    }

    const { brightness, contrast, saturation, sharpness } =
      tuneSettings;

    const brightnessFactor = brightness / 50; // Нормализация (50 = стандарт)
    const contrastFactor = contrast / 50; // Нормализация
    const saturationFactor = saturation / 50; // Нормализация
    const blurFactor = (100 - sharpness) / 50; // Инверсия резкости в размытие

    // Применяем фильтры яркости, контраста и насыщенности
    ctx.filter = `
      brightness(${brightnessFactor}) 
      contrast(${contrastFactor}) 
      saturate(${saturationFactor}) 
      blur(${blurFactor}px)
    `;

    // Отрисовываем изображение с наложенными фильтрами
    ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
  };

  const drawImage = useCallback(() => {
    if (
      !image ||
      !canvasRef.current ||
      !resizeDimensions?.width ||
      !resizeDimensions?.height
    ) {
      console.error('Invalid image, canvas, or resize dimensions.');
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { width, height } = resizeDimensions;

    // Устанавливаем размеры холста
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

      applyFilters(ctx, filter);
      applyTuneSettings(ctx, tuneSettings, canvas);

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
    tuneSettings,
  ]);

  useEffect(() => {
    drawImage();
  }, [drawImage]);
};

export default useImageDrawer;
