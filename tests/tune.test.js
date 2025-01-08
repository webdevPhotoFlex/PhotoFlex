import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Tunes from '../src/components/tools/tune-tool/tunes-tools';
import { setTunes } from '../src/services/actions/image-actions';

const mockStore = configureStore([]);

describe('Tunes Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      image: {
        tune: {
          brightness: 50,
          contrast: 50,
          saturation: 50,
          sharpness: 100,
        },
      },
    });
    store.dispatch = jest.fn();
  });

  it('renders all sliders correctly', () => {
    render(
      <Provider store={store}>
        <Tunes />
      </Provider>
    );

    const sliders = screen.getAllByRole('slider');
    expect(sliders.length).toBe(4); // 4 sliders
    expect(sliders[0]).toHaveAttribute('aria-label', 'brightness');
    expect(sliders[1]).toHaveAttribute('aria-label', 'contrast');
    expect(sliders[2]).toHaveAttribute('aria-label', 'saturation');
    expect(sliders[3]).toHaveAttribute('aria-label', 'sharpness');
  });

  it('dispatches correct action when slider changes', () => {
    render(
      <Provider store={store}>
        <Tunes />
      </Provider>
    );

    const brightnessSlider = screen.getByLabelText('brightness');
    fireEvent.change(brightnessSlider, { target: { value: 70 } });

    expect(store.dispatch).toHaveBeenCalledWith(
      setTunes({
        brightness: 70,
        contrast: 50,
        saturation: 50,
        sharpness: 100,
      })
    );
  });

  it('updates the value of the slider when changed', () => {
    render(
      <Provider store={store}>
        <Tunes />
      </Provider>
    );

    const sharpnessSlider = screen.getByLabelText('sharpness');
    expect(sharpnessSlider).toHaveValue('100'); // Change to a string value

    fireEvent.change(sharpnessSlider, { target: { value: 80 } });

    expect(store.dispatch).toHaveBeenCalledWith(
      setTunes({
        brightness: 50,
        contrast: 50,
        saturation: 50,
        sharpness: 80,
      })
    );
  });
});
