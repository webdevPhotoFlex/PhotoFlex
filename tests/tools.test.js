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

  it('renders Rotate component when activeTool is 2', () => {
    renderWithProvider(<Tools onRotate={jest.fn()} />, {
      image: { activeTool: 2 },
    });
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

  it('renders Text component when activeTool is 8', () => {
    renderWithProvider(<Tools />, { image: { activeTool: 8 } });
    expect(screen.getByTestId('text-component')).toBeInTheDocument();
  });
});
