import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import { registerUser } from '../src/services/actions/auth-actions';
import {
  validateLogin,
  validatePassword,
  validateUsername,
} from '../src/utils/auth-utils';
import RegisterModal from '../src/components/modal/register-modal/register-modal';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../src/utils/auth-utils');
jest.mock('../src/services/actions/auth-actions', () => ({
  registerUser: jest.fn(),
  setLoginRegister: jest.fn((value) => ({
    type: 'SET_LOGIN_REGISTER',
    payload: value,
  })),
  setPasswordRegister: jest.fn((value) => ({
    type: 'SET_PASSWORD_REGISTER',
    payload: value,
  })),
  setUsername: jest.fn((value) => ({
    type: 'SET_USERNAME',
    payload: value,
  })),
}));

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('RegisterModal', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: {
        loginRegister: '',
        passwordRegister: '',
        username: '',
      },
    });

    validateLogin.mockReturnValue(true);
    validatePassword.mockReturnValue(true);
    validateUsername.mockReturnValue(true);
    registerUser.mockResolvedValue({});
    jest.clearAllMocks();
  });

  it('renders the RegisterModal component', () => {
    render(
      <Provider store={store}>
        <RegisterModal
          onSignInClick={() => {}}
          onSubmited={() => {}}
        />
      </Provider>
    );

    expect(screen.getByText('sign up')).toBeInTheDocument();
    expect(
      screen.getByLabelText('Enter your phone number/email/login')
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('Come up with a password')
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('Come up with username')
    ).toBeInTheDocument();
    expect(screen.getByText('submit')).toBeInTheDocument();
    expect(
      screen.getByText('already have an account?')
    ).toBeInTheDocument();
    expect(screen.getByText('sign in')).toBeInTheDocument();
  });

  it('handles password visibility toggle', () => {
    render(
      <Provider store={store}>
        <RegisterModal
          onSignInClick={() => {}}
          onSubmited={() => {}}
        />
      </Provider>
    );

    const passwordInput = screen.getByLabelText(
      'Come up with a password'
    );
    const toggleButton = screen.getByLabelText(
      'toggle password visibility'
    );

    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
  it('calls onSignInClick when sign up link is clicked', () => {
    const onSignInClick = jest.fn();

    render(
      <Provider store={store}>
        <MemoryRouter>
          <RegisterModal
            onSignInClick={onSignInClick}
            onSubmited={() => {}}
          />
        </MemoryRouter>
      </Provider>
    );

    const signInLink = screen.getByTestId('signin-link');
    fireEvent.click(signInLink);

    expect(onSignInClick).toHaveBeenCalled();
  });
  it('shows a link to sigin page when a login is wrong', () => {
    validateLogin.mockReturnValue(false);

    render(
      <Provider store={store}>
        <MemoryRouter>
          <RegisterModal
            onSignInClick={() => {}}
            onSubmited={() => {}}
          />
        </MemoryRouter>
      </Provider>
    );

    const loginInput = screen.getByLabelText(
      'Enter your phone number/email/login'
    );
    const passwordInput = screen.getByLabelText(
      'Come up with a password'
    );
    const usernameInput = screen.getByLabelText(
      'Come up with username'
    );
    const submitButton = screen.getByText('submit');

    fireEvent.change(loginInput, { target: { value: 'invalid' } });
    fireEvent.change(passwordInput, {
      target: { value: 'password123' },
    });
    fireEvent.change(usernameInput, {
      target: { value: 'testuser' },
    });

    fireEvent.click(submitButton);
    const signInLink = screen.getByTestId('signin-link');
    expect(signInLink).toBeInTheDocument();
  });
});
