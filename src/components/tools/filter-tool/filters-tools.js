import styles from './filters-tools.module.css';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter } from '../../../services/actions/image-actions';
import photo22 from '../../../images/22.png';
import photo23 from '../../../images/23.png';
import photo24 from '../../../images/24.png';
import photo25 from '../../../images/25.png';
import photo26 from '../../../images/26.png';
import photo27 from '../../../images/27.png';
import photo28 from '../../../images/28.png';

const Filters = () => {
  const dispatch = useDispatch();
  const activeFilter = useSelector((state) => state.image.filter);

  const filters = [
    { name: 'none', photo: photo22 },
    { name: 'grayscale', photo: photo23 },
    { name: 'sepia', photo: photo24 },
    { name: 'invert', photo: photo25 },
    { name: 'outerspace', photo: photo26 },
    { name: 'refulgence', photo: photo27 },
    { name: 'pink', photo: photo28 },
  ];
  const handleFilterSelect = (name) => {
    dispatch(setFilter(name));
  };
  return (
    <div
      className={styles.sharedContainer}
      data-testid="filters-component"
    >
      {filters.map(({ name, photo }, index) => (
        <div
          data-testid={`filter-${index}`}
          key={index}
          className={`${styles.filterItem} ${
            activeFilter === name ? styles.activeFilter : ''
          }`}
          onClick={() => handleFilterSelect(name)}
        >
          <div
            className={styles.filterBlock}
            style={{
              backgroundImage: `url(${photo})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <p className={styles.label}>{name}</p>
        </div>
      ))}
    </div>
  );
};

export default Filters;
