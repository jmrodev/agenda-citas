import React from 'react';
import styles from './ReportView.module.css';
import ReportDataCard from '../../molecules/ReportDataCard/ReportDataCard';
import Loader from '../../atoms/Loader/Loader';
import ResponsiveBarChart from '../../atoms/charts/ResponsiveBarChart';
import ResponsivePieChart from '../../atoms/charts/ResponsivePieChart';

const SecretaryActivityReportSection = ({ section }) => {
  if (!section.available) return null;
  if (section.loading && !section.data) return <Loader text="Cargando actividad..." />;
  if (section.error && !section.data) return null;
  if (!section.data && !section.loading && !section.error) return null;

  const data = section.data || {};
  // Asumiendo estructura: { summary: { totalActivitiesInPeriod }, activitiesByType, activitiesBySecretary, activityCountOverTime }
  return (
     <>
      <div className={styles.sectionContentGrid}>
        <ReportDataCard title="Total Acciones (período)" value={data.summary?.totalActivitiesInPeriod ?? 'N/A'} icon="work_history" cardStyle="primary" />
      </div>
      <div className={styles.chartsGrid}>
        {data.activitiesBySecretary && data.activitiesBySecretary.length > 0 && (
           <div className={styles.chartContainer}>
             <h4>Actividad por Secretaria</h4>
             <ResponsiveBarChart
              data={data.activitiesBySecretary}
              bars={[{ dataKey: 'total_actions', name: 'Nº Acciones' }]}
              xAxisKey="secretaryName"
              layout="vertical"
              yAxisLabel="Secretaria"
            />
           </div>
         )}
         {data.activitiesByType && Object.keys(data.activitiesByType).length > 0 && (
          <div className={styles.chartContainer}>
            <h4>Distribución por Tipo de Actividad</h4>
            <ResponsivePieChart
              data={Object.entries(data.activitiesByType).map(([name, value]) => ({ name, value }))}
              dataKey="value"
              nameKey="name"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default SecretaryActivityReportSection; 