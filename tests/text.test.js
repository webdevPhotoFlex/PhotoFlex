import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Text from '../src/components/tools/text-tool/text-tools';
import React from 'react';

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
