import React from 'react';
import { render, act, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import TelegramWidget from '../src/components/telegram-widget/telegram-widget.js';
import '@testing-library/jest-dom';

const mockStore = configureStore([]);

jest.mock('../src/services/actions/auth-actions', () => {
  return {
    loginTelegram: jest.fn(),
  };
});

const {
  loginTelegram,
} = require('../src/services/actions/auth-actions');

describe('TelegramWidget', () => {
  let store;
  let dispatchMock;

  beforeEach(() => {
    store = mockStore({});
    dispatchMock = jest.fn();
    store.dispatch = dispatchMock;

    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    loginTelegram.mockClear();
  });

  afterEach(() => {
    cleanup();
    jest.restoreAllMocks();
  });

  it('renders the component and appends the script', () => {
    render(
      <Provider store={store}>
        <TelegramWidget onSubmited={jest.fn()} />
      </Provider>
    );

    const container = document.getElementById(
      'telegram-widget-container'
    );
    expect(container).toBeInTheDocument();
    const script = container.querySelector('script');
    expect(script).toBeInTheDocument();
    expect(script.src).toContain('telegram-widget.js');
  });

  it('logs a success message when the script loads', () => {
    render(
      <Provider store={store}>
        <TelegramWidget onSubmited={jest.fn()} />
      </Provider>
    );

    const container = document.getElementById(
      'telegram-widget-container'
    );
    const script = container.querySelector('script');

    act(() => {
      script.onload();
    });

    expect(console.log).toHaveBeenCalledWith(
      'Telegram widget loaded successfully.'
    );
  });

  it('logs an error when the script fails to load', () => {
    render(
      <Provider store={store}>
        <TelegramWidget onSubmited={jest.fn()} />
      </Provider>
    );

    const container = document.getElementById(
      'telegram-widget-container'
    );
    const script = container.querySelector('script');

    const error = new Error('Failed to load');
    act(() => {
      script.onerror(error);
    });

    expect(console.error).toHaveBeenCalledWith(
      'Failed to load Telegram widget:',
      error
    );
  });

  it('handles successful authentication', () => {
    const onSubmitedMock = jest.fn();
    render(
      <Provider store={store}>
        <TelegramWidget onSubmited={onSubmitedMock} />
      </Provider>
    );

    const validUser = {
      auth_date: 123456,
      hash: 'test_hash',
    };

    act(() => {
      window.onTelegramAuth(validUser);
    });

    expect(dispatchMock).toHaveBeenCalledWith(
      loginTelegram(validUser.hash)
    );
    expect(onSubmitedMock).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(
      'Auth token received:',
      'test_hash'
    );
  });

  it('handles failed authentication due to invalid user data', () => {
    const onSubmitedMock = jest.fn();
    render(
      <Provider store={store}>
        <TelegramWidget onSubmited={onSubmitedMock} />
      </Provider>
    );

    const invalidUser = {};

    act(() => {
      window.onTelegramAuth(invalidUser);
    });

    expect(dispatchMock).not.toHaveBeenCalled();
    expect(onSubmitedMock).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      'Telegram authentication failed. Invalid user data:',
      invalidUser
    );
  });

  it('cleans up the container on unmount', () => {
    const { unmount } = render(
      <Provider store={store}>
        <TelegramWidget onSubmited={jest.fn()} />
      </Provider>
    );

    const container = document.getElementById(
      'telegram-widget-container'
    );
    expect(container.innerHTML).not.toBe('');

    unmount();

    expect(container.innerHTML).toBe('');
  });
});
