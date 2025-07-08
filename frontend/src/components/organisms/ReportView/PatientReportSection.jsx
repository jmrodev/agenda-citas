import React from 'react';
import styles from './ReportView.module.css';
import ReportDataCard from '../../molecules/ReportDataCard/ReportDataCard';
import Loader from '../../atoms/Loader/Loader';
import ResponsiveLineChart from '../../atoms/charts/ResponsiveLineChart';
import ResponsiveBarChart from '../../atoms/charts/ResponsiveBarChart';

const PatientReportSection = ({ section }) => {
  if (!section.available) return null;
  if (section.loading && !section.data) return <Loader text="Cargando pacientes..." />;
  if (section.error && !section.data) return null;
  if (!section.data && !section.loading && !section.error) return null;

  // Usando la estructura de datos definida para pacientes
  const { summary, byTimePeriod, byAgeGroup } = section.data || {};

  return (
    <>
      <div className={styles.sectionContentGrid}>
        <ReportDataCard
          title="Pacientes Activos Totales"
          value={summary?.totalActivePatients ?? 'N/A'}
          icon="groups"
          cardStyle="primary"
        />
        <ReportDataCard
          title="Nuevos Pacientes (período)"
          value={summary?.newPatientsInPeriod ?? 'N/A'}
          icon="person_add"
          trend={summary?.growthPercentage ? `${summary.growthPercentage >= 0 ? '+' : ''}${summary.growthPercentage}%` : ''}
          trendDirection={summary?.growthPercentage && summary.growthPercentage >= 0 ? 'up' : (summary?.growthPercentage < 0 ? 'down' : 'neutral')}
          cardStyle="success"
        />
        <ReportDataCard
          title="Edad Promedio"
          value={summary?.averageAge ? `${summary.averageAge} años` : 'N/A'}
          icon="cake"
        />
      </div>
      <div className={styles.chartsGrid}>
        {byTimePeriod && byTimePeriod.length > 0 && (
          <div className={styles.chartContainer}>
            <h4>Nuevos Pacientes por Período</h4>
            <ResponsiveLineChart
              data={byTimePeriod}
              lines={[{ dataKey: 'newPatients', name: 'Nuevos Pacientes' }]}
              xAxisKey="period"
              yAxisLabel="Cantidad"
            />
          </div>
        )}
        {byAgeGroup && byAgeGroup.length > 0 && (
          <div className={styles.chartContainer}>
            <h4>Distribución por Edad</h4>
            <ResponsiveBarChart
              data={byAgeGroup}
              bars={[{ dataKey: 'count', name: 'Cantidad' }]}
              xAxisKey="ageGroup"
              layout="horizontal"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default PatientReportSection; 