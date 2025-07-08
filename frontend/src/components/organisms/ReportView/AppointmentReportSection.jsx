import React from 'react';
import styles from './ReportView.module.css';
import ReportDataCard from '../../molecules/ReportDataCard/ReportDataCard';
import Loader from '../../atoms/Loader/Loader';
import ResponsiveLineChart from '../../atoms/charts/ResponsiveLineChart';
import ResponsiveBarChart from '../../atoms/charts/ResponsiveBarChart';
import ResponsivePieChart from '../../atoms/charts/ResponsivePieChart';

const AppointmentReportSection = ({ section }) => {
  if (!section.available) return null;
  if (section.loading && !section.data) return <Loader text="Cargando citas..." />;
  if (section.error && !section.data) return null;
  if (!section.data && !section.loading && !section.error) return null;

  const data = section.data || {};

  return (
    <>
      <div className={styles.sectionContentGrid}>
        <ReportDataCard title="Total Citas (período)" value={data.summary?.totalAppointmentsInPeriod ?? 'N/A'} icon="event" cardStyle="primary" />
        <ReportDataCard title="Tasa de Cancelación" value={data.rates?.cancellationRate ? `${data.rates.cancellationRate.toFixed(1)}%` : 'N/A'} icon="event_busy" cardStyle="warning"/>
        <ReportDataCard title="Tasa de Ausentismo" value={data.rates?.noShowRate ? `${data.rates.noShowRate.toFixed(1)}%` : 'N/A'} icon="person_off" cardStyle="error"/>
      </div>
      <div className={styles.chartsGrid}>
        {data.byStatus && Object.keys(data.byStatus).length > 0 && (
          <div className={styles.chartContainer}>
            <h4>Citas por Estado</h4>
            <ResponsivePieChart
              data={Object.entries(data.byStatus).map(([name, value]) => ({ name, value }))}
              dataKey="value"
              nameKey="name"
            />
          </div>
        )}
        {data.byTimePeriod && data.byTimePeriod.length > 0 && (
          <div className={styles.chartContainer}>
            <h4>Citas por Día/Semana</h4>
            <ResponsiveLineChart
              data={data.byTimePeriod}
              lines={[{ dataKey: 'count', name: 'Nº Citas'}]}
              xAxisKey="date"
              yAxisLabel="Cantidad"
            />
          </div>
        )}
        {data.byDoctor && data.byDoctor.length > 0 && (
          <div className={styles.chartContainer}>
            <h4>Citas por Médico</h4>
            <ResponsiveBarChart
              data={data.byDoctor}
              bars={[{ dataKey: 'count', name: 'Nº Citas' }]}
              xAxisKey="doctorName"
              layout="vertical"
              yAxisLabel="Médico"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default AppointmentReportSection; 