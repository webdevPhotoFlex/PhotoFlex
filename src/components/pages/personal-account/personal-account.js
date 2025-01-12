import styles from './personal-account.module.css';
import logoImg from '../../../images/logo.png';
import EditIcon from '@mui/icons-material/Edit';
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LogoutIcon from '@mui/icons-material/Logout';
import photo1 from '../../../images/1.jpeg';
import photo2 from '../../../images/2.jpeg';
import photo5 from '../../../images/5.jpeg';
import photo6 from '../../../images/6.jpeg';
import photo7 from '../../../images/7.jpeg';
import photo10 from '../../../images/10.jpeg';
import photo11 from '../../../images/11.jpeg';
import photo12 from '../../../images/12.jpeg';
import photo13 from '../../../images/13.jpeg';
import photo15 from '../../../images/15.jpeg';
import photo16 from '../../../images/16.jpeg';
import photo17 from '../../../images/17.jpeg';
import photo18 from '../../../images/18.jpeg';
import photo20 from '../../../images/20.jpeg';
import { useDispatch } from 'react-redux';
import { exitUser } from '../../../services/actions/auth-actions';

const PersonalAccount = () => {
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userData, setUserData] = useState({
    phone: '+7 999 999 99 99',
    email: 'username52@gmail.com',
    telegram: '@username666',
    userName: 'Username',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({
    phone: '',
    email: '',
  });
  const photos = [
    photo1,
    photo2,
    photo5,
    photo6,
    photo7,
    photo10,
    photo11,
    photo12,
    photo13,
    photo15,
    photo16,
    photo17,
    photo18,
    photo20,
  ];

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + photos.length) % photos.length
    );
  };

  const visiblePhotos = [
    photos[(currentIndex + 0) % photos.length],
    photos[(currentIndex + 1) % photos.length],
    photos[(currentIndex + 2) % photos.length],
  ];

  const handleEditClick = () => {
    if (errors.phone || errors.email) {
      return;
    }
    setIsEditing((prev) => !prev);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'phone') {
      const phonePattern = /^\+7 \d{3} \d{3} \d{2} \d{2}$/;
      if (!phonePattern.test(value)) {
        setErrors((prev) => ({
          ...prev,
          phone: 'Неверный формат номера',
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          phone: '',
          email: prev.email || '',
        }));
      }
      const formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length === 11) {
        setUserData((prevData) => ({
          ...prevData,
          phone: `+7 ${formattedValue.slice(1, 4)} ${formattedValue.slice(4, 7)} ${formattedValue.slice(7, 9)} ${formattedValue.slice(9, 11)}`,
        }));
        return;
      }
    }
    if (name === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        setErrors((prev) => ({
          ...prev,
          email: 'Неверный формат email',
        }));
      } else {
        setErrors((prev) => ({ ...prev, email: '' }));
      }
    }
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleExit = () => {
    dispatch(exitUser());
  };
  return (
    <div className={styles.mainContainer}>
      <div className={styles.accHeader}>
        <NavLink to={'/'}>
          <img
            src={logoImg || null}
            className={styles.logoContainer}
            alt={'Logo'}
            title="Go to Home"
          />
        </NavLink>
        <div className={styles.headerIcons}>
          <EditIcon
            data-testid="edit-icon"
            className={`${styles.icon} ${styles.editIcon}`}
            onClick={handleEditClick}
            title="Edit Profile"
          />
          <LogoutIcon
            data-testid="logout-icon"
            onClick={handleExit}
            className={`${styles.icon} ${styles.exitIcon}`}
            title="Logout"
          />
        </div>
      </div>

      <div
        className={styles.userContainer}
        data-testid="username-container"
      >
        <div
          className={`${styles.editSection} ${isEditing ? styles.editing : ''}`}
        >
          {isEditing ? (
            <input
              data-testid="username-input"
              type="text"
              name="userName"
              value={userData.userName}
              placeholder="name"
              onChange={handleChange}
              maxLength={30}
              className={styles.nameInput}
            />
          ) : (
            <span className={styles.userName}>
              {userData.userName}
            </span>
          )}
        </div>
        <div
          className={`${styles.dataContainer} ${isEditing ? styles.editing : ''}`}
        >
          {['phone', 'email', 'telegram'].map((field) => (
            <div key={field} className={styles.dataRow}>
              <span>{`${field}:`}</span>
              <input
                data-testid="user-data"
                type="text"
                name={field}
                value={userData[field]}
                placeholder={field}
                onChange={handleChange}
                className={`${styles.inputsData} ${field === 'email' && isEditing ? styles.emailInput : ''}`}
                maxLength={
                  field === 'email'
                    ? 35
                    : field === 'telegram'
                      ? 20
                      : undefined
                }
                disabled={!isEditing}
              />
              {errors[field] && (
                <span className={styles.error}>{errors[field]}</span>
              )}
            </div>
          ))}
        </div>
      </div>
      <section
        data-testid="photos-container"
        className={styles.photosContainer}
      >
        <ArrowBackIosIcon
          data-testid="arrow-back"
          className={`${styles.icon} ${styles.backIcon}`}
          onClick={handlePrev}
        />
        {visiblePhotos.map((photo, index) => (
          <div
            key={index}
            className={styles.photo}
            style={{ backgroundImage: `url(${photo})` }}
            data-testid={`photo-${index}`}
          />
        ))}
        <ArrowForwardIosIcon
          data-testid="arrow-forward"
          className={`${styles.icon} ${styles.nextIcon}`}
          onClick={handleNext}
        />
      </section>
    </div>
  );
};

export default PersonalAccount;
