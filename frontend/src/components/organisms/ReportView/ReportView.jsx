import React, { useEffect } from 'react';
import styles from './ReportView.module.css';
import ReportSection from '../../molecules/ReportSection/ReportSection';
import DateRangeSelector from '../../molecules/DateRangeSelector/DateRangeSelector';
import Alert from '../../atoms/Alert/Alert';
import { useReportData } from './useReportData';
import PatientReportSection from './PatientReportSection';
import AppointmentReportSection from './AppointmentReportSection';
import PaymentReportSection from './PaymentReportSection';
import SecretaryActivityReportSection from './SecretaryActivityReportSection';
import MedicalHistoryReportSection from './MedicalHistoryReportSection';

const ReportView = () => {
  // Usar el custom hook para manejar estado y fetching
  const {
    currentDateRange,
    setCurrentDateRange,
    reportData,
    fetchDataForSection
  } = useReportData();

  // Fetch de datos cuando cambia el rango de fechas
  useEffect(() => {
    if (currentDateRange) {
      Object.keys(reportData).forEach(sectionKey => {
        if (reportData[sectionKey]) {
          const isSectionAvailable = reportData[sectionKey].available;
          fetchDataForSection(sectionKey, currentDateRange, isSectionAvailable);
        }
      });
    }
  }, [currentDateRange, fetchDataForSection]);

  return (
    <div className={styles.reportViewContainer}>
      <div className={styles.controlsHeader}>
        <DateRangeSelector onRangeChange={setCurrentDateRange} initialRange="thisMonth" />
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
          <PatientReportSection section={reportData.patients} />
        </ReportSection>

        <ReportSection
          title="Citas"
          isLoading={reportData.appointments.loading}
          error={reportData.appointments.error}
          isEmpty={!reportData.appointments.data && reportData.appointments.available && !reportData.appointments.loading && !reportData.appointments.error}
          emptyMessage={!reportData.appointments.available ? "Reportes de citas no disponibles actualmente." : "No hay datos de citas para el período seleccionado."}
        >
          <AppointmentReportSection section={reportData.appointments} />
        </ReportSection>

        <ReportSection
          title="Pagos"
          isLoading={reportData.payments.loading}
          error={reportData.payments.error}
          isEmpty={!reportData.payments.data && reportData.payments.available && !reportData.payments.loading && !reportData.payments.error}
          emptyMessage={!reportData.payments.available ? "Reportes de pagos no disponibles actualmente." : "No hay datos de pagos para el período seleccionado."}
        >
          <PaymentReportSection section={reportData.payments} />
        </ReportSection>

        <ReportSection
          title="Actividad de Secretarias"
          isLoading={reportData.secretaryActivity.loading}
          error={reportData.secretaryActivity.error}
          isEmpty={!reportData.secretaryActivity.data && reportData.secretaryActivity.available && !reportData.secretaryActivity.loading && !reportData.secretaryActivity.error}
          emptyMessage={!reportData.secretaryActivity.available ? "Reportes de actividad de secretarias no disponibles." : "No hay datos de actividad para el período seleccionado."}
        >
          <SecretaryActivityReportSection section={reportData.secretaryActivity} />
        </ReportSection>

        <ReportSection
          title="Historias Clínicas"
          isLoading={reportData.medicalHistory.loading}
          error={reportData.medicalHistory.error}
          isEmpty={!reportData.medicalHistory.data && reportData.medicalHistory.available && !reportData.medicalHistory.loading && !reportData.medicalHistory.error}
          emptyMessage={!reportData.medicalHistory.available ? "Reportes de historias clínicas no disponibles actualmente." : "No hay datos de historias para el período seleccionado."}
        >
          <MedicalHistoryReportSection section={reportData.medicalHistory} />
        </ReportSection>
      </div>
    </div>
  );
};

export default ReportView;
