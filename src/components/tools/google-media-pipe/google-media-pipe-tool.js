import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SelfieSegmentation } from '@mediapipe/selfie_segmentation';
import styles from './remove-bg-tool.module.css';
import {
  setImage,
  setMask,
} from '../../../services/actions/image-actions';
import AuthRequired from '../auth-required/auth-required';

const GoogleRemoveBgTool = ({ canvasRef }) => {
  const dispatch = useDispatch();
  const { image, imageBeforeRemove } = useSelector(
    (state) => state.image
  );
  const isAuth = useSelector((state) => state.auth.isAuthenticated);
  const [loading, setLoading] = useState(false);
  const segmentation = useRef(null);

  const initSegmentation = () => {
    if (!segmentation.current) {
      segmentation.current = new SelfieSegmentation({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
      });
      segmentation.current.setOptions({ modelSelection: 1 });
    }
  };

  const handleRemoveBackground = async () => {
    if (!canvasRef.current || !image) return;

    setLoading(true);
    initSegmentation();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const inputImage = new Image();
    inputImage.src = image.src;
    inputImage.onload = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(inputImage, 0, 0, width, height);

      const inputImageData = ctx.getImageData(0, 0, width, height);

      segmentation.current.onResults((results) => {
        if (results.segmentationMask) {
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(
            results.segmentationMask,
            0,
            0,
            width,
            height
          );

          // Применение маски сегментации к изображению
          const maskData = ctx.getImageData(0, 0, width, height).data;
          const outputImageData = ctx.createImageData(width, height);

          for (let i = 0; i < maskData.length; i += 4) {
            const alpha = maskData[i] / 255; // Маска из MediaPipe
            const index = i;
            outputImageData.data[index] =
              inputImageData.data[index] * alpha;
            outputImageData.data[index + 1] =
              inputImageData.data[index + 1] * alpha;
            outputImageData.data[index + 2] =
              inputImageData.data[index + 2] * alpha;
            outputImageData.data[index + 3] =
              inputImageData.data[index + 3];
          }

          ctx.putImageData(outputImageData, 0, 0);
          const finalImage = new Image();
          finalImage.src = canvas.toDataURL();
          finalImage.onload = () => {
            dispatch(setImage(finalImage));
          };
        }
        setLoading(false);
      });

      segmentation.current.send({ image: inputImage });
    };
  };

  const handleReset = () => {
    if (imageBeforeRemove) {
      dispatch(setImage(imageBeforeRemove));
      dispatch(setMask([]));
    } else {
      dispatch(setImage(null));
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
      <div className={styles.buttonsContainer}>
        <button
          className={styles.button}
          onClick={handleRemoveBackground}
          data-testid="removeButton"
          disabled={loading || !image}
        >
          {loading ? 'Удаление фона...' : 'Удалить фон'}
        </button>
        <button
          className={styles.button}
          onClick={handleReset}
          data-testid="resetButton"
        >
          Сброс
        </button>
      </div>
    </div>
  );
};

export default GoogleRemoveBgTool;
