import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Crop from '../src/components/tools/crop-tool/crop-tools';
import { setCropArea } from '../src/services/actions/image-actions';
import '@testing-library/jest-dom';

jest.mock('../src/services/actions/image-actions.js', () => ({
  setCropArea: jest.fn().mockReturnValue({ type: 'SET_CROP_AREA' }),
}));

const mockStore = configureStore([]);
let store;

describe('Crop Component', () => {
  beforeEach(() => {
    store = mockStore({
      image: {
        cropArea: { x: 10, y: 20 },
        darkMode: false,
      },
    });
    store.dispatch = jest.fn();
  });

  it('renders with initial state from Redux store', () => {
    render(
      <Provider store={store}>
        <Crop />
      </Provider>
    );

    const inputX = screen.getByLabelText('X Coordinate');
    const inputY = screen.getByLabelText('Y Coordinate');

    expect(inputX.value).toBe('10');
    expect(inputY.value).toBe('20');
  });

  it('applies light theme styles when darkMode is false', () => {
    render(
      <Provider store={store}>
        <Crop />
      </Provider>
    );

    const inputX = screen.getByLabelText('X Coordinate');
    const inputY = screen.getByLabelText('Y Coordinate');
    const labelX = screen.getByText('X:');
    const labelY = screen.getByText('Y:');

    expect(inputX).toHaveStyle('background-color: #fff');
    expect(inputX).toHaveStyle('color: #333');
    expect(inputY).toHaveStyle('background-color: #fff');
    expect(inputY).toHaveStyle('color: #333');
    expect(labelX).toHaveStyle('color: #333');
    expect(labelY).toHaveStyle('color: #333');
  });

  it('applies dark theme styles when darkMode is true', () => {
    store = mockStore({
      image: {
        cropArea: { x: 10, y: 20 },
        darkMode: true,
      },
    });

    render(
      <Provider store={store}>
        <Crop />
      </Provider>
    );

    const inputX = screen.getByLabelText('X Coordinate');
    const inputY = screen.getByLabelText('Y Coordinate');
    const labelX = screen.getByText('X:');
    const labelY = screen.getByText('Y:');

    expect(inputX).toHaveStyle('background-color: #333');
    expect(inputX).toHaveStyle('color: #fff');
    expect(inputY).toHaveStyle('background-color: #333');
    expect(inputY).toHaveStyle('color: #fff');
    expect(labelX).toHaveStyle('color: #fff');
    expect(labelY).toHaveStyle('color: #fff');
  });

  it('updates local state when input changes', () => {
    render(
      <Provider store={store}>
        <Crop />
      </Provider>
    );

    const inputX = screen.getByLabelText('X Coordinate');
    const inputY = screen.getByLabelText('Y Coordinate');

    fireEvent.change(inputX, { target: { value: '30' } });
    fireEvent.change(inputY, { target: { value: '40' } });

    expect(inputX.value).toBe('30');
    expect(inputY.value).toBe('40');
  });

  it('dispatches setCropArea action on input change', () => {
    render(
      <Provider store={store}>
        <Crop />
      </Provider>
    );

    const inputX = screen.getByLabelText('X Coordinate');
    fireEvent.change(inputX, { target: { value: '50' } });

    expect(setCropArea).toHaveBeenCalledWith({ x: 50, y: 20 });
    expect(store.dispatch).toHaveBeenCalled();
  });
  it('does not update crop area for non-numeric input', () => {
    render(
      <Provider store={store}>
        <Crop />
      </Provider>
    );

    const inputX = screen.getByLabelText('X Coordinate');
    fireEvent.change(inputX, { target: { value: 'abc' } });

    expect(store.dispatch).not.toHaveBeenCalledWith({
      type: 'SET_CROP_AREA',
      payload: { x: expect.any(Number), y: expect.any(Number) },
    });
  });
  it('renders reset button', () => {
    render(
      <Provider store={store}>
        <Crop />
      </Provider>
    );

    const resetButton = screen.getByTestId('reset-button');
    expect(resetButton).toBeInTheDocument();
  });
});
