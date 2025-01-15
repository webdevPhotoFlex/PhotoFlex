import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setImageSrc,
  setIsDragOver,
} from '../../services/actions/image-actions';
import styles from './upload-container.module.css';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const UploadContainer = () => {
  const dispatch = useDispatch();
  const isDragOver = useSelector((state) => state.image.isDragOver);
  const darkMode = useSelector((state) => state.image.darkMode);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      readFile(file);
    }
  };
  const handleDragOver = (event) => {
    event.preventDefault();
    dispatch(setIsDragOver(true));
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    dispatch(setIsDragOver(false));
  };

  const handleDrop = (event) => {
    event.preventDefault();
    dispatch(setIsDragOver(false));
    const file = event.dataTransfer.files[0];
    if (file) {
      readFile(file);
    }
  };

  const readFile = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      dispatch(setImageSrc(reader.result));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className={`${styles.mainContainer} 
                  ${darkMode ? '' : styles.lightTheme} 
                  ${isDragOver ? styles.dragOver : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      role="button"
      data-testid="upload-container"
    >
      <p
        className={`${styles.uploadText} ${darkMode ? '' : styles.lightText}`}
      >
        choose or drag file
      </p>
      <input
        type="file"
        accept="image/*"
        id="fileInput"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        aria-label="choose or drag file"
        data-testid="upload-container-button"
      />
      <label htmlFor="fileInput" className={styles.uploadLabel}>
        <CloudUploadIcon className={styles.uploadIcon} />
      </label>
    </div>
  );
};

export default UploadContainer;
