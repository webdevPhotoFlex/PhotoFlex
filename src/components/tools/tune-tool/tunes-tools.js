import React, { useState } from 'react';
import { Slider } from '@mui/material';
import styles from './tunes-tools.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { setTunes } from '../../../services/actions/image-actions';

const Tunes = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector(
    (state) => state.image?.darkMode || false
  );

  const tunes = [
    { name: 'brightness', min: 0, max: 100 },
    { name: 'contrast', min: 0, max: 100 },
    { name: 'saturation', min: 0, max: 100 },
    { name: 'blur', min: 0, max: 100 },
  ];

  const [settings, setSettings] = useState({
    brightness: 50,
    contrast: 50,
    saturation: 50,
    blur: 0,
  });

  const handleSlider = (optionName) => (event, newValue) => {
    const updatedSettings = { ...settings, [optionName]: newValue };
    setSettings(updatedSettings);
    dispatch(setTunes(updatedSettings));
  };

  return (
    <div
      className={`${styles.sharedContainer} ${darkMode ? styles.darkTheme : styles.lightTheme}`}
      data-testid="tunes-component"
    >
      {tunes.map((tune) => (
        <div key={tune.name} className={styles.tuneItem}>
          <p className={styles.label}>
            {tune.name.charAt(0).toUpperCase() + tune.name.slice(1)}
          </p>
          <Slider
            data-testid={`${tune.name}-slider`}
            aria-label={tune.name}
            value={settings[tune.name]}
            min={tune.min}
            max={tune.max}
            onChange={handleSlider(tune.name)}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${value}%`}
            style={{
              color: '#884f9f',
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default Tunes;
