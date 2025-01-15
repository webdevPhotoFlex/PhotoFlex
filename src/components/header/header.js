import React, { useState } from 'react';
import styles from './header.module.css';
import logoImg from './../../images/logo.png';
import RedoIcon from '@mui/icons-material/Redo';
import FlipIcon from '@mui/icons-material/Flip';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import { NavLink, useNavigate } from 'react-router-dom';
import { saveAs } from 'file-saver';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../hooks/use-modal';
import AuthModal from '../modal/auth-modal';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

import {
  redo,
  setShowOriginal,
  undo,
  resetState,
  toggleTheme,
} from '../../services/actions/image-actions';

const Header = ({ canvasRef }) => {
  const dispatch = useDispatch();
  const darkMode = useSelector(
    (state) => state.image?.darkMode || false
  );
  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };
  const navigate = useNavigate();
  const {
    isModalOpen,
    activeModal,
    openModal,
    closeModal,
    toggleToLogin,
    toggleToRegister,
    closeModalWithTimeOut,
  } = useModal();
  const [selectedFormat, setSelectedFormat] = useState('png');
  const isAuth = useSelector((state) => state.auth.isAuthenticated);

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const format = selectedFormat.toLowerCase();
      if (format === 'svg') {
        const svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
            <foreignObject width="100%" height="100%">
              <div xmlns="http://www.w3.org/1999/xhtml" style="width:${canvas.width}px;height:${canvas.height}px;">
                <img src="${canvas.toDataURL('image/png')}" style="width:100%;height:100%;" alt=" "/>
              </div>
            </foreignObject>
          </svg>
        `;
        const blob = new Blob([svgContent], {
          type: 'image/svg+xml;charset=utf-8',
        });
        saveAs(blob, 'photoflex.svg');
      } else {
        const imageData = canvas.toDataURL(`image/${selectedFormat}`);
        const link = document.createElement('a');
        link.href = imageData;
        link.download = `photoflex.${selectedFormat}`;
        link.click();
      }
    }
  };

  const handleProfileClick = () => {
    if (isAuth) {
      navigate('/personal-account');
    } else {
      openModal('login');
    }
  };

  const handleUndo = () => {
    dispatch(undo());
  };

  const handleRedo = () => {
    dispatch(redo());
  };

  const handleReset = () => {
    dispatch(resetState());
  };

  return (
    <div
      className={`${styles.mainContainer} ${darkMode ? styles.darkTheme : styles.lightTheme}`}
      data-testid="header"
    >
      <NavLink to={'/'}>
        <img
          src={logoImg}
          className={styles.logoContainer}
          alt="logo"
          data-testid="logo"
        />
      </NavLink>
      <RedoIcon
        className={`${styles.icon} ${styles.redo}`}
        onClick={handleUndo}
        data-testid="undo-icon"
      />
      <RedoIcon
        className={`${styles.icon} ${styles.redoRight}`}
        onClick={handleRedo}
        data-testid="redo-icon"
      />
      <FlipIcon
        className={`${styles.icon} ${styles.flip}`}
        onMouseDown={() => dispatch(setShowOriginal(true))}
        onMouseUp={() => dispatch(setShowOriginal(false))}
        onMouseLeave={() => dispatch(setShowOriginal(false))}
        data-testid="flip-icon"
      />
      <DeleteIcon
        className={`${styles.icon} ${styles.reset}`}
        onClick={handleReset}
        data-testid="reset-icon"
      />
      <div
        onClick={handleThemeToggle}
        className={styles.themeToggle}
        data-testid="theme-toggle"
      >
        {darkMode ? (
          <LightModeIcon
            className={`${styles.icon} ${styles.lightTheme}`}
            data-testid="light-mode-icon"
          />
        ) : (
          <DarkModeIcon
            className={`${styles.icon} ${styles.darkTheme}`}
            data-testid="dark-mode-icon"
          />
        )}
      </div>
      <div className={styles.saveContainer}>
        <select
          value={selectedFormat}
          onChange={(e) => setSelectedFormat(e.target.value)}
          className={`${styles.formatSelect} ${darkMode ? styles.darkTheme : styles.lightTheme}`}
        >
          <option value="png">PNG</option>
          <option value="jpeg">JPEG</option>
          <option value="jpg">JPG</option>
          <option value="webp">WEBP</option>
          <option value="svg">SVG</option>
        </select>
        <SaveIcon
          className={`${styles.icon} ${styles.save}`}
          onClick={handleSave}
          data-testid="save-icon"
        />
      </div>
      {isAuth ? (
        <AccountCircleIcon
          onClick={handleProfileClick}
          data-testid="account-icon"
          className={`${styles.icon} ${styles.acc}`}
        />
      ) : (
        <PersonAddIcon
          onClick={handleProfileClick}
          data-testid="PersonAddIcon"
          className={`${styles.icon} ${styles.personAdd}`}
        />
      )}
      <AuthModal
        data-testid="auth-modal"
        isModalOpen={isModalOpen}
        activeModal={activeModal}
        onClose={closeModal}
        toggleToLogin={toggleToLogin}
        toggleToRegister={toggleToRegister}
        closeModalWithTimeOut={closeModalWithTimeOut}
      />
    </div>
  );
};

export default Header;
