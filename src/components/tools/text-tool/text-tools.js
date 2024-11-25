import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CircleIcon from '@mui/icons-material/Circle';
import React from 'react';
import styles from '../text-tool/text-tools.module.css';

const Text = () => {
  const color = [
    { component: CircleIcon, className: styles.black },
    { component: CircleIcon, className: styles.white },
    { component: CircleIcon, className: styles.red },
    { component: CircleIcon, className: styles.orange },
    { component: CircleIcon, className: styles.yellow },
    { component: CircleIcon, className: styles.green },
    { component: CircleIcon, className: styles.blue },
    { component: CircleIcon, className: styles.purple },
  ];

  return (
    <div
      className={styles.sharedContainer}
      data-testid="text-component"
    >
      <div className={styles.textItem} data-testid="add-text-item">
        <AddCircleOutlineIcon
          className={styles.circle}
          style={{ fontSize: '80px' }}
          data-testid="add-text-icon"
        />
        <p className={styles.label}>Добавить текст</p>
      </div>
      <div className={styles.textItem}>
        <div className={styles.colorContainer}>
          {color.map((color, index) => {
            const ColorIcon = color.component;
            return (
              <div
                key={index}
                className={styles.colorBlock}
                data-testid={`color-block-${index}`}
              >
                <ColorIcon
                  className={color.className}
                  style={{ fontSize: '40px' }}
                  data-testid={`color-icon-${index}`}
                />
              </div>
            );
          })}
        </div>
        <p className={styles.label}>Выбор цвета</p>
      </div>
    </div>
  );
};

export default Text;
