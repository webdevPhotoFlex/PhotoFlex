import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ToolBar from '../src/components/tool-bar/tool-bar';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);
const renderWithProvider = (component, initialState) => {
  const store = mockStore(initialState);
  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
  };
};

jest.mock('../src/components/tool-bar/tool-bar.module.css', () => ({
  clicked: 'clicked',
  notClicked: 'notClicked',
}));

describe('ToolBar component', () => {
  it('should render all icons', () => {
    const initialState = {
      image: {
        activeTool: 0,
      },
    };

    renderWithProvider(<ToolBar />, initialState);

    for (let i = 0; i < 9; i++) {
      expect(screen.getByTestId(`icon-${i}`)).toBeInTheDocument();
    }
  });

  it('should not update active tool when isToolsDisabled is true', () => {
    const initialState = {
      image: {
        activeTool: 0,
      },
    };

    const { store } = renderWithProvider(
      <ToolBar isToolsDisabled={true} />,
      initialState
    );

    const iconToClick = screen.getByTestId('icon-1');
    fireEvent.click(iconToClick);
    const actions = store.getActions();
    expect(actions).toEqual([]);
  });

  it('should apply active class to the selected tool', () => {
    const initialState = {
      image: {
        activeTool: 2,
      },
    };

    renderWithProvider(<ToolBar />, initialState);

    for (let i = 0; i < 9; i++) {
      const icon = screen.getByTestId(`icon-${i}`);
      if (i === 2) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(icon).toHaveClass('clicked');
      } else {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(icon).toHaveClass('notClicked');
      }
    }
  });
});
