import styles from './login-modal.module.css';
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
import GoogleIcon from '@mui/icons-material/Google';
import TelegramIcon from '@mui/icons-material/Telegram';

const LoginModal = ({ onSignUpClick, onSubmited }) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const handleClickShowPassword = () =>
    setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const validateLogin = (login) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\+?[1-9]\d{1,14}$/;
    return (
      emailPattern.test(login) ||
      (phonePattern.test(login) && login.length > 0)
    );
  };

  const validatePassword = (password) => {
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordPattern.test(password);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setShowAlert(false);
    setAlert('');

    if (!validateLogin(login)) {
      setAlert('please enter valid email or phone number');
      setShowAlert(true);
      return;
    }
    if (!validatePassword(password)) {
      setAlert('password must be at least 8 characters long');
      setShowAlert(true);
      return;
    }
    setAlert('login succesful');
    setShowAlert(true);

    console.log('login: ', login);
    console.log('password: ', password);

    setLogin('');
    setPassword('');
    setShowAlert(false);
  };

  return (
    <div className={styles.mainContainer}>
      <DialogTitle
        className={styles.modalTitle}
        sx={{
          fontSize: '2rem',
          marginBottom: '16px',
        }}
      >
        sign in
      </DialogTitle>
      <form>
        <Stack spacing={2} className={styles.stack}>
          <FormControl variant="outlined">
            <InputLabel
              htmlFor="login-input"
              sx={{ color: '#fff', marginBottom: '3px' }}
            >
              Enter your phone number/email/login
            </InputLabel>
            <OutlinedInput
              required
              id="login-input"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              label="Login"
              sx={{
                backgroundColor: '#c3c3c3',
                borderRadius: '30px',
                input: { color: '#191919' },
                label: { color: '#686868' },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#686868',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#884f9f',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#884f9f',
                },
              }}
            />
          </FormControl>
          <FormControl variant="outlined">
            <InputLabel
              htmlFor="password-input"
              sx={{ color: '#fff', marginBottom: '3px' }}
            >
              Enter your password
            </InputLabel>
            <OutlinedInput
              required
              id="password-input"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                    className={styles.visability}
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
              sx={{
                backgroundColor: '#c3c3c3',
                borderRadius: '30px',
                input: { color: '#191919' },
                label: { color: '#686868' },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#686868',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#884f9f',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#884f9f',
                },
              }}
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
            className={styles.btn}
            sx={{
              color: '#c3c3c3',
            }}
            onClick={(handleSubmit, onSubmited)}
          >
            submit
          </Button>
          <span className={styles.loginvia}>login via:</span>
          <Stack
            direction="row"
            spacing={1}
            className={styles.footerStack}
            marginBottom="5px"
          >
            <Button
              variant="outlined"
              className={styles.socialBtn}
              sx={{
                minWidth: '40px',
                height: '40px',
                borderRadius: '30px',
                borderColor: '#c3c3c3',
                color: '#c3c3c3',
              }}
            >
              <GoogleIcon />
            </Button>
            <Button
              variant="outlined"
              className={styles.socialBtn}
              sx={{
                minWidth: '40px',
                height: '40px',
                borderRadius: '30px',
                borderColor: '#c3c3c3',
                color: '#c3c3c3',
              }}
            >
              <TelegramIcon />
            </Button>
          </Stack>
          <Stack
            className={styles.footerStack}
            direction="row"
            spacing={1}
          >
            <span className={styles.footerText}>
              don&apos;t have an account?
            </span>
            <Button
              className={styles.btn}
              onClick={onSignUpClick}
              sx={{
                color: '#c3c3c3',
              }}
            >
              sign up
            </Button>
          </Stack>
          <Stack
            className={styles.footerStack}
            direction="row"
            spacing={1}
          >
            <Button
              className={styles.btn}
              onClick={() => {
                /*redirect to recover password form*/
              }}
              sx={{
                color: '#c3c3c3',
              }}
            >
              recover password
            </Button>
          </Stack>
        </Stack>
      </form>
    </div>
  );
};
export default LoginModal;
