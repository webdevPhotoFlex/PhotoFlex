import authReducer, {
  initialState,
} from '../src/services/reducers/auth-reducer';

describe('authReducer', () => {
  it('should return the initial state when no action is passed', () => {
    const result = authReducer(undefined, {});
    expect(result).toEqual(initialState);
  });

  it('should handle SET_LOGIN', () => {
    const action = { type: 'SET_LOGIN', payload: 'test@example.com' };
    const result = authReducer(initialState, action);
    expect(result.login).toBe('test@example.com');
  });

  it('should handle SET_PASSWORD', () => {
    const action = { type: 'SET_PASSWORD', payload: 'password123' };
    const result = authReducer(initialState, action);
    expect(result.password).toBe('password123');
  });

  it('should handle SET_LOGIN_REGISTER', () => {
    const action = {
      type: 'SET_LOGIN_REGISTER',
      payload: 'register@example.com',
    };
    const result = authReducer(initialState, action);
    expect(result.loginRegister).toBe('register@example.com');
  });

  it('should handle SET_PASSWORD_REGISTER', () => {
    const action = {
      type: 'SET_PASSWORD_REGISTER',
      payload: 'registerPass123',
    };
    const result = authReducer(initialState, action);
    expect(result.passwordRegister).toBe('registerPass123');
  });

  it('should handle SET_USERNAME', () => {
    const action = { type: 'SET_USERNAME', payload: 'username123' };
    const result = authReducer(initialState, action);
    expect(result.username).toBe('username123');
  });

  it('should handle LOGIN_SUCCESS', () => {
    const action = {
      type: 'LOGIN_SUCCESS',
      payload: { token: 'token123' },
    };
    const result = authReducer(initialState, action);
    expect(result.token).toBe('token123');
    expect(result.isAuthenticated).toBe(true);
    expect(localStorage.getItem('authToken')).toBe('token123');
  });

  it('should handle REGISTER_SUCCESS', () => {
    const action = {
      type: 'REGISTER_SUCCESS',
      payload: { token: 'token456' },
    };
    const result = authReducer(initialState, action);
    expect(result.token).toBe('token456');
    expect(result.isAuthenticated).toBe(true);
    expect(localStorage.getItem('authToken')).toBe('token456');
  });

  it('should handle LOGIN_FAILURE', () => {
    const action = { type: 'LOGIN_FAILURE' };
    const result = authReducer(initialState, action);
    expect(result.token).toBe(null);
    expect(result.isAuthenticated).toBe(false);
    expect(localStorage.getItem('authToken')).toBe(null);
  });

  it('should handle REGISTER_FAILURE', () => {
    const action = { type: 'REGISTER_FAILURE' };
    const result = authReducer(initialState, action);
    expect(result.token).toBe(null);
    expect(result.isAuthenticated).toBe(false);
    expect(localStorage.getItem('authToken')).toBe(null);
  });
  it('should handle LOGIN_TELEGRAM_SUCCESS', () => {
    const action = {
      type: 'LOGIN_TELEGRAM_SUCCESS',
      payload: { token: 'telegramToken123' },
    };
    const result = authReducer(initialState, action);
    expect(result.token).toBe('telegramToken123');
    expect(result.isAuthenticated).toBe(true);
    expect(localStorage.getItem('authToken')).toBe(
      'telegramToken123'
    );
  });

  it('should handle LOGIN_GOOGLE_SUCCESS', () => {
    const action = {
      type: 'LOGIN_GOOGLE_SUCCESS',
      payload: { token: 'googleToken123' },
    };
    const result = authReducer(initialState, action);
    expect(result.token).toBe('googleToken123');
    expect(result.isAuthenticated).toBe(true);
    expect(localStorage.getItem('authToken')).toBe('googleToken123');
  });
});
