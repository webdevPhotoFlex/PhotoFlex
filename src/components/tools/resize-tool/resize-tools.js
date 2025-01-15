import React, { useEffect, useState } from 'react';
import {
  Crop169,
  Crop32,
  Crop54,
  Crop75,
  CropPortrait,
  CropSquare,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  setImageBeforeRemove,
  setResizeDimensions,
} from '../../../services/actions/image-actions';
import styles from './resize-tools-styles';
const Resize = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector(
    (state) => state.image?.darkMode || false
  );

  const resizeDimensions = useSelector(
    (state) => state.image.resizeDimensions || { width: 0, height: 0 }
  );
  const { imageBeforeRemove, image } = useSelector(
    (state) => state.image
  );
  const originalImage = useSelector(
    (state) => state.image.originalImage || { width: 0, height: 0 }
  );
  useEffect(() => {
    if (!imageBeforeRemove && image) {
      dispatch(setImageBeforeRemove(image));
    }
  }, [image, imageBeforeRemove, dispatch]);
  const [dimensions, setDimensions] = useState({
    width: resizeDimensions.width,
    height: resizeDimensions.height,
  });
  useEffect(() => {
    setDimensions({
      width: resizeDimensions.width,
      height: resizeDimensions.height,
    });
  }, [resizeDimensions]);
  const resizePresets = [
    { component: Crop169, name: '16:9', width: 900, height: 506 },
    { component: CropSquare, name: '4:4', width: 600, height: 600 },
    {
      component: CropPortrait,
      name: '9:16',
      width: 506,
      height: 900,
    },
    { component: Crop32, name: '3:2', width: 750, height: 500 },
    { component: Crop54, name: '5:4', width: 624, height: 500 },
    { component: Crop75, name: '7:5', width: 800, height: 500 },
  ];
  const handleResizePreset = (width, height) => {
    setDimensions({ width, height });
    dispatch(setResizeDimensions({ width, height }));
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value === '' ? '' : Number(value);
    setDimensions((prev) => ({ ...prev, [name]: numericValue }));
    if (numericValue > 0) {
      dispatch(
        setResizeDimensions({
          ...dimensions,
          [name]: numericValue,
        })
      );
    }
  };

  const handleReset = () => {
    const { width, height } = originalImage;
    setDimensions({ width, height });
    dispatch(setResizeDimensions({ width, height }));
  };

  return (
    <div
      style={styles.sharedContainer}
      data-testid="resize-component"
    >
      <div style={styles.dimensionInputContainer}>
        <label
          style={styles.label(darkMode ? 'dark' : 'light')}
          htmlFor="resize-width"
        >
          Width:
        </label>
        <input
          type="number"
          id="resize-width"
          name="width"
          style={styles.dimensionInput(darkMode ? 'dark' : 'light')}
          data-testid="resize-width"
          value={dimensions.width}
          onChange={handleInputChange}
        />
        <label
          style={styles.label(darkMode ? 'dark' : 'light')}
          htmlFor="resize-height"
        >
          Height:
        </label>
        <input
          type="number"
          id="resize-height"
          name="height"
          style={styles.dimensionInput(darkMode ? 'dark' : 'light')}
          data-testid="resize-height"
          value={dimensions.height}
          onChange={handleInputChange}
        />
      </div>
      {resizePresets.map((preset, index) => {
        const ResizeComponent = preset.component;
        return (
          <div
            key={index}
            style={styles.cropItemStyle}
            onClick={() =>
              handleResizePreset(preset.width, preset.height)
            }
            data-testid={`resize-${preset.name}`}
          >
            <ResizeComponent
              style={styles.cropIconStyle(
                darkMode ? 'dark' : 'light'
              )}
            />
            <p style={styles.label(darkMode ? 'dark' : 'light')}>
              {preset.name}
            </p>
          </div>
        );
      })}
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

export default Resize;
