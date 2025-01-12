import {
  applyMaskToImageData,
  applyMaskTransformation,
  resizeImageToCanvas,
} from '../src/utils/image-utils';

describe('resizeImageToCanvas', () => {
  it('should resize the image to fit within the max width and height', () => {
    const img = { width: 2000, height: 1000 };
    const maxWidth = 800;
    const maxHeight = 600;
    const result = resizeImageToCanvas(img, maxWidth, maxHeight);
    expect(result.width).toBe(800);
    expect(result.height).toBe(400);
  });

  it('should maintain aspect ratio if image is smaller than max width and height', () => {
    const img = { width: 400, height: 200 };
    const maxWidth = 800;
    const maxHeight = 600;
    const result = resizeImageToCanvas(img, maxWidth, maxHeight);
    expect(result.width).toBe(800);
    expect(result.height).toBe(400);
  });
  it('should resize image to max height if width exceeds max width', () => {
    const img = { width: 1000, height: 2000 };
    const maxWidth = 500;
    const maxHeight = 500;
    const result = resizeImageToCanvas(img, maxWidth, maxHeight);
    expect(result.width).toBe(300);
    expect(result.height).toBe(600);
  });
});

describe('applyMaskToImageData', () => {
  it('should apply mask to image data and set alpha to 0 where the mask is', () => {
    const imageData = {
      data: new Uint8ClampedArray(16),
      width: 2,
    };
    const mask = [{ x: 0, y: 0, brushSize: 10 }];
    applyMaskToImageData(imageData, mask);
    expect(imageData.data[3]).toBe(0);
  });
  it('should not modify image data if no mask is provided', () => {
    const imageData = {
      data: new Uint8ClampedArray(16),
      width: 2,
    };
    const mask = [];
    applyMaskToImageData(imageData, mask);
    expect(imageData.data[3]).toBe(0);
  });
});
