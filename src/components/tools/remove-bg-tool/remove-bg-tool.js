import React, { useEffect } from 'react';
import styles from './remove-bg-tool.module.css';
import {
  setBrushSize,
  setImage,
  setImageBeforeRemove,
  setMask,
} from '../../../services/actions/image-actions';
import { useSelector, useDispatch } from 'react-redux';
import { applyMaskToImageData } from '../../../utils/image-utils';
import AuthRequired from '../auth-required/auth-required';

const RemoveBgTool = ({ canvasRef }) => {
  const dispatch = useDispatch();
  const {
    imageBeforeRemove,
    image,
    brushSize,
    mask,
    resizeDimensions,
    rotationAngle,
    cropArea,
  } = useSelector((state) => state.image);
  const isAuth = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!imageBeforeRemove && image) {
      dispatch(setImageBeforeRemove(image));
    }
  }, [image, imageBeforeRemove, dispatch]);

  const handleRemoveBackground = () => {
    if (!image || !canvasRef.current || !resizeDimensions) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { width, height } = resizeDimensions;
    const scale = width / image.width;
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);
    ctx.filter = 'none';
    ctx.drawImage(image, 0, 0, width, height);
    if (mask.length > 0) {
      const imageData = ctx.getImageData(0, 0, width, height);
      const updatedImageData = applyMaskToImageData(
        imageData,
        mask,
        canvas.width,
        canvas.height,
        rotationAngle,
        scale,
        cropArea
      );
      ctx.putImageData(updatedImageData, 0, 0);
      const updatedImage = new Image();
      updatedImage.src = canvas.toDataURL();
      updatedImage.onload = () => {
        dispatch(setImage(updatedImage));
      };
    }

    dispatch(setMask([]));
  };

  const handleReset = () => {
    if (imageBeforeRemove) {
      dispatch(setImage(imageBeforeRemove));
      dispatch(setMask([]));
    }
  };

  if (!isAuth) {
    return <AuthRequired />;
  }

  return (
    <div
      className={styles.container}
      data-testid="remove-bg-component"
    >
      <label className={styles.brushSizeLabel} htmlFor="brushSize">
        <span className={styles.labelText}>Размер кисти:</span>
        <span className={styles.labelValue}>{brushSize}</span>
      </label>
      <input
        type="range"
        id="brushSize"
        min="5"
        max="200"
        value={brushSize}
        onChange={(e) =>
          dispatch(setBrushSize(Number(e.target.value)))
        }
        className={styles.rangeInput}
        aria-label="brush size"
      />

      <div className={styles.buttonsContainer}>
        <button
          className={styles.button}
          onClick={handleRemoveBackground}
          disabled={!image}
        >
          Удалить фон
        </button>
        <button
          className={styles.button}
          onClick={handleReset}
          disabled={!imageBeforeRemove}
        >
          Сброс
        </button>
      </div>
    </div>
  );
};

export default RemoveBgTool;
