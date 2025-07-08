import React from 'react';
import PropTypes from 'prop-types';
import styles from './ReportSection.module.css';
import CardBase from '../../atoms/CardBase/CardBase';
import Title from '../../atoms/Title/Title'; // Asumiendo que Title es un átomo para títulos de sección

const ReportSection = ({ title, children, isLoading, error, isEmpty, emptyMessage = "No hay datos para mostrar en esta sección." }) => {
  return (
    <CardBase className={styles.reportSectionCard}>
      <header className={styles.header}>
        <Title level={3} className={styles.title}>{title}</Title>
      </header>
      <div className={styles.content}>
        {isLoading && <p className={styles.loading}>Cargando datos de la sección...</p>}
        {error && <p className={styles.error}>Error al cargar: {error.message || error}</p>}
        {!isLoading && !error && isEmpty && <p className={styles.emptyMessage}>{emptyMessage}</p>}
        {!isLoading && !error && !isEmpty && children}
      </div>
    </CardBase>
  );
};

ReportSection.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  isLoading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  isEmpty: PropTypes.bool,
  emptyMessage: PropTypes.string,
};

export default ReportSection;
