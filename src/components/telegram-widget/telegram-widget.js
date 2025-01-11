import React, { useEffect } from 'react';
import { loginTelegram } from '../../services/actions/auth-actions';
import { useDispatch } from 'react-redux';

const TelegramWidget = ({ onSubmited }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    console.log('Attempting to load Telegram widget...');

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.setAttribute('data-telegram-login', 'photoflex_bot');
    script.setAttribute('data-size', 'medium');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-request-access', 'write');
    script.onload = () =>
      console.log('Telegram widget loaded successfully.');
    script.onerror = (err) =>
      console.error('Failed to load Telegram widget:', err);

    const container = document.getElementById(
      'telegram-widget-container'
    );
    container.appendChild(script);

    window.onTelegramAuth = (user) => {
      console.log('Telegram authentication started');
      console.log('User details:', user);

      if (user && user.auth_date && user.hash) {
        const authToken = user.hash;
        console.log('Auth token received:', authToken);
        dispatch(loginTelegram(authToken));
        onSubmited();
        console.log('Auth token saved to localStorage');
        onSubmited();
      } else {
        console.error(
          'Telegram authentication failed. Invalid user data:',
          user
        );
      }
    };

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <div
      id="telegram-widget-container"
      style={{ textAlign: 'center', marginTop: '20px' }}
    ></div>
  );
};

export default TelegramWidget;
