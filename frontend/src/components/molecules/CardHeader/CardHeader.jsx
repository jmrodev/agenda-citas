import React from 'react';
import styles from './CardHeader.module.css';
import CardImage from '../../atoms/CardImage/CardImage';
import CardTitle from '../../atoms/CardTitle/CardTitle';
import CardSubtitle from '../../atoms/CardSubtitle/CardSubtitle';
import Badge from '../../atoms/Badge/Badge';

const CardHeader = ({
  imageSrc,
  imageAlt = '',
  title,
  subtitle = '',
  badge = '',
  icon = null,
  className = '',
  style = {},
  ...rest
}) => {
  return (
    <div className={[styles.cardHeader, className].join(' ').trim()} style={style} {...rest}>
      {imageSrc && <CardImage src={imageSrc} alt={imageAlt} className={styles.image} />}
      <div className={styles.headerContent}>
        <div className={styles.titleRow}>
          {icon && <span className={styles.icon}>{icon}</span>}
          <CardTitle className={styles.title}>{title}</CardTitle>
          {badge && <Badge className={styles.badge}>{badge}</Badge>}
        </div>
        {subtitle && <CardSubtitle className={styles.subtitle}>{subtitle}</CardSubtitle>}
      </div>
    </div>
  );
};

export default CardHeader; 