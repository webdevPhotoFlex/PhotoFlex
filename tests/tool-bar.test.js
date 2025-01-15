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
  icon: 'icon',
  darkTheme: 'darkTheme',
  lightTheme: 'lightTheme',
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

  it('should change icon color based on theme', () => {
    const initialStateDark = {
      image: {
        activeTool: 0,
        darkMode: true,
      },
    };

    const initialStateLight = {
      image: {
        activeTool: 0,
        darkMode: false,
      },
    };

    const { rerender } = renderWithProvider(
      <ToolBar />,
      initialStateDark
    );
    const darkIcon = screen.getByTestId('icon-0');
    expect(darkIcon).toHaveStyle('color: var(--icon-color)');
    rerender(
      <Provider store={mockStore(initialStateLight)}>
        <ToolBar />
      </Provider>
    );
    const lightIcon = screen.getByTestId('icon-0');
    expect(lightIcon).toHaveStyle('color: var(--icon-color)');
  });

  it('should smoothly change icon color when theme switches', () => {
    const initialState = {
      image: {
        activeTool: 0,
        darkMode: false,
      },
    };
    const { rerender } = renderWithProvider(
      <ToolBar />,
      initialState
    );
    const icon = screen.getByTestId('icon-0');
    expect(icon).toHaveStyle('color: var(--icon-color)');
    rerender(
      <Provider
        store={mockStore({
          image: { activeTool: 0, darkMode: true },
        })}
      >
        <ToolBar />
      </Provider>
    );
    expect(icon).toHaveStyle('color: var(--icon-color)');
  });
});
