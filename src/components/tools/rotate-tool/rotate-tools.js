import React from 'react';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import styles from './rotate-tools.module.css';
import { Slider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setRotationAngle } from '../../../services/actions/image-actions';

const Rotate = () => {
  const dispatch = useDispatch();
  const rotation = useSelector((state) => state.image.rotationAngle);
  const darkMode = useSelector(
    (state) => state.image?.darkMode || false
  );

  const rotateLeft = () => {
    const newRotation = (rotation - 90 + 360) % 360;
    dispatch(setRotationAngle(newRotation));
  };

  const rotateRight = () => {
    const newRotation = (rotation + 90) % 360;
    dispatch(setRotationAngle(newRotation));
  };

  const handleSliderChange = (event, newValue) => {
    dispatch(setRotationAngle(newValue));
  };

  const handleReset = () => {
    dispatch(setRotationAngle(0));
  };

  return (
    <div
      className={styles.sharedContainer}
      data-testid="rotate-component"
    >
      <div onClick={rotateLeft} data-testid="rotate-left-icon">
        <RotateLeftIcon
          className={`${styles.rotateIcon} ${styles.left90}`}
          style={{ color: darkMode ? 'rgb(200, 200, 200)' : 'black' }}
        />
      </div>
      <div onClick={rotateRight} data-testid="rotate-right-icon">
        <RotateRightIcon
          className={`${styles.rotateIcon} ${styles.right90}`}
          style={{ color: darkMode ? 'rgb(200, 200, 200)' : 'black' }}
        />
      </div>
      <div className={styles.rotateItem}>
        <Slider
          aria-label="Rotation"
          min={0}
          max={360}
          value={rotation}
          onChange={handleSliderChange}
          valueLabelDisplay="auto"
          style={{
            color: darkMode ? 'rgb(200, 200, 200)' : 'rgb(0, 0, 0)',
          }}
          data-testid="rotation-slider"
        />
      </div>
      <button
        className={styles.button}
        onClick={handleReset}
        data-testid="reset-button"
        style={{
          backgroundColor: darkMode ? '#444' : '#884f9f',
          color: darkMode ? 'white' : 'black',
        }}
      >
        Сброс
      </button>
    </div>
  );
};

export default Rotate;
