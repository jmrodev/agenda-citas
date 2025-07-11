import React from 'react';
import styles from './CardHeader.module.css';
import CardImage from '../../atoms/CardImage/CardImage';
import Text from '../../atoms/Text/Text'; // Updated import
import Badge from '../../atoms/Badge/Badge';

/**
 * CardHeader is a molecule that forms the header section of a Card component.
 * It can display an image, title, subtitle, icon, and a badge.
 *
 * @param {object} props - The component's props.
 * @param {string} [props.imageSrc] - URL for the header image.
 * @param {string} [props.imageAlt=''] - Alt text for the header image.
 * @param {string} props.title - The main title for the card header.
 * @param {string} [props.subtitle=''] - Subtitle text displayed below the title.
 * @param {string} [props.badge=''] - Text content for a Badge component displayed next to the title.
 * @param {React.ReactNode} [props.icon=null] - An icon element (e.g., <Icon />) to display before the title.
 * @param {string} [props.className=''] - Additional CSS classes to apply to the CardHeader's root div.
 * @param {object} [props.style={}] - Inline styles to apply to the CardHeader's root div.
 * @param {object} [props.rest] - Any other props will be spread onto the CardHeader's root div.
 * @returns {JSX.Element} The rendered card header component.
 */
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