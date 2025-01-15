import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './main-page.module.css';
import Header from '../../header/header';
import UploadContainer from '../../upload-container/upload-container';
import ToolBar from '../../tool-bar/tool-bar';
import Tools from '../../tools/tools';
import useImageDrawer from '../../../hooks/drawHook';
import {
  setDrawing,
  setImage,
  setMask,
  setOriginalImage,
  setResizeDimensions,
} from '../../../services/actions/image-actions';
import { resizeImageToCanvas } from '../../../utils/image-utils';
import { loginYandex } from '../../../services/actions/auth-actions';

const MainPage = () => {
  const {
    imageSrc,
    activeTool,
    rotationAngle,
    filter,
    cropArea,
    brushSize,
    mask,
    appliedMask,
    drawing,
    showOriginal,
    originalImage,
    image,
    resizeDimensions,
    tune,
    texts,
    darkMode,
  } = useSelector((state) => state.image);

  const dispatch = useDispatch();
  const canvasRef = useRef(null);

  const isToolsDisabled = mask.length > 0;

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('access_token')) {
      const query = new URLSearchParams(hash.replace('#', ''));
      const accessToken = query.get('access_token');

      if (accessToken) {
        console.log('Яндекс токен', accessToken);
        dispatch(loginYandex(accessToken));
      }

      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [dispatch]);

  useEffect(() => {
    if (imageSrc) {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        dispatch(setImage(img));
        dispatch(setOriginalImage(img));
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const resizedDimensions = resizeImageToCanvas(
          img,
          Math.min(screenWidth * 0.9, 1920),
          Math.min(screenHeight * 0.9, 1080),
          800,
          600
        );

        dispatch(setResizeDimensions(resizedDimensions));
      };
    }
  }, [imageSrc, dispatch]);

  useImageDrawer({
    canvasRef,
    image,
    originalImage,
    showOriginal,
    filter,
    cropArea,
    resizeDimensions,
    rotationAngle,
    mask,
    appliedMask,
    brushSize,
    tuneSettings: tune,
    texts,
  });

  const handleMouseDown = (e) => {
    if (activeTool !== 5 && activeTool !== 6) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    dispatch(setDrawing(true));
    dispatch(setMask([...mask, { x, y, brushSize }]));
  };

  const handleMouseMove = (e) => {
    if (!drawing || (activeTool !== 5 && activeTool !== 6)) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    dispatch(setMask([...mask, { x, y, brushSize }]));
  };

  const handleMouseUp = () => {
    if (activeTool !== 5 && activeTool !== 6) return;
    dispatch(setDrawing(false));
  };

  return (
    <div
      data-testid="main-container"
      className={`${styles.mainContainer} ${darkMode ? '' : styles.lightTheme}`}
    >
      <Header canvasRef={canvasRef} />
      <div className={styles.toolContainer}>
        <ToolBar
          isToolsDisabled={isToolsDisabled}
          data-testid="toolbar"
        />
        <Tools
          canvasRef={canvasRef}
          activeTool={activeTool}
          data-testid="tools-component"
        />
        <div
          data-testid="image-container"
          className={`${styles.imageContainer} ${darkMode ? '' : styles.lightTheme}`}
        >
          {imageSrc ? (
            <div
              style={{
                width: `${resizeDimensions?.width || 1200}px`,
                height: `${resizeDimensions?.height || 800}px`,
                overflow: 'hidden',
              }}
            >
              <canvas
                ref={canvasRef}
                width={resizeDimensions.width}
                height={resizeDimensions.height}
                style={{ maxWidth: '100%', maxHeight: '100%' }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                data-testid="canvasMain"
              />
            </div>
          ) : (
            <UploadContainer data-testid="upload-container" />
          )}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
