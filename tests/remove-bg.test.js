import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import RemoveBgTool from '../src/components/tools/remove-bg-tool/remove-bg-tool';
import * as imageActions from '../src/services/actions/image-actions';
import * as imageUtils from '../src/utils/image-utils';
const mockStore = configureStore([]);
const renderWithProvider = (component, initialState) => {
  const store = mockStore(initialState);
  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
  };
};
jest.mock('../src/utils/image-utils', () => ({
  applyMaskToImageData: jest.fn(),
}));

describe('RemoveBgTool Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders RemoveBgTool component correctly', () => {
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

    renderWithProvider(
      <RemoveBgTool canvasRef={{ current: {} }} />,
      initialState
    );

    expect(screen.getByLabelText('brush size')).toBeInTheDocument();
    expect(screen.getByText('Удалить фон')).toBeInTheDocument();
    expect(screen.getByText('Сброс')).toBeInTheDocument();
  });

  it('disables "Удалить фон" button when no image is loaded', () => {
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

    renderWithProvider(
      <RemoveBgTool canvasRef={{ current: {} }} />,
      initialState
    );

    const removeBgButton = screen.getByText('Удалить фон');
    expect(removeBgButton).toBeDisabled();
  });

  it('dispatches setBrushSize action when brush size slider is changed', () => {
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
      <RemoveBgTool canvasRef={{ current: {} }} />,
      initialState
    );

    const brushSizeSlider = screen.getByLabelText('brush size');
    fireEvent.change(brushSizeSlider, { target: { value: '50' } });

    const actions = store.getActions();
    expect(actions).toEqual([
      { type: 'SET_BRUSH_SIZE', payload: 50 },
    ]);
  });

  it('dispatches setImageBeforeRemove when image is set', () => {
    const initialState = {
      image: {
        imageBeforeRemove: null,
        image: { src: 'test-image' },
        brushSize: 10,
        mask: [],
      },
      auth: {
        isAuthenticated: true,
      },
    };

    const spy = jest.spyOn(imageActions, 'setImageBeforeRemove');
    renderWithProvider(
      <RemoveBgTool canvasRef={{ current: {} }} />,
      initialState
    );

    expect(spy).toHaveBeenCalledWith({ src: 'test-image' });
  });

  it('disables "Сброс" button when no imageBeforeRemove is available', () => {
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

    renderWithProvider(
      <RemoveBgTool canvasRef={{ current: {} }} />,
      initialState
    );

    const resetButton = screen.getByText('Сброс');
    expect(resetButton).toBeDisabled();
  });

  it('calls handleReset correctly', () => {
    const initialState = {
      image: {
        imageBeforeRemove: { src: 'original-image' },
        image: { src: 'test-image' },
        brushSize: 10,
        mask: [],
      },
      auth: {
        isAuthenticated: true,
      },
    };

    const { store } = renderWithProvider(
      <RemoveBgTool canvasRef={{ current: {} }} />,
      initialState
    );

    const resetButton = screen.getByText('Сброс');
    fireEvent.click(resetButton);

    const actions = store.getActions();
    expect(actions).toContainEqual({
      type: 'SET_IMAGE',
      payload: { src: 'original-image' },
    });
    expect(actions).toContainEqual({ type: 'SET_MASK', payload: [] });
  });

  it('should render RemoveBgTool if user is authenticated', () => {
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

    renderWithProvider(
      <RemoveBgTool canvasRef={{ current: {} }} />,
      initialState
    );

    expect(screen.getByLabelText('brush size')).toBeInTheDocument();
    expect(screen.getByText('Удалить фон')).toBeInTheDocument();
  });
  it('renders AuthRequired when the user is not authenticated', () => {
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

    renderWithProvider(
      <RemoveBgTool canvasRef={{ current: {} }} />,
      initialState
    );
    expect(
      screen.getByText(
        'Вы должны авторизироваться для использования этого инструмента.'
      )
    ).toBeInTheDocument();
  });

  it('should do nothing if no image is loaded or canvas is not available', () => {
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

    const canvasRef = { current: null };
    const { store } = renderWithProvider(
      <RemoveBgTool canvasRef={canvasRef} />,
      initialState
    );
    fireEvent.click(screen.getByText('Удалить фон'));
    const actions = store.getActions();
    expect(actions).toHaveLength(0);
  });
  it('does not overwrite imageBeforeRemove if it is already set', () => {
    const initialState = {
      image: {
        imageBeforeRemove: { src: 'original-image' },
        image: { src: 'test-image' },
        brushSize: 10,
        mask: [],
      },
      auth: {
        isAuthenticated: true,
      },
    };

    const spy = jest.spyOn(imageActions, 'setImageBeforeRemove');
    renderWithProvider(
      <RemoveBgTool canvasRef={{ current: {} }} />,
      initialState
    );

    expect(spy).not.toHaveBeenCalled();
  });
  it('calls applyMaskToImageData when mask is present in handleRemoveBackground', () => {
    const initialState = {
      image: {
        imageBeforeRemove: null,
        image: { src: 'test-image' },
        brushSize: 10,
        mask: [1, 2, 3], // Маска присутствует
      },
      auth: {
        isAuthenticated: true,
      },
    };

    const canvasMock = {
      current: {
        getContext: jest.fn(() => ({
          clearRect: jest.fn(),
          drawImage: jest.fn(),
          getImageData: jest.fn(() => ({ data: [] })),
          putImageData: jest.fn(),
        })),
        toDataURL: jest.fn(() => 'data:image/png;base64,test'),
      },
    };

    const { store } = renderWithProvider(
      <RemoveBgTool canvasRef={canvasMock} />,
      initialState
    );

    fireEvent.click(screen.getByText('Удалить фон'));

    expect(imageUtils.applyMaskToImageData).toHaveBeenCalledWith(
      expect.any(Object),
      [1, 2, 3] // Маска
    );
    expect(store.getActions()).toContainEqual({
      type: 'SET_MASK',
      payload: [],
    });
  });

  it('does not call applyMaskToImageData when mask is empty', () => {
    const initialState = {
      image: {
        imageBeforeRemove: null,
        image: { src: 'test-image' },
        brushSize: 10,
        mask: [], // Маска отсутствует
      },
      auth: {
        isAuthenticated: true,
      },
    };

    const canvasMock = {
      current: {
        getContext: jest.fn(() => ({
          clearRect: jest.fn(),
          drawImage: jest.fn(),
          getImageData: jest.fn(() => ({ data: [] })),
          putImageData: jest.fn(),
        })),
        toDataURL: jest.fn(() => 'data:image/png;base64,test'),
      },
    };

    renderWithProvider(
      <RemoveBgTool canvasRef={canvasMock} />,
      initialState
    );

    fireEvent.click(screen.getByText('Удалить фон'));

    expect(imageUtils.applyMaskToImageData).not.toHaveBeenCalled();
  });

  it('calls setImageBeforeRemove when imageBeforeRemove is not set', () => {
    const initialState = {
      image: {
        imageBeforeRemove: null,
        image: { src: 'test-image' },
        brushSize: 10,
        mask: [],
      },
      auth: {
        isAuthenticated: true,
      },
    };

    const spy = jest.spyOn(imageActions, 'setImageBeforeRemove');
    renderWithProvider(
      <RemoveBgTool canvasRef={{ current: {} }} />,
      initialState
    );

    expect(spy).toHaveBeenCalledWith({ src: 'test-image' });
  });

  it('does not call setImageBeforeRemove when imageBeforeRemove is already set', () => {
    const initialState = {
      image: {
        imageBeforeRemove: { src: 'original-image' },
        image: { src: 'test-image' },
        brushSize: 10,
        mask: [],
      },
      auth: {
        isAuthenticated: true,
      },
    };

    const spy = jest.spyOn(imageActions, 'setImageBeforeRemove');
    renderWithProvider(
      <RemoveBgTool canvasRef={{ current: {} }} />,
      initialState
    );

    expect(spy).not.toHaveBeenCalled();
  });

  it('handles handleReset correctly when imageBeforeRemove is null', () => {
    const initialState = {
      image: {
        imageBeforeRemove: null,
        image: { src: 'test-image' },
        brushSize: 10,
        mask: [],
      },
      auth: {
        isAuthenticated: true,
      },
    };

    const { store } = renderWithProvider(
      <RemoveBgTool canvasRef={{ current: {} }} />,
      initialState
    );

    fireEvent.click(screen.getByText('Сброс'));

    const actions = store.getActions();
    expect(actions).toContainEqual({
      payload: { src: 'test-image' },
      type: 'SET_IMAGE_BEFORE_REMOVE',
    });
  });
});
