import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './replace-bg-tool.module.css';
import {
  setBrushSize,
  setImage,
  setImageBeforeRemove,
  setMask,
} from '../../../services/actions/image-actions';
import { applyMaskToImageData } from '../../../utils/image-utils';
import AuthRequired from '../auth-required/auth-required';

const ReplaceBgTool = ({ canvasRef }) => {
  const dispatch = useDispatch();
  const {
    imageBeforeRemove,
    image,
    brushSize,
    mask,
    rotationAngle,
    cropArea,
  } = useSelector((state) => state.image);
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  const [newImage, setNewImage] = useState(null);
  useEffect(() => {
    if (!imageBeforeRemove && image) {
      dispatch(setImageBeforeRemove(image));
    }
  }, [image, imageBeforeRemove, dispatch]);

  const handleReplaceBackground = () => {
    if (!canvasRef.current || !image) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const scale = width / image.width;
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
    }
    if (newImage) {
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      const img = new Image();
      img.src = URL.createObjectURL(newImage);
      img.onload = () => {
        ctx.filter = 'none';
        ctx.drawImage(img, 0, 0, width, height);
        const finalImage = ctx.getImageData(0, 0, width, height);
        const finalData = finalImage.data;
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] > 0) {
            finalData[i] = data[i];
            finalData[i + 1] = data[i + 1];
            finalData[i + 2] = data[i + 2];
            finalData[i + 3] = data[i + 3];
          }
        }
        ctx.putImageData(finalImage, 0, 0);
        const finalImageUrl = canvas.toDataURL();
        const finalImageElement = new Image();
        finalImageElement.src = finalImageUrl;
        finalImageElement.onload = () => {
          dispatch(setImage(finalImageElement));
        };
      };
    } else {
      const finalImageUrl = canvas.toDataURL();
      const finalImageElement = new Image();
      finalImageElement.src = finalImageUrl;
      finalImageElement.onload = () => {
        dispatch(setImage(finalImageElement));
      };
    }

    dispatch(setMask([]));
  };
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setNewImage(file);
    } else {
      setNewImage(null);
    }
  };
  const handleReset = () => {
    if (imageBeforeRemove) {
      dispatch(setImage(imageBeforeRemove));
      dispatch(setMask([]));
      setNewImage(null);
    } else {
      console.warn('Оригинальное изображение отсутствует.');
      dispatch(setImage(null));
      dispatch(setMask([]));
      setNewImage(null);
    }
  };
  const imageUrl = newImage ? URL.createObjectURL(newImage) : null;
  if (!isAuth) {
    return <AuthRequired />;
  }
  return (
    <div
      className={styles.container}
      data-testid="replace-bg-component"
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
        <label
          htmlFor="file-upload"
          className={styles.customFileLabel}
        >
          Загрузить фон
        </label>
        <input
          id="file-upload"
          type="file"
          onChange={handleImageUpload}
          accept="image/*"
          className={styles.fileInput}
          data-testid="fileUploadInput1"
        />
        <button
          className={`${styles.button} ${!newImage && styles.disabled}`}
          onClick={handleReplaceBackground}
          data-testid="replaceButton"
          disabled={!newImage}
        >
          Заменить фон
        </button>
        {imageUrl && (
          <div
            className={styles.previewContainer}
            data-testid="previewContainer"
          >
            <img
              src={imageUrl}
              alt="Preview"
              className={styles.previewImage}
              data-testid="previewImage"
            />
          </div>
        )}
        <button
          className={`${styles.button} ${!imageBeforeRemove && styles.disabled}`}
          onClick={handleReset}
          data-testid="reset1"
          disabled={!imageBeforeRemove}
        >
          Сброс
        </button>
      </div>
    </div>
  );
};

export default ReplaceBgTool;
