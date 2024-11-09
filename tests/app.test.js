import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import App from './../src/components/app/app';
import ImageRotate from './../src/components/editor-actions/image-rotate';
import ToolBar from './../src/components/tool-bar/tool-bar';
import MainPage from '../src/components/pages/main-page/main-page';
import UploadContainer from '../src/components/upload-container/upload-container';
import Crop from '../src/components/tools/crop-tool/crop-tools';
import Tunes from '../src/components/tools/tune-tool/tunes-tools';
import Filters from '../src/components/tools/filter-tool/filters-tools';
import Text from '../src/components/tools/text-tool/text-tools';
import Rotate from '../src/components/tools/rotate-tool/rotate-tools';
import Tools from '../src/components/tools/tools';
import ImageCrop from '../src/components/editor-actions/image-crop';

test('App renders MainPage component', () => {
  render(<App />);
  const mainPageElement = screen.getByTestId('main-page');
  expect(mainPageElement).toBeInTheDocument();
});

describe('MainPage component', () => {
  it('MainPage updates rotation when Rotate icon is clicked', () => {
    render(<MainPage initialImageSrc="/placeholder.jpeg" />);

    const rotateIcon = screen.getByTestId('icon-2');

    fireEvent.click(rotateIcon);

    const imageRotateCanvas = screen.getByTestId('image-rotate');
    expect(imageRotateCanvas).toBeInTheDocument();
  });

  it('renders UploadContainer when no image is uploaded', () => {
    render(<MainPage />);
    const uploadContainer = screen.getByTestId('file-input');
    expect(uploadContainer).toBeInTheDocument();
  });

  it('renders ImageRotate component when image is uploaded and activeTool is 2', () => {
    render(<MainPage initialImageSrc="test-image.jpg" />);
    const rotateIcon = screen.getByTestId('icon-2');

    fireEvent.click(rotateIcon);

    const imageRotateCanvas = screen.getByTestId('image-rotate');
    expect(imageRotateCanvas).toBeInTheDocument();
  });

  it('renders ImageCrop component when image is uploaded and activeTool is 1', () => {
    render(<MainPage initialImageSrc="test-image.jpg" />);
    const cropIcon = screen.getByTestId('icon-1');

    fireEvent.click(cropIcon);

    const imageCropCanvas = screen.getByTestId('image-crop');
    expect(imageCropCanvas).toBeInTheDocument();
  });
});

describe('Editor-actions tools', () => {
  it('ImageRotate Component correctly sets canvas dimensions based on rotation', async () => {
    global.Image = class {
      constructor() {
        setTimeout(() => {
          if (this.onload) this.onload();
        }, 0);
      }
    };

    const { container } = render(
      <ImageRotate imageSrc="placeholder.jpeg" rotation={90} />
    );
    const canvas = container.querySelector('canvas');

    await waitFor(() => {
      expect(canvas.width).toBeGreaterThan(0);
      expect(canvas.height).toBeGreaterThan(0);
    });
  });
});

describe('ToolBar component', () => {
  it('should render all icons', () => {
    const { getByTestId } = render(<ToolBar onRotate={jest.fn()} />);

    for (let i = 0; i < 8; i++) {
      expect(getByTestId(`icon-${i}`)).toBeInTheDocument();
    }
  });
});

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

