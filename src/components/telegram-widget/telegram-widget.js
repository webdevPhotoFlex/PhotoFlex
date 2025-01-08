import React, { useEffect } from 'react';

const TelegramWidget = () => {
  useEffect(() => {
    console.log('Attempting to load Telegram widget...');

    // Создаем тег <script> для Telegram виджета
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.setAttribute('data-telegram-login', 'photoflex_bot'); // Имя вашего бота
    script.setAttribute('data-size', 'medium'); // Размер кнопки
    script.setAttribute('data-onauth', 'onTelegramAuth(user)'); // Callback-функция
    script.setAttribute('data-request-access', 'write'); // Права доступа
    script.onload = () =>
      console.log('Telegram widget loaded successfully.');
    script.onerror = (err) =>
      console.error('Failed to load Telegram widget:', err);

    // Добавляем скрипт в контейнер
    const container = document.getElementById(
      'telegram-widget-container'
    );
    container.appendChild(script);

    // Определяем глобальный callback для авторизации
    window.onTelegramAuth = (user) => {
      console.log('Telegram authentication started');
      console.log('User details:', user);

      if (user && user.auth_date && user.hash) {
        const authToken = user.hash;
        console.log('Auth token received:', authToken);

        // Сохранение токена, пример:
        localStorage.setItem('authToken', authToken);
        console.log('Auth token saved to localStorage');
      } else {
        console.error(
          'Telegram authentication failed. Invalid user data:',
          user
        );
      }
    };

    return () => {
      // Чистим контейнер при размонтировании компонента
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <div
      id="telegram-widget-container"
      style={{ textAlign: 'center', marginTop: '20px' }}
    >
      {/* Telegram виджет будет загружен в этот div */}
    </div>
  );
};

export default TelegramWidget;
