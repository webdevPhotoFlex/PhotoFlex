import { render, act } from '@testing-library/react';
import React from 'react';
import useImageDrawer from '../src/hooks/drawHook';

console.warn = jest.fn();
global.HTMLCanvasElement.prototype.getContext = jest
  .fn()
  .mockReturnValue({
    clearRect: jest.fn(),
    drawImage: jest.fn(),
    beginPath: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    save: jest.fn(),
    restore: jest.fn(),
    translate: jest.fn(),
    rotate: jest.fn(),
    globalCompositeOperation: '',
    filter: '',
    fillText: jest.fn(),
  });

describe('useImageDrawer', () => {
  let canvasRef;
  let image;
  let originalImage;

  beforeEach(() => {
    canvasRef = { current: document.createElement('canvas') };
    image = new Image();
    image.src = 'path_to_image';
    originalImage = image;
  });

  it('should call drawImage function when the hook is used', () => {
    const Component = () => {
      useImageDrawer({
        canvasRef,
        image,
        originalImage,
        showOriginal: true,
        filter: 'none',
        resizeDimensions: { width: 500, height: 500 },
        rotationAngle: 45,
        mask: [],
        appliedMask: [],
        tuneSettings: {
          brightness: 50,
          contrast: 50,
          saturation: 50,
          sharpness: 50,
        },
      });
      return <canvas ref={canvasRef}></canvas>;
    };

    render(<Component />);

    act(() => {});

    const ctx = canvasRef.current.getContext('2d');
    expect(ctx.drawImage).toHaveBeenCalledTimes(1);
  });

  // it('should apply grayscale filter when filter is set to grayscale', () => {
  //   const Component = () => {
  //     useImageDrawer({
  //       canvasRef,
  //       image,
  //       originalImage,
  //       showOriginal: false,
  //       filter: 'grayscale',
  //       resizeDimensions: { width: 500, height: 500 },
  //       rotationAngle: 45,
  //       mask: [],
  //       appliedMask: [],
  //       tuneSettings: {
  //         brightness: 50,
  //         contrast: 50,
  //         saturation: 50,
  //         sharpness: 100,
  //       },
  //     });
  //     return <canvas ref={canvasRef}></canvas>;
  //   };

  //   render(<Component />);

  //   act(() => {});

  //   const ctx = canvasRef.current.getContext('2d');
  //   // Expect the filter to include the grayscale effect and tune settings (brightness, contrast, saturation, blur)
  //   expect(ctx.filter).toBe(
  //     'brightness(1) contrast(1) saturate(1) blur(0px) grayscale(100%)'
  //   );
  // });

  // it('should apply no filter when filter is set to none', () => {
  //   const Component = () => {
  //     useImageDrawer({
  //       canvasRef,
  //       image,
  //       originalImage,
  //       showOriginal: false,
  //       filter: 'none',
  //       resizeDimensions: { width: 500, height: 500 },
  //       rotationAngle: 45,
  //       mask: [],
  //       appliedMask: [],
  //       tuneSettings: {
  //         brightness: 50,
  //         contrast: 50,
  //         saturation: 50,
  //         sharpness: 100,
  //       },
  //     });
  //     return <canvas ref={canvasRef}></canvas>;
  //   };

  //   render(<Component />);

  //   act(() => {});

  //   const ctx = canvasRef.current.getContext('2d');
  //   // Expect the filter to include the default tune settings (brightness, contrast, saturation, blur)
  //   expect(ctx.filter).toBe(
  //     'brightness(1) contrast(1) saturate(1) blur(0px)'
  //   );
  // });

  it('should draw mask when mask array is provided', () => {
    const mask = [{ x: 100, y: 100, brushSize: 10 }];
    const Component = () => {
      useImageDrawer({
        canvasRef,
        image,
        originalImage,
        showOriginal: false,
        filter: 'none',
        resizeDimensions: { width: 500, height: 500 },
        rotationAngle: 45,
        mask,
        appliedMask: [],
        tuneSettings: {
          brightness: 50,
          contrast: 50,
          saturation: 50,
          sharpness: 100,
        },
      });
      return <canvas ref={canvasRef}></canvas>;
    };

    render(<Component />);

    act(() => {});

    const ctx = canvasRef.current.getContext('2d');
    expect(ctx.beginPath).toHaveBeenCalledTimes(1);
    expect(ctx.arc).toHaveBeenCalledTimes(1);
  });

  it('should correctly apply rotation when rotationAngle is provided', () => {
    const Component = () => {
      useImageDrawer({
        canvasRef,
        image,
        originalImage,
        showOriginal: false,
        filter: 'none',
        resizeDimensions: { width: 500, height: 500 },
        rotationAngle: 90,
        mask: [],
        appliedMask: [],
        tuneSettings: {
          brightness: 50,
          contrast: 50,
          saturation: 50,
          sharpness: 100,
        },
      });
      return <canvas ref={canvasRef}></canvas>;
    };

    render(<Component />);

    act(() => {});

    const ctx = canvasRef.current.getContext('2d');
    expect(ctx.rotate).toHaveBeenCalledWith((90 * Math.PI) / 180);
  });
  it('should call drawText when text is provided', () => {
    const texts = [
      {
        content: 'Test text',
        fontSize: 20,
        fontFamily: 'Arial',
        color: 'black',
        x: 100,
        y: 100,
      },
    ];
    const Component = () => {
      useImageDrawer({
        canvasRef,
        image,
        originalImage,
        showOriginal: false,
        filter: 'none',
        resizeDimensions: { width: 500, height: 500 },
        rotationAngle: 45,
        mask: [],
        appliedMask: [],
        tuneSettings: {
          brightness: 50,
          contrast: 50,
          saturation: 50,
          sharpness: 100,
        },
        texts,
      });
      return <canvas ref={canvasRef}></canvas>;
    };

    render(<Component />);

    const ctx = canvasRef.current.getContext('2d');
    expect(ctx.fillText).toHaveBeenCalledWith('Test text', 100, 100);
  });
});
