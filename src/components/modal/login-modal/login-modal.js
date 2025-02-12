import { styles } from './login-modal-styles';
import React, { useState } from 'react';
import {
  DialogTitle,
  Stack,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Button,
  Alert,
} from '@mui/material';
import FormControl from '@mui/joy/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { GoogleLogin } from '@react-oauth/google';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginGoogle,
  loginUser,
  setLogin,
  setPassword,
} from '../../../services/actions/auth-actions';
import {
  handleMouseDownPassword,
  handleMouseUpPassword,
  validateLogin,
  validatePassword,
} from '../../../utils/auth-utils';
import TelegramWidget from '../../telegram-widget/telegram-widget';
import yandexImage from '../../../images/yandex.svg';
const LoginModal = ({ onSignUpClick, onSubmited }) => {
  const dispatch = useDispatch();
  const { login, password } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const handleClickShowPassword = () =>
    setShowPassword((show) => !show);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowAlert(false);
    setAlert('');

    if (!validateLogin(login)) {
      setAlert('Please enter a valid email or phone number');
      setShowAlert(true);
      return;
    }
    if (!validatePassword(password)) {
      setAlert('Password must be at least 8 characters long');
      setShowAlert(true);
      return;
    }

    try {
      await dispatch(loginUser(login, password));

      onSubmited();
      setAlert('Login successful!');
      setShowAlert(true);
      onSubmited();
      dispatch(setLogin(''));
      dispatch(setPassword(''));
    } catch (error) {
      setAlert(error.message);
      setShowAlert(true);
    }
  };

  const handleGoogleSuccess = (response) => {
    const token = response.credential;
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    dispatch(loginGoogle(decodedToken));
    onSubmited();
  };

  const handleGoogleError = () => {
    setAlert('Failed to log in with Google');
    setShowAlert(true);
  };

  const handleYandexLogin = () => {
    const clientId = process.env.REACT_APP_YANDEX_CLIENT_ID;
    const redirectUri = 'https://webdevphotoflex.github.io/PhotoFlex';

    const yandexOAuthUrl = `https://oauth.yandex.ru/authorize?response_type=token&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}`;

    window.location.href = yandexOAuthUrl;
  };

  return (
    <div style={styles.mainContainer} data-testid="login-modal">
      <DialogTitle data-testid="sign-in-title" sx={styles.modalTitle}>
        sign in
      </DialogTitle>
      <form>
        <Stack spacing={2} sx={styles.stack}>
          <FormControl variant="outlined">
            <InputLabel htmlFor="login-input" sx={styles.inputLabel}>
              Enter your phone number/email/login
            </InputLabel>
            <OutlinedInput
              required
              id="login-input"
              value={login}
              onChange={(e) => dispatch(setLogin(e.target.value))}
              label="Login"
              sx={styles.loginInputStyle}
            />
          </FormControl>
          <FormControl variant="outlined">
            <InputLabel
              htmlFor="password-input"
              sx={styles.inputLabel}
            >
              Enter your password
            </InputLabel>
            <OutlinedInput
              required
              id="password-input"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => dispatch(setPassword(e.target.value))}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                    sx={styles.visability}
                  >
                    {showPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
              sx={styles.passwordInputStyle}
            />
          </FormControl>
          {showAlert && (
            <Alert
              severity="warning"
              onClose={() => {
                console.log('Alert closed');
                setShowAlert(false);
              }}
            >
              {alert}
            </Alert>
          )}
          <Button
            type="submit"
            sx={styles.btn}
            onClick={handleSubmit}
          >
            submit
          </Button>
          <span style={styles.loginvia}>login via:</span>
          <Stack
            direction="row"
            spacing={1}
            sx={styles.footerStack}
            marginBottom="5px"
          >
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
          </Stack>
          <Button onClick={handleYandexLogin} sx={styles.btn}>
            <img src={yandexImage} style={{ width: '25px' }} />
            Login with Yandex
          </Button>
          <TelegramWidget onSubmited={onSubmited} />
          <Stack sx={styles.footerStack} direction="row" spacing={1}>
            <span style={styles.footerText}>
              don&apos;t have an account?
            </span>
            <Button
              sx={styles.btn}
              onClick={onSignUpClick}
              data-testid="signup-link"
            >
              sign up
            </Button>
          </Stack>
        </Stack>
      </form>
    </div>
  );
};

export default LoginModal;
