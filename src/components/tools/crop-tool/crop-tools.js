import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCropArea } from '../../../services/actions/image-actions';
import styles from './crop-tools-styles';

const Crop = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector(
    (state) => state.image?.darkMode || false
  );

  const currentCropArea = useSelector(
    (state) => state.image.cropArea
  );

  const [cropArea, setCropAreaState] = useState({
    x: currentCropArea.x,
    y: currentCropArea.y,
  });

  const [localInput, setLocalInput] = useState({
    x: String(currentCropArea.x),
    y: String(currentCropArea.y),
  });

  useEffect(() => {
    dispatch(setCropArea(cropArea));
  }, [cropArea, dispatch]);

  useEffect(() => {
    setCropAreaState(currentCropArea);
    setLocalInput({
      x: String(currentCropArea.x),
      y: String(currentCropArea.y),
    });
  }, [currentCropArea]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value === '' ? '' : Number(value);

    const sanitizedValue = numericValue < 0 ? 0 : numericValue;

    setLocalInput((prev) => ({ ...prev, [name]: value }));

    if (!isNaN(numericValue)) {
      setCropAreaState((prev) => ({
        ...prev,
        [name]: sanitizedValue,
      }));
    }
  };

  const handleReset = () => {
    const defaultCropArea = { x: 0, y: 0 };
    setCropAreaState(defaultCropArea);
    dispatch(setCropArea(defaultCropArea));
  };

  return (
    <div style={styles.sharedContainer} data-testid="crop-component">
      <div style={styles.dimensionInputContainer}>
        <p style={styles.label(darkMode ? 'dark' : 'light')}>X: </p>
        <input
          type="number"
          aria-label="X Coordinate"
          name="x"
          style={styles.dimensionInput(darkMode ? 'dark' : 'light')}
          value={localInput.x}
          onChange={handleInputChange}
          min="0"
        />
        <p style={styles.label(darkMode ? 'dark' : 'light')}>Y: </p>
        <input
          type="number"
          aria-label="Y Coordinate"
          name="y"
          style={styles.dimensionInput(darkMode ? 'dark' : 'light')}
          value={localInput.y}
          onChange={handleInputChange}
          min="0"
        />
      </div>
      <button
        style={styles.button}
        onClick={handleReset}
        data-testid="reset-button"
      >
        Сброс
      </button>
    </div>
  );
};

export default Crop;