describe('Tunes component', () => {
  it('renders all sliders with correct labels', () => {
    render(<Tunes />);
    const labels = [
      'Brightness',
      'Contrast',
      'Saturation',
      'Sharpness',
    ];
    labels.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('updates settings when sliders are changed', () => {
    render(<Tunes />);
    const brightnessSlider = screen.getByRole('slider', {
      name: /brightness/i,
    });
    const contrastSlider = screen.getByRole('slider', {
      name: /contrast/i,
    });
    const saturationSlider = screen.getByRole('slider', {
      name: /saturation/i,
    });
    const sharpnessSlider = screen.getByRole('slider', {
      name: /sharpness/i,
    });

    expect(brightnessSlider).toHaveValue('50');
    expect(contrastSlider).toHaveValue('50');
    expect(saturationSlider).toHaveValue('50');
    expect(sharpnessSlider).toHaveValue('50');
    fireEvent.change(brightnessSlider, { target: { value: '80' } });
    expect(brightnessSlider).toHaveValue('80');
    expect(contrastSlider).toHaveValue('50');
    expect(saturationSlider).toHaveValue('50');
    expect(sharpnessSlider).toHaveValue('50');
  });
});

describe('Filters component', () => {
  test('renders all filters with correct labels', () => {
    render(<Filters />);
    const filterNames = [
      'nebula',
      'outerspace',
      'refulgence',
      'grayscale',
    ];
    filterNames.forEach((name) => {
      const filterLabels = screen.getAllByText(name);
      expect(filterLabels.length).toBeGreaterThan(0);
      filterLabels.forEach((label) => {
        expect(label).toBeInTheDocument();
      });
    });
  });
});

describe('Text component', () => {
  it('renders the add text icon and label', () => {
    render(<Text />);
    const addTextIcon = screen.getByTestId('add-text-icon');
    const addTextLabel = screen.getByText(/добавить текст/i);
    expect(addTextIcon).toBeInTheDocument();
    expect(addTextLabel).toBeInTheDocument();
  });

  it('renders color selection icons and label', () => {
    render(<Text />);
    const colorBlocks = screen.getAllByTestId(/color-block-/);
    const colorLabel = screen.getByText(/выбор цвета/i);
    expect(colorBlocks.length).toBe(8);
    expect(colorLabel).toBeInTheDocument();
    colorBlocks.forEach((block, index) => {
      expect(
        screen.getByTestId(`color-icon-${index}`)
      ).toBeInTheDocument();
    });
  });

  it('renders correct labels for color icons', () => {
    render(<Text />);
    const label = screen.getByText('Выбор цвета');
    expect(label).toBeInTheDocument();
  });
});

describe('Rotate Component', () => {
  let mockOnRotate;
  beforeEach(() => {
    mockOnRotate = jest.fn();
    render(<Rotate onRotate={mockOnRotate} />);
  });
  it('renders rotate left icon', () => {
    const leftIcon = screen.getByTestId('rotate-left-icon');
    expect(leftIcon).toBeInTheDocument();
    fireEvent.click(leftIcon);
    expect(mockOnRotate).toHaveBeenCalledWith(-90);
  });

  it('renders rotate right icon', () => {
    const rightIcon = screen.getByTestId('rotate-right-icon');
    expect(rightIcon).toBeInTheDocument();
    fireEvent.click(rightIcon);
    expect(mockOnRotate).toHaveBeenCalledWith(90);
  });
});

describe('UploadContainer', () => {
  it('calls onImageUpload when a file is selected via input', async () => {
    const mockOnImageUpload = jest.fn();

    render(<UploadContainer onImageUpload={mockOnImageUpload} />);

    const file = new File(['dummy content'], 'example.png', {
      type: 'image/png',
    });

    const fileInput = screen.getByTestId('file-input');
    fireEvent.change(fileInput, { target: { files: [file] } });

    const fileReaderMock = {
      readAsDataURL: jest.fn(),
      onload: null,
      result: 'data:image/png;base64,dummyImageData',
    };
    window.FileReader = jest.fn(() => fileReaderMock);

    fileReaderMock.onload = function () {
      mockOnImageUpload(fileReaderMock.result);
    };
    fileReaderMock.onload();

    expect(mockOnImageUpload).toHaveBeenCalledWith(
      'data:image/png;base64,dummyImageData'
    );
  });

  it('does not call onImageUpload when no file is selected via input', () => {
    const mockOnImageUpload = jest.fn();

    render(<UploadContainer onImageUpload={mockOnImageUpload} />);

    const fileInput = screen.getByTestId('file-input');
    fireEvent.change(fileInput, { target: { files: [] } });

    expect(mockOnImageUpload).not.toHaveBeenCalled();
  });

  it('calls onImageUpload when a file is dropped', async () => {
    const mockOnImageUpload = jest.fn();

    render(<UploadContainer onImageUpload={mockOnImageUpload} />);

    const uploadArea = screen.getByText(
      /choose or drag file/i
    ).parentElement;

    const file = new File(['dummy content'], 'example.png', {
      type: 'image/png',
    });

    const fileReaderMock = {
      readAsDataURL: jest.fn(),
      onload: jest.fn(),
      result: 'data:image/png;base64,dummyImageData',
    };
    window.FileReader = jest.fn(() => fileReaderMock);

    fireEvent.drop(uploadArea, {
      dataTransfer: {
        files: [file],
      },
    });

    fileReaderMock.onload();

    expect(mockOnImageUpload).toHaveBeenCalledWith(
      'data:image/png;base64,dummyImageData'
    );
  });

  it('doesnt call onImageUpload when no file is dropped', () => {
    const mockOnImageUpload = jest.fn();

    render(<UploadContainer onImageUpload={mockOnImageUpload} />);

    const uploadArea = screen.getByRole('button');

    fireEvent.drop(uploadArea, {
      dataTransfer: {
        files: [],
      },
    });

    expect(mockOnImageUpload).not.toHaveBeenCalled();
  });
});
describe('Tools Component', () => {
  it('renders Tunes component when activeTool is 0', () => {
    render(<Tools activeTool={0} />);
    expect(screen.getByText('Brightness')).toBeInTheDocument();
  });

  it('renders Crop component when activeTool is 1', () => {
    render(<Tools activeTool={1} />);
    expect(screen.getByLabelText(/width/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/height/i)).toBeInTheDocument();
  });

  it('renders Rotate component when activeTool is 2', () => {
    render(<Tools activeTool={2} onRotate={jest.fn()} />);
    expect(
      screen.getByTestId('rotate-left-icon')
    ).toBeInTheDocument();
  });

  it('renders Filters component when activeTool is 4', () => {
    render(<Tools activeTool={4} />);
    expect(screen.getByText('nebula')).toBeInTheDocument();
  });

  it('renders Text component when activeTool is 7', () => {
    render(<Tools activeTool={7} />);
    expect(screen.getByText(/добавить текст/i)).toBeInTheDocument();
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
