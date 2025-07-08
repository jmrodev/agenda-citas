import React from 'react';
import PropTypes from 'prop-types';
import styles from './ReportDataCard.module.css';
import CardBase from '../../atoms/CardBase/CardBase';
import Text from '../../atoms/Text/Text';
import Icon from '../../atoms/Icon/Icon'; // Asumiendo que Icon es un átomo genérico para iconos

const ReportDataCard = ({ title, value, icon, unit, trend, trendDirection = 'neutral', cardStyle }) => {
  const trendIcon = () => {
    if (trendDirection === 'up') return 'arrow_upward';
    if (trendDirection === 'down') return 'arrow_downward';
    return null; // O un icono neutral como 'trending_flat'
  };

  return (
    <CardBase className={`${styles.reportDataCard} ${cardStyle ? styles[cardStyle] : ''}`}>
      {icon && <div className={styles.iconWrapper}>{typeof icon === 'string' ? <Icon name={icon} /> : icon}</div>}
      <div className={styles.textContainer}>
        <Text type="label" className={styles.title}>{title}</Text>
        <Text type="display" className={styles.value}>
          {value}
          {unit && <span className={styles.unit}>{unit}</span>}
        </Text>
        {trend && (
          <div className={`${styles.trendInfo} ${styles[trendDirection]}`}>
            {trendIcon() && <Icon name={trendIcon()} size="small" />}
            <Text type="caption" className={styles.trendText}>{trend}</Text>
          </div>
        )}
      </div>
    </CardBase>
  );
};

ReportDataCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]), // Nombre del icono o el nodo del icono
  unit: PropTypes.string,
  trend: PropTypes.string, // Ej: "+5% vs mes anterior"
  trendDirection: PropTypes.oneOf(['up', 'down', 'neutral']),
  cardStyle: PropTypes.string, // Para estilos predefinidos (ej. 'primary', 'warning')
};

export default ReportDataCard;
