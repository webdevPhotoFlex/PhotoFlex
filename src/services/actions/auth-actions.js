import axios from 'axios';

export const setLogin = (login) => ({
  type: 'SET_LOGIN',
  payload: login,
});
export const setPassword = (password) => ({
  type: 'SET_PASSWORD',
  payload: password,
});
export const setLoginRegister = (login) => ({
  type: 'SET_LOGIN_REGISTER',
  payload: login,
});
export const setPasswordRegister = (password) => ({
  type: 'SET_PASSWORD_REGISTER',
  payload: password,
});
export const setUsername = (username) => ({
  type: 'SET_USERNAME',
  payload: username,
});
export const exitUser = () => {
  localStorage.removeItem('authToken');
  return {
    type: 'EXIT_USER',
  };
};

export const registerUser = (login, username, password) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(
        'https://photoflex.site:49383/register',
        {
          login,
          username,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const token = response.data.token;
      localStorage.setItem('authToken', token);

      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: response.data,
      });
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      dispatch({
        type: 'REGISTER_FAILURE',
        payload: error.response?.data || 'Ошибка соединения',
      });
    }
  };
};
export const loginUser = (login, password) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(
        'https://photoflex.site:49383/login',
        {
          login,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const token = response.data.token;
      localStorage.setItem('authToken', token);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: response.data,
      });
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: error.response?.data || 'Ошибка соединения',
      });
    }
  };
};
export const loginTelegram = (token) => {
  localStorage.setItem('authToken', token);
  return {
    type: 'LOGIN_TELEGRAM_SUCCESS',
    payload: token,
  };
};
export const loginGoogle = (token) => {
  localStorage.setItem('authToken', token);
  return {
    type: 'LOGIN_GOOGLE_SUCCESS',
    payload: token,
  };
};
export const loginYandex = (token) => {
  localStorage.setItem('authToken', token);
  return {
    type: 'LOGIN_YANDEX_SUCCESS',
    payload: token,
  };
};
