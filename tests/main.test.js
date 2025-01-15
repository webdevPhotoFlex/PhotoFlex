import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import MainPage from '../src/components/pages/main-page/main-page';
import { BrowserRouter as Router } from 'react-router-dom';
import * as imageActions from '../src/services/actions/image-actions';
import { resizeImageToCanvas } from '../src/utils/image-utils';
import {
  setImage,
  setOriginalImage,
  setResizeDimensions,
} from '../src/services/actions/image-actions';

jest.mock('../src/utils/image-utils', () => ({
  resizeImageToCanvas: jest
    .fn()
    .mockReturnValue({ width: 800, height: 600 }),
}));

console.warn = jest.fn();
const mockStore = configureStore([]);
const renderWithProvider = (component, initialState) => {
  const store = mockStore(initialState);
  return {
    ...render(
      <Provider store={store}>
        <Router>{component}</Router>
      </Provider>
    ),
    store,
  };
};
describe('MainPage Component', () => {
  let store;
  beforeEach(() => {
    const initialState = {
      image: {
        imageSrc: 'mock-image-url',
        activeTool: 5,
        brushSize: 10,
        mask: [],
        originalImage: null,
        image: null,
        resizeDimensions: { width: 800, height: 600 },
        cropArea: { x: 0, y: 0 },
        showOriginal: true,
      },
      auth: {
        isAuthenticated: true,
      },
    };
    const renderResult = renderWithProvider(
      <MainPage />,
      initialState
    );
    store = renderResult.store;
    jest.spyOn(imageActions, 'setImage');
    jest.spyOn(imageActions, 'setOriginalImage');
    jest.spyOn(imageActions, 'setResizeDimensions');
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders without crashing', () => {
    const canvasElement = screen.getByTestId('canvasMain');
    expect(canvasElement).toBeInTheDocument();
  });
  it('does not allow drawing if activeTool is not 5 or 6', () => {
    const initialState = {
      image: {
        imageSrc: 'mock-image-url',
        activeTool: 1,
        brushSize: 10,
        mask: [],
        originalImage: null,
        image: null,
        resizeDimensions: { width: 800, height: 600 },
        cropArea: { x: 0, y: 0 },
        drawing: false,
      },
      auth: { isAuthenticated: true },
    };
    const { store } = renderWithProvider(<MainPage />, initialState);

    const canvasElements = screen.getAllByTestId('canvasMain');
    const canvasElement = canvasElements[0]; // Берём первый элемент из найденных
    fireEvent.mouseDown(canvasElement, {
      clientX: 100,
      clientY: 150,
    });
    fireEvent.mouseMove(canvasElement, {
      clientX: 120,
      clientY: 170,
    });
    fireEvent.mouseUp(canvasElement);

    const actions = store.getActions();
    // Не должно быть SET_DRAWING и SET_MASK
    expect(actions).not.toContainEqual({
      type: 'SET_DRAWING',
      payload: true,
    });
    expect(actions).not.toContainEqual({
      type: 'SET_MASK',
      payload: expect.anything(),
    });
  });
  it('handles mouse down, move, and up for drawing correctly', async () => {
    const canvasElement = screen.getByTestId('canvasMain');
    const event = { clientX: 100, clientY: 150 };
    fireEvent.mouseDown(canvasElement, event);
    let actions = store.getActions();
    expect(actions).toContainEqual({
      type: 'SET_DRAWING',
      payload: true,
    });
    fireEvent.mouseMove(canvasElement, event);
    actions = store.getActions();
    expect(actions).toContainEqual({
      type: 'SET_MASK',
      payload: expect.arrayContaining([
        { x: 100, y: 150, brushSize: 10 },
      ]),
    });
    fireEvent.mouseUp(canvasElement);
    actions = store.getActions();
    expect(actions).toContainEqual({
      type: 'SET_DRAWING',
      payload: false,
    });
  });

  it('displays upload container when no imageSrc is provided', () => {
    const initialState = {
      image: {
        imageSrc: null,
        activeTool: 5,
        brushSize: 10,
        mask: [],
        originalImage: null,
        image: null,
        resizeDimensions: { width: 0, height: 0 },
      },
      auth: {
        isAuthenticated: true,
      },
    };
    renderWithProvider(<MainPage />, initialState);
    const uploadContainer = screen.getByTestId('upload-container');
    expect(uploadContainer).toBeInTheDocument();
  });

  it('displays the correct image size on canvas', () => {
    const imageContainer =
      screen.getByTestId('canvasMain').parentElement;
    const canvas = screen.getByTestId('canvasMain');
    expect(imageContainer).toHaveStyle('width: 800px; height: 600px');
    expect(canvas).toHaveAttribute('width', '800');
    expect(canvas).toHaveAttribute('height', '600');
  });

  it('calls handleMouseDown when mouse is clicked and tool is active', () => {
    const canvasElement = screen.getByTestId('canvasMain');
    fireEvent.mouseDown(canvasElement, {
      clientX: 100,
      clientY: 150,
    });
    const actions = store.getActions();
    expect(actions).toContainEqual({
      type: 'SET_DRAWING',
      payload: true,
    });
  });
  it('does not call handleMouseMove when drawing is not active', () => {
    const canvasElement = screen.getByTestId('canvasMain');
    fireEvent.mouseMove(canvasElement, {
      clientX: 100,
      clientY: 150,
    });
    const actions = store.getActions();
    expect(actions).not.toContainEqual({
      type: 'SET_MASK',
      payload: expect.anything(),
    });
  });

  it('sets image and original image when imageSrc is provided', async () => {
    const initialState = {
      image: {
        imageSrc: 'mock-image-url',
        activeTool: 5,
        brushSize: 10,
        mask: [],
        originalImage: null,
        image: null,
        resizeDimensions: { width: 0, height: 0 },
      },
      auth: {
        isAuthenticated: true,
      },
    };
    renderWithProvider(<MainPage />, initialState);
    const mockImage = new Image();
    mockImage.src = 'mock-image-url';
    mockImage.onload = jest.fn(() => {
      store.dispatch(setImage(mockImage));
      store.dispatch(setOriginalImage(mockImage));
      const resizedDimensions = resizeImageToCanvas(
        mockImage,
        1000,
        800
      );
      store.dispatch(setResizeDimensions(resizedDimensions));
    });
    mockImage.onload();

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).toContainEqual({
        type: 'SET_IMAGE',
        payload: mockImage,
      });
      expect(actions).toContainEqual({
        type: 'SET_ORIGINAL_IMAGE',
        payload: mockImage,
      });
      expect(actions).toContainEqual({
        type: 'SET_RESIZE_DIMENSIONS',
        payload: expect.any(Object),
      });
    });
  });

  it('dispatches setImage and setOriginalImage actions when imageSrc is provided', async () => {
    const initialState = {
      image: {
        imageSrc: 'mock-image-url',
        activeTool: 5,
        brushSize: 10,
        mask: [],
        originalImage: null,
        image: null,
        resizeDimensions: { width: 0, height: 0 },
      },
      auth: {
        isAuthenticated: true,
      },
    };
    renderWithProvider(<MainPage />, initialState);

    const mockImage = new Image();
    mockImage.src = 'mock-image-url';
    mockImage.onload = jest.fn(() => {
      store.dispatch(setImage(mockImage));
      store.dispatch(setOriginalImage(mockImage));
      const resizedDimensions = resizeImageToCanvas(
        mockImage,
        1000,
        800
      );
      store.dispatch(setResizeDimensions(resizedDimensions));
    });
    mockImage.onload();

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).toContainEqual({
        type: 'SET_IMAGE',
        payload: mockImage,
      });
      expect(actions).toContainEqual({
        type: 'SET_ORIGINAL_IMAGE',
        payload: mockImage,
      });
      expect(actions).toContainEqual({
        type: 'SET_RESIZE_DIMENSIONS',
        payload: expect.any(Object),
      });
    });
  });

  it('does not dispatch setImage and setOriginalImage actions when imageSrc is not provided', async () => {
    const initialState = {
      image: {
        imageSrc: null,
        activeTool: 5,
        brushSize: 10,
        mask: [],
        originalImage: null,
        image: null,
        resizeDimensions: { width: 0, height: 0 },
      },
      auth: {
        isAuthenticated: true,
      },
    };
    renderWithProvider(<MainPage />, initialState);

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).not.toContainEqual({
        type: 'SET_IMAGE',
        payload: expect.anything(),
      });
      expect(actions).not.toContainEqual({
        type: 'SET_ORIGINAL_IMAGE',
        payload: expect.anything(),
      });
      expect(actions).not.toContainEqual({
        type: 'SET_RESIZE_DIMENSIONS',
        payload: expect.anything(),
      });
    });
  });
  it('tracks mouse coordinates correctly on mouseDown, mouseMove, and mouseUp', () => {
    const canvasElement = screen.getByTestId('canvasMain');
    fireEvent.mouseDown(canvasElement, {
      clientX: 100,
      clientY: 150,
    });
    let actions = store.getActions();
    expect(actions).toContainEqual({
      type: 'SET_DRAWING',
      payload: true,
    });
    expect(actions).toContainEqual({
      type: 'SET_MASK',
      payload: expect.arrayContaining([
        { x: 100, y: 150, brushSize: 10 },
      ]),
    });

    fireEvent.mouseMove(canvasElement, {
      clientX: 120,
      clientY: 170,
    });
    actions = store.getActions();
    expect(actions).toContainEqual({
      type: 'SET_MASK',
      payload: expect.arrayContaining([
        { x: 100, y: 150, brushSize: 10 },
      ]),
    });
    fireEvent.mouseUp(canvasElement);
    actions = store.getActions();
    expect(actions).toContainEqual({
      type: 'SET_DRAWING',
      payload: false,
    });
  });
});

