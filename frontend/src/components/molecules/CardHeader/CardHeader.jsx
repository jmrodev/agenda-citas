import React from 'react';
import styles from './CardHeader.module.css';
import CardImage from '../../atoms/CardImage/CardImage';
import Text from '../../atoms/Text/Text'; // Updated import
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
          {/* Using Text atom for title, assuming h3 equivalent for CardTitle */}
          <Text as="h3" size="lg" weight="bold" className={styles.title}>
            {title}
          </Text>
          {badge && <Badge className={styles.badge}>{badge}</Badge>}
        </div>
        {/* Using Text atom for subtitle, assuming h4 equivalent for CardSubtitle */}
        {subtitle && (
          <Text as="h4" size="md" weight="medium" color="secondary" className={styles.subtitle}>
            {subtitle}
          </Text>
        )}
      </div>
    </div>
  );
};

export default CardHeader; 