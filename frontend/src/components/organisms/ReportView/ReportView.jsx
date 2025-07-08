import React, { useState, useEffect, useCallback } from 'react';
import styles from './ReportView.module.css';
import ReportSection from '../../molecules/ReportSection/ReportSection';
import ReportDataCard from '../../molecules/ReportDataCard/ReportDataCard';
import DateRangeSelector from '../../molecules/DateRangeSelector/DateRangeSelector';
import { authFetch } from '../../../auth/authFetch'; // Para llamadas API
// Importar átomos necesarios como Loader, Alert, etc. si es preciso.
import Loader from '../../atoms/Loader/Loader';
import Alert from '../../atoms/Alert/Alert';
import ResponsiveLineChart from '../../atoms/charts/ResponsiveLineChart';
import ResponsiveBarChart from '../../atoms/charts/ResponsiveBarChart';
import ResponsivePieChart from '../../atoms/charts/ResponsivePieChart';

// Mock de datos y funciones de fetching, se reemplazarán con llamadas reales.
// Estos endpoints son ejemplos y deberán ser creados en el backend.
const API_ENDPOINTS = {
  patients: '/api/reports/patients-summary',
  appointments: '/api/reports/appointments-summary',
  payments: '/api/reports/payments-summary',
  secretaryActivity: '/api/reports/secretary-activity-summary',
  medicalHistory: '/api/reports/medical-history-stats',
};