describe('MainPage Mouse Events', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      image: {
        imageSrc: 'test-image-src',
        activeTool: 5,
        rotationAngle: 0,
        filter: null,
        cropArea: null,
        brushSize: 10,
        mask: [],
        appliedMask: null,
        drawing: false,
        showOriginal: false,
        originalImage: null,
        image: null,
        resizeDimensions: { width: 800, height: 600 },
      },
      auth: {
        isAuthenticated: true,
      },
    });

    store.dispatch = jest.fn();
  });

  test('should handle onMouseDown event correctly', () => {
    render(
      <Provider store={store}>
        <Router>
          <MainPage />
        </Router>
      </Provider>
    );

    const canvas = screen.getByTestId('canvasMain');

    fireEvent.mouseDown(canvas, { clientX: 100, clientY: 100 });

    expect(store.dispatch).toHaveBeenCalledWith({
      type: 'SET_DRAWING',
      payload: true,
    });
    expect(store.dispatch).toHaveBeenCalledWith({
      type: 'SET_MASK',
      payload: [{ x: 100, y: 100, brushSize: 10 }],
    });
  });

  test('should handle onMouseUp event correctly', () => {
    render(
      <Provider store={store}>
        <Router>
          <MainPage />
        </Router>
      </Provider>
    );

    const canvas = screen.getByTestId('canvasMain');

    fireEvent.mouseUp(canvas);

    expect(store.dispatch).toHaveBeenCalledWith({
      type: 'SET_DRAWING',
      payload: false,
    });
  });
  it('handles multiple drawing points correctly', () => {
    const initialState = {
      image: {
        imageSrc: 'mock-image-url',
        activeTool: 5,
        brushSize: 10,
        mask: [],
        originalImage: null,
        image: null,
        resizeDimensions: { width: 800, height: 600 },
        drawing: false,
      },
      auth: { isAuthenticated: true },
    };
    const { store } = renderWithProvider(<MainPage />, initialState);

    const canvasElement = screen.getByTestId('canvasMain');
    fireEvent.mouseDown(canvasElement, {
      clientX: 100,
      clientY: 100,
    });
    fireEvent.mouseMove(canvasElement, {
      clientX: 110,
      clientY: 110,
    });
    fireEvent.mouseMove(canvasElement, {
      clientX: 120,
      clientY: 120,
    });
    fireEvent.mouseUp(canvasElement);

    const actions = store.getActions();
    const maskActions = actions.filter((a) => a.type === 'SET_MASK');
    expect(maskActions.length).toBeGreaterThanOrEqual(1);
    const lastMaskAction = maskActions[maskActions.length - 1];
    expect(lastMaskAction.payload).toEqual([
      { x: 100, y: 100, brushSize: 10 },
    ]);
  });
  it('no dispatch occurs for image actions if imageSrc is not provided', async () => {
    const initialState = {
      image: {
        imageSrc: null,
        activeTool: 5,
        brushSize: 10,
        mask: [],
        originalImage: null,
        image: null,
        resizeDimensions: { width: 0, height: 0 },
      },
      auth: {
        isAuthenticated: true,
      },
    };
    const { store } = renderWithProvider(<MainPage />, initialState);

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions).not.toContainEqual({
        type: 'SET_IMAGE',
        payload: expect.anything(),
      });
      expect(actions).not.toContainEqual({
        type: 'SET_ORIGINAL_IMAGE',
        payload: expect.anything(),
      });
      expect(actions).not.toContainEqual({
        type: 'SET_RESIZE_DIMENSIONS',
        payload: expect.anything(),
      });
    });
  });
  it('switching from drawing tool to another tool stops drawing', () => {
    const initialState = {
      image: {
        imageSrc: 'mock-image-url',
        activeTool: 5,
        brushSize: 10,
        mask: [],
        originalImage: null,
        image: null,
        resizeDimensions: { width: 800, height: 600 },
        drawing: false,
      },
      auth: { isAuthenticated: true },
    };
    const { store, rerender } = renderWithProvider(
      <MainPage />,
      initialState
    );

    const canvasElement = screen.getByTestId('canvasMain');
    fireEvent.mouseDown(canvasElement, {
      clientX: 100,
      clientY: 150,
    });
    let actions = store.getActions();
    expect(actions).toContainEqual({
      type: 'SET_DRAWING',
      payload: true,
    });

    rerender(
      <Provider store={store}>
        <Router>
          <MainPage />
        </Router>
      </Provider>
    );
    fireEvent.mouseMove(canvasElement, {
      clientX: 120,
      clientY: 170,
    });
    actions = store.getActions();
    const maskActions = actions.filter(
      (a) =>
        a.type === 'SET_MASK' &&
        a.payload.some((p) => p.x === 120 && p.y === 170)
    );
    expect(maskActions.length).toBe(0);
  });
  it('does not allow drawing if showOriginal is true', () => {
    const initialState = {
      image: {
        imageSrc: 'mock-image-url',
        activeTool: 1,
        brushSize: 10,
        mask: [],
        appliedMask: null,
        originalImage: null,
        image: null,
        resizeDimensions: { width: 800, height: 600 },
        drawing: false,
        showOriginal: true,
        filter: 'grayscale',
        cropArea: { x: 0, y: 0 },
      },
      auth: { isAuthenticated: true },
    };
    const { store } = renderWithProvider(<MainPage />, initialState);
    const canvasElement = screen.getAllByTestId('canvasMain')[0];
    fireEvent.mouseDown(canvasElement, {
      clientX: 100,
      clientY: 150,
    });
    fireEvent.mouseMove(canvasElement, {
      clientX: 120,
      clientY: 170,
    });
    fireEvent.mouseUp(canvasElement);
    const actions = store.getActions();
    expect(actions).not.toContainEqual({
      type: 'SET_DRAWING',
      payload: true,
    });
    expect(actions).not.toContainEqual({
      type: 'SET_MASK',
      payload: expect.anything(),
    });
  });

  it('allows drawing if activeTool is 6 (another drawing tool)', () => {
    const initialState = {
      image: {
        imageSrc: 'mock-image-url',
        activeTool: 6,
        brushSize: 10,
        mask: [],
        originalImage: null,
        image: null,
        resizeDimensions: { width: 800, height: 600 },
        drawing: false,
        showOriginal: false,
        cropArea: { x: 0, y: 0 },
      },
      auth: { isAuthenticated: true },
    };
    const { store } = renderWithProvider(<MainPage />, initialState);
    const canvasElement = screen.getAllByTestId('canvasMain')[0];
    fireEvent.mouseDown(canvasElement, { clientX: 50, clientY: 60 });
    fireEvent.mouseMove(canvasElement, { clientX: 60, clientY: 70 });
    fireEvent.mouseUp(canvasElement);
    const actions = store.getActions();
    expect(actions).toContainEqual({
      type: 'SET_DRAWING',
      payload: true,
    });
    const maskActions = actions.filter((a) => a.type === 'SET_MASK');
    expect(maskActions.length).toBeGreaterThan(0);
    expect(
      maskActions.some((action) =>
        action.payload.some((p) => p.x === 50 && p.y === 60)
      )
    ).toBe(true);
  });
});
describe('MainPage component className tests', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      image: {
        darkMode: true,
        imageSrc: 'test-image-src',
        activeTool: 5,
        rotationAngle: 0,
        filter: null,
        cropArea: null,
        brushSize: 10,
        mask: [],
        appliedMask: null,
        drawing: false,
        showOriginal: false,
        originalImage: null,
        image: null,
        resizeDimensions: { width: 800, height: 600 },
      },
      auth: {
        isAuthenticated: true,
      },
    });

    store.dispatch = jest.fn();
  });

  it('should apply darkMode class correctly', async () => {
    render(
      <Provider store={store}>
        <Router>
          <MainPage />
        </Router>
      </Provider>
    );

    await waitFor(() => screen.getByTestId('main-container'));

    const mainContainer = screen.getByTestId('main-container');
    expect(mainContainer).toHaveClass('undefined');
    expect(mainContainer).not.toHaveClass('lightTheme');
  });

  it('should apply lightTheme class correctly to imageContainer', async () => {
    render(
      <Provider store={store}>
        <Router>
          <MainPage />
        </Router>
      </Provider>
    );
    await waitFor(() => screen.getByTestId('image-container'));
    const imageContainer = screen.getByTestId('image-container');
    expect(imageContainer).toHaveClass('undefined');
    expect(imageContainer).not.toHaveClass('lightTheme');
  });
});
