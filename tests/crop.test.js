import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import ImageCrop from '../src/components/editor-actions/image-crop';
import React from 'react';
import Crop from '../src/components/tools/crop-tool/crop-tools';

describe('Crop component', () => {
  it('allows input for width and height with non-negative values only', () => {
    const mockOnCropChange = jest.fn(); // Создаем mock-функцию
    render(<Crop onCropChange={mockOnCropChange} />); // Передаем ее в компонент
    const widthInput = screen.getByLabelText(/width/i);
    const heightInput = screen.getByLabelText(/height/i);

    fireEvent.change(widthInput, { target: { value: '-50' } });
    expect(widthInput.value).toBe('0');

    fireEvent.change(heightInput, { target: { value: '-50' } });
    expect(heightInput.value).toBe('0');

    fireEvent.change(widthInput, { target: { value: '100' } });
    expect(widthInput.value).toBe('100');

    fireEvent.change(heightInput, { target: { value: '200' } });
    expect(heightInput.value).toBe('200');
  });
});

describe('ImageCrop Component', () => {
  const defaultProps = {
    imageSrc: 'test-image.jpg',
    cropX: 10,
    cropY: 10,
    cropWidth: 100,
    cropHeight: 100,
  };

  beforeAll(() => {
    global.Image = class {
      constructor() {
        setTimeout(() => {
          if (this.onload) this.onload();
        }, 0);
      }
    };
  });

  beforeEach(() => {
    const mockGetContext = jest.fn(() => ({
      clearRect: jest.fn(),
      drawImage: jest.fn(),
    }));
    HTMLCanvasElement.prototype.getContext = mockGetContext;
  });

  it('renders canvas element', () => {
    render(<ImageCrop {...defaultProps} />);
    const canvasElement = screen.getByTestId('image-crop');
    expect(canvasElement).toBeInTheDocument();
  });

  it('renders canvas with correct dimensions based on cropWidth and cropHeight', async () => {
    const { container } = render(<ImageCrop {...defaultProps} />);
    const canvas = container.querySelector('canvas');

    await waitFor(() => {
      expect(canvas.width).toBe(100);
      expect(canvas.height).toBe(100);
    });
  });

  it('updates canvas dimensions when cropWidth and cropHeight change', async () => {
    const { rerender, container } = render(
      <ImageCrop {...defaultProps} />
    );
    const canvas = container.querySelector('canvas');

    rerender(
      <ImageCrop {...defaultProps} cropWidth={200} cropHeight={200} />
    );

    await waitFor(() => {
      expect(canvas.width).toBe(200);
      expect(canvas.height).toBe(200);
    });
  });
});
