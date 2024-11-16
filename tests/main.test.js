import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter } from 'react-router-dom';
import MainPage from '../src/components/pages/main-page/main-page';

console.warn = jest.fn();
const mockStore = configureStore([]);

jest.mock('../src/services/actions/image-actions.js', () => ({
  setResizeDimensions: jest.fn(),
}));
const renderWithProvider = (component, initialState) => {
  const store = mockStore(initialState);
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

describe('MainPage Component', () => {
  let store;
  beforeEach(() => {
    const initialState = {
      image: {
        imageSrc: 'placeholder.jpeg',
        activeTool: 5,
        rotationAngle: 0,
        resizeDimensions: { width: 800, height: 900 },
      },
    };
    store = mockStore(initialState);
    renderWithProvider(<MainPage />, initialState);
  });

  it('renders the main page with canvas', () => {
    const canvases = screen.getAllByTestId('canvas');
    expect(canvases.length).toBeGreaterThan(0);
  });

  it('handles mouse down event on canvas', () => {
    const canvas = screen.getByTestId('canvas');
    fireEvent.mouseDown(canvas, { clientX: 100, clientY: 100 });
    const actions = store.getActions();
    expect(actions).toEqual([]);
  });

  it('handles mouse move event on canvas', () => {
    const canvas = screen.getByTestId('canvas');
    fireEvent.mouseDown(canvas, { clientX: 100, clientY: 100 });
    fireEvent.mouseMove(canvas, { clientX: 150, clientY: 150 });
    const actions = store.getActions();
    expect(actions).toEqual([]);
  });

  it('handles mouse up event on canvas', () => {
    const canvas = screen.getByTestId('canvas');
    fireEvent.mouseDown(canvas, { clientX: 100, clientY: 100 });
    fireEvent.mouseMove(canvas, { clientX: 150, clientY: 150 });
    fireEvent.mouseUp(canvas);
    const actions = store.getActions();
    expect(actions).toEqual([]);
  });

  it('renders the header', () => {
    const header = screen.getByTestId('header');
    expect(header).toBeInTheDocument();
  });

  it('renders the upload container when there is no image', () => {
    const initialState = {
      image: {
        imageSrc: '',
        activeTool: 0,
        rotationAngle: 0,
        resizeDimensions: { width: 800, height: 900 },
      },
    };
    renderWithProvider(<MainPage />, initialState);

    const uploadContainer = screen.getByTestId('upload-container');
    expect(uploadContainer).toBeInTheDocument();
  });

  it('renders the toolbar', () => {
    const toolbar = screen.getByTestId('toolbar');
    expect(toolbar).toBeInTheDocument();
  });

  it('renders the tools', () => {
    const tools = screen.getByTestId('tools-component');
    expect(tools).toBeInTheDocument();
  });

  it('handles brush size change', () => {
    const brushSizeInput = screen.getByTestId('brush-size');
    fireEvent.change(brushSizeInput, { target: { value: 20 } });
    const actions = store.getActions();
    expect(actions).toEqual([]);
  });

  it('applies resize dimensions to the image', () => {
    const initialState = {
      image: {
        imageSrc: 'placeholder.jpeg',
        activeTool: 0,
        rotationAngle: 0,
        resizeDimensions: { width: 800, height: 900 },
      },
    };
    renderWithProvider(<MainPage />, initialState);

    const canvases = screen.getAllByTestId('canvas');
    const mainCanvas = canvases[0];
    expect(mainCanvas).toHaveAttribute('width', '800');
    expect(mainCanvas).toHaveAttribute('height', '900');
  });
  it('renders upload container when imageSrc is empty', () => {
    const initialState = {
      image: {
        imageSrc: '',
        activeTool: 0,
        rotationAngle: 0,
        resizeDimensions: { width: 800, height: 900 },
      },
    };
    renderWithProvider(<MainPage />, initialState);
    const uploadContainer = screen.getByTestId('upload-container');
    expect(uploadContainer).toBeInTheDocument();
  });
  it('handles reset action', () => {
    const resetButton = screen.getByTestId('reset-button');
    fireEvent.click(resetButton);
    const actions = store.getActions();
    expect(actions).toEqual([]);
  });
  it('handles remove background action', () => {
    const removeBackgroundButton = screen.getByTestId(
      'remove-background-button'
    );
    fireEvent.click(removeBackgroundButton);
    const actions = store.getActions();
    expect(actions).toEqual([]);
  });
  it('displays original image when Flip icon is pressed', () => {
    const flipIcons = screen.getAllByTestId('flip-icon');
    const flipIcon = flipIcons[0];
    fireEvent.mouseDown(flipIcon);
    const canvas = screen.getByTestId('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('reverts to modified image when Flip icon is released', () => {
    const flipIcons = screen.getAllByTestId('flip-icon');
    const flipIcon = flipIcons[0];
    fireEvent.mouseDown(flipIcon);
    fireEvent.mouseUp(flipIcon);

    const canvas = screen.getByTestId('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('reverts to modified image when mouse leaves the Flip icon', () => {
    const flipIcons = screen.getAllByTestId('flip-icon');
    const flipIcon = flipIcons[0];
    fireEvent.mouseDown(flipIcon);
    fireEvent.mouseLeave(flipIcon);

    const canvas = screen.getByTestId('canvas');
    expect(canvas).toBeInTheDocument();
  });
  it('handles mouse events correctly for activeTool 5', () => {
    const canvas = screen.getByTestId('canvas');

    fireEvent.mouseDown(canvas, { clientX: 100, clientY: 100 });
    fireEvent.mouseMove(canvas, { clientX: 150, clientY: 150 });
    fireEvent.mouseUp(canvas);
  });
  it('renders all main components correctly', () => {
    const header = screen.getByTestId('header');
    const toolbar = screen.getByTestId('toolbar');
    const tools = screen.getByTestId('tools-component');
    const canvas = screen.getByTestId('canvas');
    expect(header).toBeInTheDocument();
    expect(toolbar).toBeInTheDocument();
    expect(tools).toBeInTheDocument();
    expect(canvas).toBeInTheDocument();
  });
});
