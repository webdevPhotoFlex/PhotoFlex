export const resizeImageToCanvas = (
  img,
  maxWidth = 1600,
  maxHeight = 1200,
  minWidth = 800,
  minHeight = 600
) => {
  const imgWidth = img.width;
  const imgHeight = img.height;

  let width = imgWidth;
  let height = imgHeight;
  const aspectRatio = imgWidth / imgHeight;
  if (imgWidth > maxWidth || imgHeight > maxHeight) {
    if (aspectRatio > 1) {
      width = maxWidth;
      height = maxWidth / aspectRatio;
    } else {
      height = maxHeight;
      width = maxHeight * aspectRatio;
    }
  }
  if (width < minWidth || height < minHeight) {
    if (aspectRatio > 1) {
      width = minWidth;
      height = minWidth / aspectRatio;
    } else {
      height = minHeight;
      width = minHeight * aspectRatio;
    }
  }

  return {
    width: Math.round(width),
    height: Math.round(height),
    aspectRatio,
  };
};

export const applyMaskTransformation = (
  ctx,
  mask,
  imageWidth,
  imageHeight,
  canvasWidth,
  canvasHeight,
  rotationAngle,
  scale,
  fillStyle = 'red'
) => {
  if (!ctx || !mask || mask.length === 0) return;

  ctx.save();
  ctx.fillStyle = fillStyle;

  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;
  const radianAngle = (-rotationAngle * Math.PI) / 180;

  mask.forEach(({ x, y, brushSize }) => {
    if (
      typeof x !== 'number' ||
      typeof y !== 'number' ||
      typeof brushSize !== 'number'
    ) {
      console.warn('Invalid mask point:', { x, y, brushSize });
      return;
    }
    const translatedX = x - centerX;
    const translatedY = y - centerY;

    const imageX =
      translatedX * Math.cos(radianAngle) -
      translatedY * Math.sin(radianAngle) +
      centerX;
    const imageY =
      translatedX * Math.sin(radianAngle) +
      translatedY * Math.cos(radianAngle) +
      centerY;

    const scaledX = imageX * (imageWidth / canvasWidth);
    const scaledY = imageY * (imageHeight / canvasHeight);

    ctx.beginPath();
    ctx.arc(
      scaledX,
      scaledY,
      (brushSize / 2) * scale,
      0,
      Math.PI * 2
    );
    ctx.fill();
  });

  ctx.restore();
};
export const applyMaskWithoutTransformations = (
  ctx,
  mask,
  fillStyle = 'red'
) => {
  if (!ctx || !Array.isArray(mask) || mask.length === 0) return;

  ctx.save();
  ctx.fillStyle = fillStyle;

  mask.forEach(({ x, y, brushSize }) => {
    if (
      typeof x !== 'number' ||
      typeof y !== 'number' ||
      typeof brushSize !== 'number'
    ) {
      console.warn('Invalid mask point:', { x, y, brushSize });
      return;
    }

    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
};

export const applyMaskToImageData = (
  imageData,
  mask,
  canvasWidth,
  canvasHeight,
  rotationAngle,
  scale,
  cropArea = { x: 0, y: 0 }
) => {
  if (!mask || mask.length === 0) {
    return imageData;
  }

  const data = imageData.data;
  const { width, height } = imageData;

  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;
  const radianAngle = (-rotationAngle * Math.PI) / 180;

  mask.forEach(({ x, y, brushSize }) => {
    if (
      typeof x !== 'number' ||
      typeof y !== 'number' ||
      typeof brushSize !== 'number'
    ) {
      console.warn('Invalid mask point:', { x, y, brushSize });
      return;
    }
    const adjustedX = x + cropArea.x;
    const adjustedY = y + cropArea.y;

    const translatedX = adjustedX - centerX;
    const translatedY = adjustedY - centerY;

    const originalX =
      translatedX * Math.cos(radianAngle) -
      translatedY * Math.sin(radianAngle) +
      centerX;
    const originalY =
      translatedX * Math.sin(radianAngle) +
      translatedY * Math.cos(radianAngle) +
      centerY;

    const radius = (brushSize / 2) * scale;
    const radiusSquared = radius ** 2;

    for (
      let pixelY = Math.max(0, Math.floor(originalY - radius));
      pixelY < Math.min(height, Math.ceil(originalY + radius));
      pixelY++
    ) {
      for (
        let pixelX = Math.max(0, Math.floor(originalX - radius));
        pixelX < Math.min(width, Math.ceil(originalX + radius));
        pixelX++
      ) {
        const distSquared =
          (pixelX - originalX) ** 2 + (pixelY - originalY) ** 2;
        if (distSquared <= radiusSquared) {
          const index = (pixelY * width + pixelX) * 4;
          data[index + 3] = 0;
        }
      }
    }
  });

  return imageData;
};
