import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Tools from '../src/components/tools/tools';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);

const renderWithProvider = (component, initialState) => {
  const store = mockStore(initialState);
  return render(<Provider store={store}>{component}</Provider>);
};

describe('Tools Component', () => {
  it('renders Tunes component when activeTool is 0', () => {
    renderWithProvider(<Tools />, { image: { activeTool: 0 } });
    expect(screen.getByTestId('tunes-component')).toBeInTheDocument();
  });

  it('renders Crop component when activeTool is 1', () => {
    const initialState = {
      image: {
        activeTool: 1,
        cropArea: {
          x: 0,
          y: 0,
        },
      },
    };

    renderWithProvider(<Tools />, initialState);

    expect(screen.getByTestId('crop-component')).toBeInTheDocument();
    expect(screen.getByLabelText('X Coordinate')).toHaveValue(0);
    expect(screen.getByLabelText('Y Coordinate')).toHaveValue(0);
  });

  it('renders Rotate component when activeTool is 2', () => {
    renderWithProvider(<Tools />, { image: { activeTool: 2 } });
    expect(
      screen.getByTestId('rotate-component')
    ).toBeInTheDocument();
  });

  it('renders Filters component when activeTool is 4', () => {
    renderWithProvider(<Tools />, { image: { activeTool: 4 } });
    expect(
      screen.getByTestId('filters-component')
    ).toBeInTheDocument();
  });

  it('renders RemoveBgTool component when activeTool is 5', () => {
    const initialState = {
      image: {
        activeTool: 5,
        imageBeforeRemove: null,
        image: null,
        brushSize: 10,
        mask: [],
        resizeDimensions: { width: 800, height: 600 },
        rotationAngle: 0,
        cropArea: null,
      },
      auth: {
        isAuthenticated: true,
      },
    };

    renderWithProvider(
      <Tools canvasRef={{ current: null }} />,
      initialState
    );

    expect(
      screen.getByTestId('remove-bg-component')
    ).toBeInTheDocument();
  });

  it('renders ReplaceBgTool component when activeTool is 6', () => {
    const initialState = {
      image: {
        activeTool: 6,
        imageBeforeRemove: null,
        image: null,
        brushSize: 10,
        mask: [],
        rotationAngle: 0,
        cropArea: null,
      },
      auth: {
        isAuthenticated: true,
      },
    };

    renderWithProvider(
      <Tools canvasRef={{ current: null }} />,
      initialState
    );

    expect(
      screen.getByTestId('replace-bg-component')
    ).toBeInTheDocument();
  });

  it('renders GoogleRemoveBgTool component when activeTool is 7', () => {
    renderWithProvider(<Tools canvasRef={{}} />, {
      image: { activeTool: 7 },
    });
    expect(
      screen.getByTestId('media-pipe-component')
    ).toBeInTheDocument();
  });

  it('renders TextTool component when activeTool is 8', () => {
    const initialState = {
      image: {
        activeTool: 8,
        texts: [
          {
            id: 1,
            content: 'Sample text 1',
            x: 0,
            y: 0,
            color: 'black',
            fontSize: 16,
          },
          {
            id: 2,
            content: 'Sample text 2',
            x: 0,
            y: 0,
            color: 'black',
            fontSize: 16,
          },
        ],
      },
    };

    renderWithProvider(
      <Tools canvasRef={{ current: null }} />,
      initialState
    );

    expect(screen.getByTestId('text-component')).toBeInTheDocument();
    expect(screen.getByTestId('text-list')).toBeInTheDocument();
    expect(screen.getByText('Sample text 1')).toBeInTheDocument();
    expect(screen.getByText('Sample text 2')).toBeInTheDocument();
  });

  it('renders nothing for unsupported activeTool values', () => {
    renderWithProvider(<Tools />, { image: { activeTool: 9 } });
    expect(screen.queryByTestId('tunes-component')).toBeNull();
    expect(screen.queryByTestId('crop-component')).toBeNull();
    expect(screen.queryByTestId('rotate-component')).toBeNull();
    expect(screen.queryByTestId('resize-component')).toBeNull();
    expect(screen.queryByTestId('filters-component')).toBeNull();
    expect(screen.queryByTestId('remove-bg-component')).toBeNull();
    expect(screen.queryByTestId('replace-bg-component')).toBeNull();
    expect(screen.queryByTestId('media-pipe-component')).toBeNull();
    expect(screen.queryByTestId('text-component')).toBeNull();
  });
});
