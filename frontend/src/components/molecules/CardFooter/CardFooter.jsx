import React from 'react';
import styles from './CardFooter.module.css';
import CardActions from '../../atoms/CardActions/CardActions';
import Chip from '../../atoms/Chip/Chip';
import ProgressBar from '../../atoms/ProgressBar/ProgressBar';

const CardFooter = ({
  children,
  chip = '',
  progress = null,
  className = '',
  style = {},
  ...rest
}) => {
  return (
    <div className={[styles.cardFooter, className].join(' ').trim()} style={style} {...rest}>
      {chip && <Chip className={styles.chip}>{chip}</Chip>}
      {progress !== null && <ProgressBar value={progress} className={styles.progress} />}
      <CardActions className={styles.actions}>{children}</CardActions>
    </div>
  );
};

export default CardFooter; 