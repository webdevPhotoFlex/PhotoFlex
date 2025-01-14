export const initialState = {
  login: '',
  password: '',
  loginRegister: '',
  passwordRegister: '',
  username: '',
  token: localStorage.getItem('authToken') || null,
  isAuthenticated: !!localStorage.getItem('authToken'),
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_LOGIN':
      return {
        ...state,
        login: action.payload,
      };
    case 'SET_PASSWORD':
      return {
        ...state,
        password: action.payload,
      };
    case 'SET_LOGIN_REGISTER':
      return {
        ...state,
        loginRegister: action.payload,
      };
    case 'EXIT_USER':
      return {
        ...initialState,
        token: null,
        isAuthenticated: false,
      };
    case 'SET_PASSWORD_REGISTER':
      return {
        ...state,
        passwordRegister: action.payload,
      };
    case 'SET_USERNAME':
      return {
        ...state,
        username: action.payload,
      };

    case 'LOGIN_SUCCESS':
      localStorage.setItem('authToken', action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: true,
      };
    case 'LOGIN_TELEGRAM_SUCCESS':
      localStorage.setItem('authToken', action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: true,
      };
    case 'LOGIN_GOOGLE_SUCCESS':
      localStorage.setItem('authToken', action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: true,
      };
    case 'LOGIN_YANDEX_SUCCESS':
      localStorage.setItem('authToken', action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: true,
      };
    case 'REGISTER_SUCCESS':
      localStorage.setItem('authToken', action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: true,
      };

    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      localStorage.removeItem('authToken');
      return {
        ...state,
        token: null,
        error: action.payload,
        isAuthenticated: false,
      };

    default:
      return state;
  }
};

export default authReducer;
