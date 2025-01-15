import React from 'react';
import {
  render,
  fireEvent,
  screen,
  waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Header from '../src/components/header/header';
import { saveAs } from 'file-saver';

const mockStore = configureStore([]);
jest.mock('file-saver', () => ({
  saveAs: jest.fn(),
}));

jest.mock('../src/components/modal/auth-modal', () => {
  const React = require('react');
  // eslint-disable-next-line react/display-name
  return ({ isModalOpen, onClose }) => {
    if (!isModalOpen) {
      return null;
    }
    return (
      <div data-testid="auth-modal">
        <button data-testid="close-modal" onClick={onClose}>
          Close
        </button>
      </div>
    );
  };
});

describe('Header Component', () => {
  let store;
  let canvasRef;

  beforeEach(() => {
    store = mockStore({
      auth: { isAuthenticated: false },
    });
    canvasRef = {
      current: {
        toDataURL: jest
          .fn()
          .mockReturnValue('data:image/png;base64,mockImageData'),
        width: 800,
        height: 600,
      },
    };
  });

  it('renders Header component', () => {
    render(
      <Provider store={store}>
        <Router>
          <Header canvasRef={canvasRef} />
        </Router>
      </Provider>
    );
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('handles format selection change', () => {
    render(
      <Provider store={store}>
        <Router>
          <Header canvasRef={canvasRef} />
        </Router>
      </Provider>
    );
    const selectElement = screen.getByRole('combobox');
    fireEvent.change(selectElement, { target: { value: 'jpeg' } });
    expect(selectElement.value).toBe('jpeg');
  });

  it('handles save icon click', () => {
    render(
      <Provider store={store}>
        <Router>
          <Header canvasRef={canvasRef} />
        </Router>
      </Provider>
    );
    const saveIcon = screen.getByTestId('save-icon');
    fireEvent.click(saveIcon);
    expect(canvasRef.current.toDataURL).toHaveBeenCalledWith(
      'image/png'
    );
  });

  it('handles flip icon mouse events', () => {
    render(
      <Provider store={store}>
        <Router>
          <Header canvasRef={canvasRef} />
        </Router>
      </Provider>
    );
    const flipIcon = screen.getByTestId('flip-icon');
    fireEvent.mouseDown(flipIcon);
    expect(store.getActions()).toContainEqual({
      type: 'SET_SHOW_ORIGINAL',
      payload: true,
    });
    fireEvent.mouseUp(flipIcon);
    expect(store.getActions()).toContainEqual({
      type: 'SET_SHOW_ORIGINAL',
      payload: false,
    });
    fireEvent.mouseLeave(flipIcon);
    expect(store.getActions()).toContainEqual({
      type: 'SET_SHOW_ORIGINAL',
      payload: false,
    });
  });

  it('handles save icon click when canvas is null', () => {
    canvasRef = { current: null };
    render(
      <Provider store={store}>
        <Router>
          <Header canvasRef={canvasRef} />
        </Router>
      </Provider>
    );
    const saveIcon = screen.getByTestId('save-icon');
    fireEvent.click(saveIcon);
    expect(store.getActions()).toEqual([]);
  });

  it('navigates to home page when logo is clicked', () => {
    render(
      <Provider store={store}>
        <Router>
          <Header canvasRef={canvasRef} />
        </Router>
      </Provider>
    );
    const logo = screen.getByAltText('logo');
    fireEvent.click(logo);
    expect(window.location.pathname).toBe('/');
  });

  it('renders the correct initial format in the dropdown', () => {
    render(
      <Provider store={store}>
        <Router>
          <Header canvasRef={canvasRef} />
        </Router>
      </Provider>
    );
    const selectElement = screen.getByRole('combobox');
    expect(selectElement.value).toBe('png');
  });

  it('dispatches setShowOriginal actions correctly when FlipIcon is interacted with', () => {
    render(
      <Provider store={store}>
        <Router>
          <Header canvasRef={canvasRef} />
        </Router>
      </Provider>
    );

    const flipIcon = screen.getByTestId('flip-icon');
    fireEvent.mouseDown(flipIcon);
    expect(store.getActions()).toContainEqual({
      type: 'SET_SHOW_ORIGINAL',
      payload: true,
    });

    fireEvent.mouseUp(flipIcon);
    expect(store.getActions()).toContainEqual({
      type: 'SET_SHOW_ORIGINAL',
      payload: false,
    });

    fireEvent.mouseLeave(flipIcon);
    expect(store.getActions()).toContainEqual({
      type: 'SET_SHOW_ORIGINAL',
      payload: false,
    });
  });

  it('handles redo icon', () => {
    render(
      <Provider store={store}>
        <Router>
          <Header canvasRef={canvasRef} />
        </Router>
      </Provider>
    );
    const redoIcon = screen.getByTestId('redo-icon');
    fireEvent.click(redoIcon);
    expect(store.getActions()).toContainEqual({ type: 'REDO' });
  });

  it('handles undo icon', () => {
    render(
      <Provider store={store}>
        <Router>
          <Header canvasRef={canvasRef} />
        </Router>
      </Provider>
    );
    const undoIcon = screen.getByTestId('undo-icon');
    fireEvent.click(undoIcon);
    expect(store.getActions()).toContainEqual({ type: 'UNDO' });
  });
  it('changes the selected format in the dropdown', () => {
    render(
      <Provider store={store}>
        <Router>
          <Header canvasRef={canvasRef} />
        </Router>
      </Provider>
    );

    const selectElement = screen.getByRole('combobox');
    fireEvent.change(selectElement, { target: { value: 'jpeg' } });

    expect(selectElement.value).toBe('jpeg');
  });
  it('dispatches resetState action when reset icon is clicked', () => {
    render(
      <Provider store={store}>
        <Router>
          <Header canvasRef={canvasRef} />
        </Router>
      </Provider>
    );
    const resetIcon = screen.getByTestId('reset-icon');
    fireEvent.click(resetIcon);
    expect(store.getActions()).toContainEqual({
      type: 'RESET_STATE',
    });
  });

  it('navigates to personal account page when profile icon is clicked and user is authenticated', () => {
    store = mockStore({
      auth: { isAuthenticated: true },
    });
    render(
      <Provider store={store}>
        <Router>
          <Header canvasRef={canvasRef} />
        </Router>
      </Provider>
    );
    const profileIcon = screen.getByTestId('account-icon');
    fireEvent.click(profileIcon);
    expect(window.location.pathname).toBe('/personal-account');
  });

  it('dispatches undo action when undo icon is clicked', () => {
    render(
      <Provider store={store}>
        <Router>
          <Header canvasRef={canvasRef} />
        </Router>
      </Provider>
    );
    const undoIcon = screen.getByTestId('undo-icon');
    fireEvent.click(undoIcon);
    expect(store.getActions()).toContainEqual({ type: 'UNDO' });
  });

  it('dispatches redo action when redo icon is clicked', () => {
    render(
      <Provider store={store}>
        <Router>
          <Header canvasRef={canvasRef} />
        </Router>
      </Provider>
    );
    const redoIcon = screen.getByTestId('redo-icon');
    fireEvent.click(redoIcon);
    expect(store.getActions()).toContainEqual({ type: 'REDO' });
  });

  it('dispatches setShowOriginal action when flip icon is interacted with', () => {
    render(
      <Provider store={store}>
        <Router>
          <Header canvasRef={canvasRef} />
        </Router>
      </Provider>
    );
    const flipIcon = screen.getByTestId('flip-icon');
    fireEvent.mouseDown(flipIcon);
    expect(store.getActions()).toContainEqual({
      type: 'SET_SHOW_ORIGINAL',
      payload: true,
    });
    fireEvent.mouseUp(flipIcon);
    expect(store.getActions()).toContainEqual({
      type: 'SET_SHOW_ORIGINAL',
      payload: false,
    });
    fireEvent.mouseLeave(flipIcon);
    expect(store.getActions()).toContainEqual({
      type: 'SET_SHOW_ORIGINAL',
      payload: false,
    });
  });

  it('saves file as JPEG when selected', () => {
    render(
      <Provider store={store}>
        <Router>
          <Header canvasRef={canvasRef} />
        </Router>
      </Provider>
    );
    const selectElement = screen.getByRole('combobox');
    fireEvent.change(selectElement, { target: { value: 'jpeg' } });

    const saveIcon = screen.getByTestId('save-icon');
    fireEvent.click(saveIcon);

    expect(canvasRef.current.toDataURL).toHaveBeenCalledWith(
      'image/jpeg'
    );
  });

  it('calls undo multiple times', () => {
    render(
      <Provider store={store}>
        <Router>
          <Header canvasRef={canvasRef} />
        </Router>
      </Provider>
    );

    const undoIcon = screen.getByTestId('undo-icon');
    fireEvent.click(undoIcon);
    fireEvent.click(undoIcon);
    fireEvent.click(undoIcon);

    const actions = store
      .getActions()
      .filter((a) => a.type === 'UNDO');
    expect(actions.length).toBe(3);
  });

  it('calls redo multiple times', () => {
    render(
      <Provider store={store}>
        <Router>
          <Header canvasRef={canvasRef} />
        </Router>
      </Provider>
    );

    const redoIcon = screen.getByTestId('redo-icon');
    fireEvent.click(redoIcon);
    fireEvent.click(redoIcon);

    const actions = store
      .getActions()
      .filter((a) => a.type === 'REDO');
    expect(actions.length).toBe(2);
  });
  it('does not dispatch SET_SHOW_ORIGINAL again if mouse stays pressed down and leaves the FlipIcon', () => {
    render(
      <Provider store={store}>
        <Router>
          <Header canvasRef={canvasRef} />
        </Router>
      </Provider>
    );

    const flipIcon = screen.getByTestId('flip-icon');
    fireEvent.mouseDown(flipIcon);
    fireEvent.mouseUp(flipIcon);
    fireEvent.mouseLeave(flipIcon);

    const actions = store
      .getActions()
      .filter((a) => a.type === 'SET_SHOW_ORIGINAL');
    expect(actions.length).toBe(3);
    expect(actions[0].payload).toBe(true);
    expect(actions[1].payload).toBe(false);
    expect(actions[2].payload).toBe(false);
  });
  it('saves file as JPG correctly', () => {
    render(
      <Provider store={store}>
        <Router>
          <Header canvasRef={canvasRef} />
        </Router>
      </Provider>
    );
    const selectElement = screen.getByRole('combobox');
    fireEvent.change(selectElement, { target: { value: 'jpg' } });

    const saveIcon = screen.getByTestId('save-icon');
    fireEvent.click(saveIcon);

    expect(canvasRef.current.toDataURL).toHaveBeenCalledWith(
      'image/jpg'
    );
  });

  it('saves file as WEBP correctly', () => {
    render(
      <Provider store={store}>
        <Router>
          <Header canvasRef={canvasRef} />
        </Router>
      </Provider>
    );
    const selectElement = screen.getByRole('combobox');
    fireEvent.change(selectElement, { target: { value: 'webp' } });

    const saveIcon = screen.getByTestId('save-icon');
    fireEvent.click(saveIcon);

    expect(canvasRef.current.toDataURL).toHaveBeenCalledWith(
      'image/webp'
    );
  });
  it('saves file as SVG correctly', async () => {
    render(
      <Provider store={store}>
        <Router>
          <Header canvasRef={canvasRef} />
        </Router>
      </Provider>
    );
    const selectElement = screen.getByRole('combobox');
    fireEvent.change(selectElement, { target: { value: 'svg' } });

    const saveIcon = screen.getByTestId('save-icon');
    fireEvent.click(saveIcon);

    await waitFor(() => {
      expect(saveAs).toHaveBeenCalledTimes(1);
      const [[blob, filename]] = saveAs.mock.calls;
      expect(filename).toBe('photoflex.svg');
      expect(blob.type).toBe('image/svg+xml;charset=utf-8');
    });
  });
  it('opens AuthModal if user is not authenticated and profile icon is clicked', () => {
    render(
      <Provider store={store}>
        <Router>
          <Header canvasRef={canvasRef} />
        </Router>
      </Provider>
    );
    const profileIcon = screen.getByTestId('PersonAddIcon');
    fireEvent.click(profileIcon);

    // Так как AuthModal замокан, он рендерит простой div.
    const authModal = screen.getByTestId('auth-modal');
    expect(authModal).toBeInTheDocument();
  });
  describe('Header Component - Theme Toggle', () => {
    let store;
    let canvasRef;

    beforeEach(() => {
      store = mockStore({
        auth: { isAuthenticated: false },
        image: { darkMode: false },
      });
      canvasRef = {
        current: {
          toDataURL: jest
            .fn()
            .mockReturnValue('data:image/png;base64,mockImageData'),
          width: 800,
          height: 600,
        },
      };
    });
    it('dispatches toggleTheme when the theme toggle is clicked', () => {
      render(
        <Provider store={store}>
          <Router>
            <Header canvasRef={canvasRef} />
          </Router>
        </Provider>
      );
      const themeToggle = screen.getByTestId('theme-toggle');
      fireEvent.click(themeToggle);
      expect(store.getActions()).toContainEqual({
        type: 'TOGGLE_THEME',
      });
    });

    // it('toggles theme from light to dark on click', () => {
    //   store = mockStore({
    //     auth: { isAuthenticated: false },
    //     image: { darkMode: false },
    //   });
    //
    //   render(
    //     <Provider store={store}>
    //       <Router>
    //         <Header canvasRef={canvasRef} />
    //       </Router>
    //     </Provider>
    //   );
    //   let header = screen.getByTestId('header');
    //   expect(header).toHaveClass('lightTheme');
    //   const themeToggle = screen.getByTestId('theme-toggle');
    //   fireEvent.click(themeToggle);
    //
    //   header = screen.getByTestId('header');
    //   expect(header).toHaveClass('darkTheme');
    // });

    // it('toggles theme from dark to light on click', () => {
    //   store = mockStore({
    //     auth: { isAuthenticated: false },
    //     image: { darkMode: true },
    //   });
    //
    //   render(
    //     <Provider store={store}>
    //       <Router>
    //         <Header canvasRef={canvasRef} />
    //       </Router>
    //     </Provider>
    //   );
    //
    //   let header = screen.getByTestId('header');
    //   expect(header).toHaveClass('darkTheme');
    //
    //   const themeToggle = screen.getByTestId('theme-toggle');
    //   fireEvent.click(themeToggle);
    //
    //   header = screen.getByTestId('header');
    //   expect(header).toHaveClass('lightTheme');
    // });

    it('displays light mode icon when darkMode is true', () => {
      store = mockStore({
        auth: { isAuthenticated: false },
        image: { darkMode: true },
      });

      render(
        <Provider store={store}>
          <Router>
            <Header canvasRef={canvasRef} />
          </Router>
        </Provider>
      );

      const lightModeIcon = screen.getByTestId('light-mode-icon');
      expect(lightModeIcon).toBeInTheDocument();
    });

    it('displays dark mode icon when darkMode is false', () => {
      store = mockStore({
        auth: { isAuthenticated: false },
        image: { darkMode: false },
      });

      render(
        <Provider store={store}>
          <Router>
            <Header canvasRef={canvasRef} />
          </Router>
        </Provider>
      );

      const darkModeIcon = screen.getByTestId('dark-mode-icon');
      expect(darkModeIcon).toBeInTheDocument();
    });
  });
});
