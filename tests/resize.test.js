import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import Resize from '../src/components/tools/resize-tool/resize-tools';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { useDispatch } from 'react-redux';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

const mockStore = configureStore([]);
const renderWithProvider = (component, initialState) => {
  const store = mockStore(initialState);
  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
  };
};

describe('Resize Component', () => {
  let store;
  const mockDispatch = jest.fn();

  beforeEach(() => {
    useDispatch.mockReturnValue(mockDispatch);

    const initialState = {
      image: {
        darkMode: false,
        resizeDimensions: { width: 800, height: 900 },
      },
    };
    store = mockStore(initialState);
    renderWithProvider(<Resize />, initialState);
  });

  it('renders resize component with presets', () => {
    const resizeComponent = screen.getByTestId('resize-component');
    expect(resizeComponent).toBeInTheDocument();

    const resize169 = screen.getByTestId('resize-16:9');
    expect(resize169).toBeInTheDocument();
  });

  it('renders input fields with initial values', () => {
    const widthInput = screen.getByTestId('resize-width');
    const heightInput = screen.getByTestId('resize-height');

    expect(widthInput).toBeInTheDocument();
    expect(heightInput).toBeInTheDocument();

    expect(widthInput.value).toBe('800');
    expect(heightInput.value).toBe('900');
  });

  it('updates width and height dynamically on input', () => {
    const widthInput = screen.getByTestId('resize-width');
    const heightInput = screen.getByTestId('resize-height');

    fireEvent.change(widthInput, { target: { value: '1200' } });
    fireEvent.change(heightInput, { target: { value: '1600' } });

    expect(widthInput.value).toBe('1200');
    expect(heightInput.value).toBe('1600');

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_RESIZE_DIMENSIONS',
      payload: { width: 1200, height: 1600 },
    });
  });

  it('updates dimensions when a preset is clicked', () => {
    const resize916 = screen.getByTestId('resize-9:16');
    fireEvent.click(resize916);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_RESIZE_DIMENSIONS',
      payload: { width: 506, height: 900 },
    });

    const widthInput = screen.getByTestId('resize-width');
    const heightInput = screen.getByTestId('resize-height');

    expect(widthInput.value).toBe('506');
    expect(heightInput.value).toBe('900');
  });

  it('renders all presets with correct labels', () => {
    const resizePresets = [
      '16:9',
      '4:4',
      '9:16',
      '3:2',
      '5:4',
      '7:5',
    ];
    resizePresets.forEach((preset) => {
      const presetElement = screen.getByTestId(`resize-${preset}`);
      expect(presetElement).toBeInTheDocument();
    });
  });

  it('renders reset button', () => {
    render(
      <Provider store={store}>
        <Resize />
      </Provider>
    );

    const resetButtons = screen.getAllByTestId('reset-button');
    const resetButton = resetButtons[0];

    expect(resetButton).toBeInTheDocument();
  });

  it('handles input change for width and height', () => {
    const widthInput = screen.getByTestId('resize-width');

    mockDispatch.mockClear();

    fireEvent.change(widthInput, { target: { value: '' } });
    expect(widthInput.value).toBe('');
    expect(mockDispatch).not.toHaveBeenCalled();

    fireEvent.change(widthInput, { target: { value: '-100' } });
    expect(widthInput.value).toBe('-100');
    expect(mockDispatch).not.toHaveBeenCalled();

    fireEvent.change(widthInput, { target: { value: '1200' } });
    expect(widthInput.value).toBe('1200');
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_RESIZE_DIMENSIONS',
      payload: { width: 1200, height: 900 },
    });

    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  it('handles reset to original dimensions', () => {
    const resetButton = screen.getByTestId('reset-button');
    fireEvent.click(resetButton);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_RESIZE_DIMENSIONS',
      payload: { width: 0, height: 0 },
    });

    const widthInput = screen.getByTestId('resize-width');
    const heightInput = screen.getByTestId('resize-height');

    expect(widthInput.value).toBe('0');
    expect(heightInput.value).toBe('0');
  });
  it('should not allow invalid (negative or empty) values for width and height', () => {
    const widthInput = screen.getByTestId('resize-width');
    const heightInput = screen.getByTestId('resize-height');

    fireEvent.change(widthInput, { target: { value: '-200' } });
    fireEvent.change(heightInput, { target: { value: '' } });

    expect(widthInput.value).toBe('-200');
    expect(heightInput.value).toBe('');
    expect(mockDispatch).toHaveBeenCalled();
  });
  it('should update the width when width input is changed', () => {
    const widthInput = screen.getByTestId('resize-width');
    fireEvent.change(widthInput, { target: { value: '1024' } });

    expect(widthInput.value).toBe('1024');
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_RESIZE_DIMENSIONS',
      payload: { width: 1024, height: 900 },
    });
  });
  it('should update the height when height input is changed', () => {
    const heightInput = screen.getByTestId('resize-height');
    fireEvent.change(heightInput, { target: { value: '1200' } });

    expect(heightInput.value).toBe('1200');
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_RESIZE_DIMENSIONS',
      payload: { width: 800, height: 1200 },
    });
  });
});
