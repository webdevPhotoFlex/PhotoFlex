import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Tunes from '../src/components/tools/tune-tool/tunes-tools';
import React from 'react';

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
