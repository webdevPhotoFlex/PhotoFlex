import React from 'react';
import styles from './tool-bar.module.css';
import TuneIcon from '@mui/icons-material/Tune';
import CropIcon from '@mui/icons-material/Crop';
import Rotate90DegreesCcwIcon from '@mui/icons-material/Rotate90DegreesCcw';
import SettingsOverscanIcon from '@mui/icons-material/SettingsOverscan';
import PhotoFilterIcon from '@mui/icons-material/PhotoFilter';
import TextureIcon from '@mui/icons-material/Texture';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import TitleIcon from '@mui/icons-material/Title';
import BlurOffIcon from '@mui/icons-material/BlurOff';

import { useDispatch, useSelector } from 'react-redux';
import { setActiveTool } from '../../services/actions/image-actions';

const ToolBar = ({ isToolsDisabled }) => {
  const dispatch = useDispatch();
  const activeTool = useSelector((state) => state.image.activeTool);
  const darkMode = useSelector((state) => state.image.darkMode);

  const icons = [
    { component: TuneIcon, className: styles.tune },
    { component: CropIcon, className: styles.crop },
    { component: Rotate90DegreesCcwIcon, className: styles.rotate },
    { component: SettingsOverscanIcon, className: styles.settings },
    { component: PhotoFilterIcon, className: styles.photoFilter },
    { component: TextureIcon, className: styles.texture },
    { component: WallpaperIcon, className: styles.wallpaper },
    { component: BlurOffIcon, className: styles.texture },
    { component: TitleIcon, className: styles.title },
  ];

  return (
    <div
      className={`${styles.mainContainer} ${darkMode ? styles.darkTheme : styles.lightTheme}`}
      data-testid="toolbar"
    >
      {icons.map(({ component: IconComponent, className }, index) => (
        <IconComponent
          data-testid={`icon-${index}`}
          key={index}
          className={`${styles.icon} ${
            activeTool === index ? styles.clicked : styles.notClicked
          } ${className} ${isToolsDisabled ? styles.disabled : ''}`}
          onClick={() => {
            if (!isToolsDisabled) {
              dispatch(setActiveTool(index));
            }
          }}
          style={{ pointerEvents: isToolsDisabled ? 'none' : 'auto' }}
        />
      ))}
    </div>
  );
};

export default ToolBar;