const ReportView = () => {
  const [currentDateRange, setCurrentDateRange] = useState(null);
  const [reportData, setReportData] = useState({
    patients: { data: null, loading: true, error: null, available: true },
    appointments: { data: null, loading: true, error: null, available: true },
    payments: { data: null, loading: true, error: null, available: true },
    secretaryActivity: { data: null, loading: true, error: null, available: true }, // O false si no está implementado
    medicalHistory: { data: null, loading: true, error: null, available: false }, // Ejemplo: no disponible
  });

  const handleDateRangeChange = useCallback((range) => {
    setCurrentDateRange(range);
    // No es necesario llamar a fetchData aquí si useEffect ya depende de currentDateRange
  }, []);

  const fetchDataForSection = useCallback(async (sectionKey, range) => {
    if (!reportData[sectionKey]?.available || !range) {
      // Si la sección no está disponible o no hay rango, no hacer fetch.
      // Marcar como no cargando si no está disponible.
      if (!reportData[sectionKey]?.available) {
        setReportData(prev => ({ ...prev, [sectionKey]: { ...prev[sectionKey], loading: false } }));
      }
      return;
    }

  // Corrección: fetchDataForSection no debe depender de 'reportData' para ser estable.
  // Recibirá 'isSectionAvailable' como argumento.
  const fetchDataForSection = useCallback(async (sectionKey, range, isSectionAvailable) => {
    if (!isSectionAvailable || !range) {
      if (!isSectionAvailable) {
        // Solo actualiza si estaba cargando o tenía un error, para limpiar el estado.
        setReportData(prev => {
          if (prev[sectionKey]?.loading || prev[sectionKey]?.error) {
            return {
              ...prev,
              [sectionKey]: { ...prev[sectionKey], data: prev[sectionKey]?.data, loading: false, error: null }
            };
          }
          return prev; // No hay cambio si no estaba cargando/con error y no está disponible
        });
      }
      return;
    }

    setReportData(prev => ({
      ...prev,
      [sectionKey]: { ...prev[sectionKey], data: prev[sectionKey]?.data, error: null, loading: true } // Preservar datos existentes mientras carga
    }));
    try {
      const queryParams = `?startDate=${range.startDate}&endDate=${range.endDate}&rangeKey=${range.key}`;
      const response = await authFetch(`${API_ENDPOINTS[sectionKey]}${queryParams}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error en la respuesta del servidor' }));
        throw new Error(errorData.message || `Error HTTP ${response.status} al cargar datos de ${sectionKey}`);
      }
      const data = await response.json();
      setReportData(prev => ({
        ...prev,
        [sectionKey]: { ...prev[sectionKey], data, loading: false }
      }));
    } catch (error) {
      console.error(`Error fetching ${sectionKey}:`, error);
      setReportData(prev => ({
        ...prev,
        [sectionKey]: { ...prev[sectionKey], error: error.message, loading: false }
      }));
    }
  }, []); // Dependencias vacías para que la función sea estable

  useEffect(() => {
    if (currentDateRange) {
      // Iterar sobre una lista constante de keys (API_ENDPOINTS) es más seguro.
      Object.keys(API_ENDPOINTS).forEach(sectionKey => {
        if (reportData[sectionKey]) { // Asegurarse que la sección existe en el estado reportData
            const isSectionAvailable = reportData[sectionKey].available;
            fetchDataForSection(sectionKey, currentDateRange, isSectionAvailable);
        }
      });
    }
    // fetchDataForSection es estable. El useEffect se disparará si currentDateRange cambia.
    // O si el propio reportData cambia (para re-evaluar isSectionAvailable), PERO esto es lo que queremos evitar
    // para el bucle. La lectura de isSectionAvailable aquí es del estado actual.
    // La clave es que fetchDataForSection NO cause un cambio en sí mismo que reinicie el ciclo.
    // Si available NUNCA cambia después de la inicialización, no necesitamos reportData en las deps.
  }, [currentDateRange, fetchDataForSection]); // Eliminamos reportData de las dependencias del useEffect.

  // Renderizado de ejemplo para una sección. Se necesitarán más detalles para cada una.
  const renderPatientSectionContent = (section) => {
    if (!section.available) return null; // Ya manejado por ReportSection con emptyMessage
    if (section.loading && !section.data) return <Loader text="Cargando pacientes..." />; // Mostrar loader solo si no hay datos previos
    if (section.error && !section.data) return null; // Ya manejado por ReportSection
    if (!section.data && !section.loading && !section.error) return null; // No data y no loading/error, ya manejado por ReportSection isEmpty

    // Usando la estructura de datos definida para pacientes
    const { summary, byTimePeriod, byAgeGroup } = section.data || {};

    return (
      <>
        <div className={styles.sectionContentGrid}>
          <ReportDataCard
            title="Pacientes Activos Totales"
            value={summary?.totalActivePatients ?? 'N/A'}
            icon="groups" // Icono para grupo de personas
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
            icon="cake" // Icono de pastel para edad
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
                layout="horizontal" // Barras verticales
              />
              {/* Alternativa con Pie Chart:
              <ResponsivePieChart
                data={byAgeGroup}
                dataKey="count"
                nameKey="ageGroup"
              />
              */}
            </div>
          )}
        </div>
      </>
    );
  };

  const renderAppointmentSectionContent = (section) => {
    if (!section.available) return null;
    if (section.loading && !section.data) return <Loader text="Cargando citas..." />;
    if (section.error && !section.data) return null;
    if (!section.data && !section.loading && !section.error) return null;

    // Asumiendo estructura de datos para citas:
    // const { summary, byStatus, byDoctor, byType, byTimePeriod, rates } = section.data || {};
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
                // data.byStatus podría ser { confirmed: 10, cancelled: 5 }
                // Necesita ser [{ name: 'confirmed', value: 10 }, { name: 'cancelled', value: 5 }]
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
                data={data.byTimePeriod} // Asume [{ date: 'YYYY-MM-DD', count: N }]
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
                data={data.byDoctor} // Asume [{ doctorName: 'Dr. X', count: N }]
                bars={[{ dataKey: 'count', name: 'Nº Citas' }]}
                xAxisKey="doctorName"
                layout="vertical" // Barras horizontales para nombres largos de doctores
                yAxisLabel="Médico"
              />
            </div>
          )}
        </div>
        {/* Podríamos añadir más detalle o tablas si es necesario */}
      </>
    );
  };

  const renderPaymentSectionContent = (section) => {
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
                data={data.revenueOverTime} // Asume [{ date: 'YYYY-MM-DD', total_amount: N }]
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
                data={Object.entries(data.byMethod).map(([name, value]) => ({ name, value }))} // Asume byMethod es obj {Efectivo: 100, Tarjeta: 200}
                dataKey="value"
                nameKey="name"
              />
            </div>
          )}
        </div>
      </>
    );
  };

  const renderSecretaryActivitySectionContent = (section) => {
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
                data={data.activitiesBySecretary} // Asume [{ secretaryName: 'Ana', total_actions: N }]
                bars={[{ dataKey: 'total_actions', name: 'Nº Acciones' }]}
                xAxisKey="secretaryName"
                layout="vertical" // Barras horizontales para nombres
                yAxisLabel="Secretaria"
              />
             </div>
           )}
           {data.activitiesByType && Object.keys(data.activitiesByType).length > 0 && (
            <div className={styles.chartContainer}>
              <h4>Distribución por Tipo de Actividad</h4>
              <ResponsivePieChart
                data={Object.entries(data.activitiesByType).map(([name, value]) => ({ name, value }))} // Asume obj {typeA: 10, typeB: 20}
                dataKey="value"
                nameKey="name"
              />
            </div>
          )}
        </div>
      </>
    );
  };

  const renderMedicalHistorySectionContent = (section) => {
    // Esta sección está marcada como 'available: false' por ahora.
    // Cuando esté disponible, se implementará de forma similar.
    // Por ahora, el mensaje de "no disponible" de ReportSection se mostrará.
    if (!section.available) return null;
    if (section.loading && !section.data) return <Loader text="Cargando H.C..." />;
    if (section.error && !section.data) return null;
    if (!section.data && !section.loading && !section.error) return null;

    const data = section.data || {};
    // Asumiendo estructura: { summary: { newRecordsInPeriod, updatedRecordsInPeriod } }
     return (
      <div className={styles.sectionContentGrid}>
          <ReportDataCard title="Nuevos Registros HC (período)" value={data.summary?.newRecordsInPeriod ?? 'N/A'} icon="note_add" />
          <ReportDataCard title="Registros HC Actualizados (período)" value={data.summary?.updatedRecordsInPeriod ?? 'N/A'} icon="history_edu" />
        </div>
     );
  };

  return (
    <div className={styles.reportViewContainer}>
      <div className={styles.controlsHeader}>
        <DateRangeSelector onRangeChange={handleDateRangeChange} initialRange="thisMonth" />
        {/* Otros filtros globales podrían ir aquí */}
      </div>

      {currentDateRange && <Alert type="info" message={`Mostrando reportes para: ${currentDateRange.label}`} />}

      <div className={styles.sectionsGrid}>
        <ReportSection
          title="Pacientes"
          isLoading={reportData.patients.loading}
          error={reportData.patients.error}
          isEmpty={!reportData.patients.data && reportData.patients.available && !reportData.patients.loading && !reportData.patients.error}
          emptyMessage={!reportData.patients.available ? "Reportes de pacientes no disponibles actualmente." : "No hay datos de pacientes para el período seleccionado."}
        >
          {reportData.patients.data && renderPatientSectionContent(reportData.patients)}
        </ReportSection>

        <ReportSection
          title="Citas"
          isLoading={reportData.appointments.loading}
          error={reportData.appointments.error}
          isEmpty={!reportData.appointments.data && reportData.appointments.available && !reportData.appointments.loading && !reportData.appointments.error}
          emptyMessage={!reportData.appointments.available ? "Reportes de citas no disponibles actualmente." : "No hay datos de citas para el período seleccionado."}
        >
          {reportData.appointments.data && renderAppointmentSectionContent(reportData.appointments)}
        </ReportSection>

        <ReportSection
          title="Pagos"
          isLoading={reportData.payments.loading}
          error={reportData.payments.error}
          isEmpty={!reportData.payments.data && reportData.payments.available && !reportData.payments.loading && !reportData.payments.error}
          emptyMessage={!reportData.payments.available ? "Reportes de pagos no disponibles actualmente." : "No hay datos de pagos para el período seleccionado."}
        >
          {reportData.payments.data && renderPaymentSectionContent(reportData.payments)}
        </ReportSection>

        <ReportSection
          title="Actividad de Secretarias"
          isLoading={reportData.secretaryActivity.loading}
          error={reportData.secretaryActivity.error}
          isEmpty={!reportData.secretaryActivity.data && reportData.secretaryActivity.available && !reportData.secretaryActivity.loading && !reportData.secretaryActivity.error}
          emptyMessage={!reportData.secretaryActivity.available ? "Reportes de actividad de secretarias no disponibles." : "No hay datos de actividad para el período seleccionado."}
        >
          {reportData.secretaryActivity.data && renderSecretaryActivitySectionContent(reportData.secretaryActivity)}
        </ReportSection>

        <ReportSection
          title="Historias Clínicas"
          isLoading={reportData.medicalHistory.loading}
          error={reportData.medicalHistory.error}
          isEmpty={!reportData.medicalHistory.data && reportData.medicalHistory.available && !reportData.medicalHistory.loading && !reportData.medicalHistory.error}
          emptyMessage={!reportData.medicalHistory.available ? "Reportes de historias clínicas no disponibles actualmente." : "No hay datos de historias para el período seleccionado."}
        >
          {reportData.medicalHistory.data && renderMedicalHistorySectionContent(reportData.medicalHistory)}
        </ReportSection>
      </div>
    </div>
  );
};

export default ReportView;
