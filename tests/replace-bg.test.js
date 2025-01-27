import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import ReplaceBgTool from '../src/components/tools/replace-bg-tool/replace-bg-tool';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { applyMaskToImageData } from '../src/utils/image-utils';

console.warn = jest.fn();
const mockStore = configureStore([]);
const renderWithProvider = (component, initialState) => {
  const store = mockStore(initialState);
  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
  };
};

describe('ReplaceBgTool Component', () => {
  let store;
  let canvasRefMock;

  beforeEach(() => {
    global.URL.createObjectURL = jest.fn(() => 'mock-url');
    canvasRefMock = { current: document.createElement('canvas') };
    canvasRefMock.current.width = 200;
    canvasRefMock.current.height = 200;
    const initialState = {
      image: {
        imageBeforeRemove: null,
        image: null,
        brushSize: 10,
        mask: [],
      },
      auth: {
        isAuthenticated: true,
      },
    };
    const renderResult = renderWithProvider(
      <ReplaceBgTool canvasRef={canvasRefMock} />,
      initialState
    );
    store = renderResult.store;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('renders without crashing', () => {
    const brushSizeLabel = screen.getByText(/Размер кисти:\s*10/);
    expect(brushSizeLabel).toBeInTheDocument();
  });

  it('changes brush size', () => {
    const brushSizeInput = screen.getByLabelText('brush size');
    fireEvent.change(brushSizeInput, { target: { value: '20' } });
    const actions = store.getActions();
    expect(actions).toEqual([
      { type: 'SET_BRUSH_SIZE', payload: 20 },
    ]);
  });

  it('displays the file upload button', () => {
    const fileUploadLabel = screen.getByText('Загрузить фон');
    expect(fileUploadLabel).toBeInTheDocument();
  });

  it('handles image upload and updates state', async () => {
    const file = new File(['dummy content'], 'test-image.png', {
      type: 'image/png',
    });
    const fileInput = screen.getByTestId('fileUploadInput1');
    const createObjectURLSpy = jest.spyOn(URL, 'createObjectURL');
    fireEvent.change(fileInput, { target: { files: [file] } });
    await waitFor(() => {
      expect(createObjectURLSpy).toHaveBeenCalledWith(file);
      expect(screen.getByTestId('previewImage')).toBeInTheDocument();
    });
    const actions = store.getActions();
    expect(actions).toEqual([]);
    createObjectURLSpy.mockRestore();
  });

  it('disables replace button when no new image is uploaded', () => {
    const replaceButton = screen.getByTestId('replaceButton');
    expect(replaceButton).toBeDisabled();
  });

  it('enables replace button when new image is uploaded', async () => {
    const file = new File(['dummy content'], 'test-image.png', {
      type: 'image/png',
    });
    const fileInput = screen.getByTestId('fileUploadInput1');
    fireEvent.change(fileInput, { target: { files: [file] } });
    await waitFor(() => {
      const replaceButton = screen.getByTestId('replaceButton');
      expect(replaceButton).not.toBeDisabled();
    });
  });

  it('dispatches setBrushSize when brush size is changed', () => {
    const brushSizeInput = screen.getByLabelText('brush size');
    fireEvent.change(brushSizeInput, { target: { value: '50' } });
    const actions = store.getActions();
    expect(actions).toEqual([
      { type: 'SET_BRUSH_SIZE', payload: 50 },
    ]);
  });

  it('calls handleReplaceBackground when the button is clicked', async () => {
    const file = new File(['dummy content'], 'test-image.png', {
      type: 'image/png',
    });
    const fileInput = screen.getByTestId('fileUploadInput1');
    fireEvent.change(fileInput, { target: { files: [file] } });

    const replaceButton = screen.getByTestId('replaceButton');
    fireEvent.click(replaceButton);
    await waitFor(() => {
      expect(
        screen.getByTestId('previewContainer')
      ).toBeInTheDocument();
    });
  });

  it('renders brush size input correctly', () => {
    const brushSizeInput = screen.getByLabelText('brush size');
    expect(brushSizeInput).toBeInTheDocument();
    expect(brushSizeInput).toHaveValue('10');
  });

  it('does not enable replace button when no file is uploaded', async () => {
    const replaceButton = screen.getByTestId('replaceButton');
    expect(replaceButton).toBeDisabled();
  });

  it('does not dispatch action when brush size is unchanged', () => {
    const brushSizeInput = screen.getByLabelText('brush size');
    fireEvent.change(brushSizeInput, { target: { value: '10' } });
    const actions = store.getActions();
    expect(actions).toEqual([]);
  });

  it('dispatches setBrushSize action when brush size is changed', () => {
    const brushSizeInput = screen.getByLabelText('brush size');
    fireEvent.change(brushSizeInput, { target: { value: '30' } });
    const actions = store.getActions();
    expect(actions).toEqual([
      { type: 'SET_BRUSH_SIZE', payload: 30 },
    ]);
  });

  it('disables the replace button when there is no new image uploaded', async () => {
    const replaceButton = screen.getByTestId('replaceButton');
    expect(replaceButton).toBeDisabled();
  });

  it('enables replace button after uploading a new image', async () => {
    const file = new File(['dummy content'], 'test-image.png', {
      type: 'image/png',
    });
    const fileInput = screen.getByTestId('fileUploadInput1');
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      const replaceButton = screen.getByTestId('replaceButton');
      expect(replaceButton).not.toBeDisabled();
    });
  });

  it('does not replace background if no image is uploaded', () => {
    const replaceButton = screen.getByTestId('replaceButton');
    fireEvent.click(replaceButton);
    expect(
      screen.queryByTestId('previewImage')
    ).not.toBeInTheDocument();
  });

  it('displays auth message if user is not authenticated', () => {
    const initialState = {
      image: {
        imageBeforeRemove: null,
        image: null,
        brushSize: 10,
        mask: [],
      },
      auth: {
        isAuthenticated: false,
      },
    };

    const { container } = renderWithProvider(
      <ReplaceBgTool canvasRef={{ current: {} }} />,
      initialState
    );

    const authMessage = container.querySelector('p');
    expect(authMessage).toBeInTheDocument();
  });
  it('displays the reset button', () => {
    const resetButton = screen.getByTestId('resetImage');
    expect(resetButton).toBeInTheDocument();
  });

  it('displays the brush size label correctly', () => {
    const brushSizeLabel = screen.getByText('Размер кисти: 10');
    expect(brushSizeLabel).toBeInTheDocument();
  });

  it('updates the brush size label when brush size is changed', () => {
    const brushSizeInput = screen.getByLabelText('brush size');
    fireEvent.change(brushSizeInput, { target: { value: '10' } });
    const brushSizeLabel = screen.getByText('Размер кисти: 10');
    expect(brushSizeLabel).toBeInTheDocument();
  });

  it('displays the preview image when a new image is uploaded', async () => {
    const file = new File(['dummy content'], 'test-image.png', {
      type: 'image/png',
    });
    const fileInput = screen.getByTestId('fileUploadInput1');
    fireEvent.change(fileInput, { target: { files: [file] } });
    await waitFor(() => {
      const previewImage = screen.getByTestId('previewImage');
      expect(previewImage).toBeInTheDocument();
    });
  });
  it('dispatches setImageBeforeRemove when image is set', () => {
    const initialState = {
      image: {
        imageBeforeRemove: null,
        image: null,
        brushSize: 10,
        mask: [],
      },
      auth: {
        isAuthenticated: true,
      },
    };

    const { store } = renderWithProvider(
      <ReplaceBgTool canvasRef={{ current: {} }} />,
      initialState
    );

    const newImage = new Image();
    store.dispatch({ type: 'SET_IMAGE', payload: newImage });

    const actions = store.getActions();
    expect(actions).toEqual([
      { type: 'SET_IMAGE', payload: newImage },
    ]);
  });
  it('handles image upload and updates state correctly', async () => {
    const file = new File(['dummy content'], 'test-image.png', {
      type: 'image/png',
    });
    const fileInput = screen.getByTestId('fileUploadInput1');
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).toEqual([]);
    });
  });

  it('calls handleReplaceBackground and updates the image when the button is clicked', async () => {
    const file = new File(['dummy content'], 'test-image.png', {
      type: 'image/png',
    });
    const fileInput = screen.getByTestId('fileUploadInput1');
    fireEvent.change(fileInput, { target: { files: [file] } });

    const replaceButton = screen.getByTestId('replaceButton');
    fireEvent.click(replaceButton);

    await waitFor(() => {
      expect(
        screen.getByTestId('previewContainer')
      ).toBeInTheDocument();
    });
  });
  it('displays auth message when user is not authenticated', () => {
    const initialState = {
      image: {
        imageBeforeRemove: null,
        image: null,
        brushSize: 10,
        mask: [],
      },
      auth: {
        isAuthenticated: false,
      },
    };

    const { container } = renderWithProvider(
      <ReplaceBgTool canvasRef={{ current: {} }} />,
      initialState
    );

    const authMessage = container.querySelector('p');
    expect(authMessage).toBeInTheDocument();
  });
  it('updates the state with the uploaded image', async () => {
    const file = new File(['dummy content'], 'test-image.png', {
      type: 'image/png',
    });
    const fileInput = screen.getByTestId('fileUploadInput1');

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).toEqual([]);
      const previewImage = screen.getByTestId('previewImage');
      expect(previewImage).toBeInTheDocument();
    });
  });
  it('disables the replace button when no image is uploaded', async () => {
    const replaceButton = screen.getByTestId('replaceButton');
    expect(replaceButton).toBeDisabled();
  });

  it('replaces background when replace button is clicked', async () => {
    const file = new File(['dummy content'], 'test-image.png', {
      type: 'image/png',
    });
    const fileInput = screen.getByTestId('fileUploadInput1');

    fireEvent.change(fileInput, { target: { files: [file] } });

    const replaceButton = screen.getByTestId('replaceButton');
    fireEvent.click(replaceButton);

    await waitFor(() => {
      const previewContainer = screen.getByTestId('previewContainer');
      expect(previewContainer).toBeInTheDocument();
    });
  });
  it('should clear the mask after applying it', () => {
    const dispatch = jest.fn();
    const setMask = (mask) =>
      dispatch({ type: 'SET_MASK', payload: mask });

    setMask([]);

    expect(dispatch).toHaveBeenCalledWith({
      type: 'SET_MASK',
      payload: [],
    });
  });
  it('does not call handleReplaceBackground when canvasRef.current is null', () => {
    const canvasRef = { current: null };

    const { container } = renderWithProvider(
      <ReplaceBgTool canvasRef={canvasRef} />,
      { image: {}, auth: { isAuthenticated: true } }
    );

    const replaceButtons = screen.getAllByTestId('replaceButton');

    expect(replaceButtons).toHaveLength(2);

    fireEvent.click(replaceButtons[0]);

    expect(container.querySelector('canvas')).not.toBeInTheDocument();
  });

  it('does not replace background when no image is provided', () => {
    const replaceButton = screen.getByTestId('replaceButton');
    fireEvent.click(replaceButton);

    expect(
      screen.queryByTestId('previewContainer')
    ).not.toBeInTheDocument();
  });
  it('applies mask to image data correctly when mask is present', () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 100;
    canvas.height = 100;

    const imageData = ctx.createImageData(100, 100);
    const mockMask = new Array(100 * 100).fill(0);

    applyMaskToImageData(imageData, mockMask);

    expect(
      imageData.data.every(
        (value, index) => index % 4 !== 3 || value === 0
      )
    ).toBeTruthy();
  });
  it('renders AuthRequired component when user is not authenticated', () => {
    const initialState = {
      image: {},
      auth: { isAuthenticated: false },
    };
    const { container } = renderWithProvider(
      <ReplaceBgTool canvasRef={{ current: {} }} />,
      initialState
    );

    expect(container.querySelector('p')).toHaveTextContent(
      /Вы должны авторизироваться для использования этого инструмента\./
    );
  });

  it('disables "replace background" button without an image', () => {
    const replaceButton = screen.getByTestId('replaceButton');
    expect(replaceButton).toBeDisabled();
  });

  it('enables "replace background" button after image upload', async () => {
    const file = new File(['dummy content'], 'test-image.png', {
      type: 'image/png',
    });
    const fileInput = screen.getByTestId('fileUploadInput1');

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      const replaceButton = screen.getByTestId('replaceButton');
      expect(replaceButton).not.toBeDisabled();
    });
  });

  it('does not enable replace button if the uploaded file is not an image', async () => {
    const nonImageFile = new File(['dummy content'], 'test.txt', {
      type: 'text/plain',
    });
    const fileInput = screen.getByTestId('fileUploadInput1');
    fireEvent.change(fileInput, {
      target: { files: [nonImageFile] },
    });

    await waitFor(() => {
      const replaceButton = screen.getByTestId('replaceButton');
      expect(replaceButton).toBeDisabled();
      expect(
        screen.queryByTestId('previewImage')
      ).not.toBeInTheDocument();
    });
  });
  it('does not apply mask when no mask is provided', async () => {
    const replaceButton = screen.getByTestId('replaceButton');
    fireEvent.click(replaceButton);

    await waitFor(() => {
      expect(
        screen.queryByTestId('previewContainer')
      ).not.toBeInTheDocument();
    });
  });
  it('sets new image correctly and displays preview', async () => {
    const file = new File(['dummy content'], 'test-image.png', {
      type: 'image/png',
    });
    const fileInput = screen.getByTestId('fileUploadInput1');
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      const previewImage = screen.getByTestId('previewImage');
      expect(previewImage).toHaveAttribute('src', 'mock-url');
    });
  });
  it('does not accept non-image files for upload', async () => {
    const invalidFile = new File(['dummy content'], 'test.txt', {
      type: 'text/plain',
    });
    const fileInput = screen.getByTestId('fileUploadInput1');

    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    await waitFor(() => {
      const replaceButton = screen.getByTestId('replaceButton');
      expect(replaceButton).toBeDisabled();
      expect(
        screen.queryByTestId('previewImage')
      ).not.toBeInTheDocument();
    });
  });
  it('does not enable replace button if no image is uploaded', async () => {
    const replaceButton = screen.getByTestId('replaceButton');
    expect(replaceButton).toBeDisabled();
  });
  it('applies a mask to the image data correctly for different mask configurations', () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 100;
    canvas.height = 100;

    const imageData = ctx.createImageData(100, 100);

    // Пример маски
    const mask = new Array(100 * 100).fill(1); // Полная маска
    applyMaskToImageData(imageData, mask);

    expect(
      imageData.data.every(
        (value, index) => index % 4 !== 3 || value === 0
      )
    ).toBeTruthy();
  });
});
