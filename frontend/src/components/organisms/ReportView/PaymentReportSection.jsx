import React from 'react';
import styles from './ReportView.module.css';
import ReportDataCard from '../../molecules/ReportDataCard/ReportDataCard';
import Loader from '../../atoms/Loader/Loader';
import ResponsiveLineChart from '../../atoms/charts/ResponsiveLineChart';
import ResponsivePieChart from '../../atoms/charts/ResponsivePieChart';

const PaymentReportSection = ({ section }) => {
  if (!section.available) return null;
  if (section.loading && !section.data) return <Loader text="Cargando pagos..." />;
  if (section.error && !section.data) return null;
  if (!section.data && !section.loading && !section.error) return null;

  const data = section.data || {};
  // Asumiendo estructura: { summary: { totalRevenueInPeriod, averagePaymentAmount, pendingAmount }, byMethod, byStatus, revenueOverTime }

  return (
    <>
      <div className={styles.sectionContentGrid}>
        <ReportDataCard title="Ingresos Totales (período)" value={data.summary?.totalRevenueInPeriod ? `$${data.summary.totalRevenueInPeriod.toLocaleString()}` : 'N/A'} icon="attach_money" cardStyle="success" />
        <ReportDataCard title="Monto Promedio Pago" value={data.summary?.averagePaymentAmount ? `$${data.summary.averagePaymentAmount.toLocaleString()}` : 'N/A'} icon="receipt_long" />
        <ReportDataCard title="Monto Pendiente" value={data.summary?.pendingAmount ? `$${data.summary.pendingAmount.toLocaleString()}` : 'N/A'} icon="hourglass_empty" cardStyle="warning"/>
      </div>
      <div className={styles.chartsGrid}>
        {data.revenueOverTime && data.revenueOverTime.length > 0 && (
           <div className={styles.chartContainer}>
             <h4>Ingresos en el Tiempo</h4>
             <ResponsiveLineChart
              data={data.revenueOverTime}
              lines={[{ dataKey: 'total_amount', name: 'Ingresos'}]}
              xAxisKey="date"
              yAxisLabel="Monto ($)"
            />
           </div>
         )}
         {data.byMethod && Object.keys(data.byMethod).length > 0 && (
          <div className={styles.chartContainer}>
            <h4>Ingresos por Método de Pago</h4>
            <ResponsivePieChart
              data={Object.entries(data.byMethod).map(([name, value]) => ({ name, value }))}
              dataKey="value"
              nameKey="name"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default PaymentReportSection; 