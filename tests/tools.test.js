import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Tools from '../src/components/tools/tools';
import React from 'react';

describe('Tools Component', () => {
  it('renders Tunes component when activeTool is 0', () => {
    render(<Tools activeTool={0} />);
    expect(screen.getByText('Brightness')).toBeInTheDocument();
  });

  it('renders Crop component when activeTool is 1', () => {
    render(<Tools activeTool={1} />);
    expect(screen.getByLabelText(/width/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/height/i)).toBeInTheDocument();
  });

  it('renders Rotate component when activeTool is 2', () => {
    render(<Tools activeTool={2} onRotate={jest.fn()} />);
    expect(
      screen.getByTestId('rotate-left-icon')
    ).toBeInTheDocument();
  });

  it('renders Filters component when activeTool is 4', () => {
    render(<Tools activeTool={4} />);
    expect(screen.getByText('nebula')).toBeInTheDocument();
  });

  it('renders Text component when activeTool is 7', () => {
    render(<Tools activeTool={7} />);
    expect(screen.getByText(/добавить текст/i)).toBeInTheDocument();
  });
});
