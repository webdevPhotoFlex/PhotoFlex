import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import Rotate from '../src/components/tools/rotate-tool/rotate-tools';
import ImageRotate from '../src/components/editor-actions/image-rotate';

describe('Editor-actions tools', () => {
  it('ImageRotate Component correctly sets canvas dimensions based on rotation', async () => {
    global.Image = class {
      constructor() {
        setTimeout(() => {
          if (this.onload) this.onload();
        }, 0);
      }
    };

    const { container } = render(
      <ImageRotate imageSrc="placeholder.jpeg" rotation={90} />
    );
    const canvas = container.querySelector('canvas');

    await waitFor(() => {
      expect(canvas.width).toBeGreaterThan(0);
      expect(canvas.height).toBeGreaterThan(0);
    });
  });
});

describe('Rotate Component', () => {
  let mockOnRotate;
  beforeEach(() => {
    mockOnRotate = jest.fn();
    render(<Rotate onRotate={mockOnRotate} />);
  });
  it('renders rotate left icon', () => {
    const leftIcon = screen.getByTestId('rotate-left-icon');
    expect(leftIcon).toBeInTheDocument();
    fireEvent.click(leftIcon);
    expect(mockOnRotate).toHaveBeenCalledWith(-90);
  });

  it('renders rotate right icon', () => {
    const rightIcon = screen.getByTestId('rotate-right-icon');
    expect(rightIcon).toBeInTheDocument();
    fireEvent.click(rightIcon);
    expect(mockOnRotate).toHaveBeenCalledWith(90);
  });
});
