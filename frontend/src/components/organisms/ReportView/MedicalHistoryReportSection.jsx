import React from 'react';
import styles from './ReportView.module.css';
import ReportDataCard from '../../molecules/ReportDataCard/ReportDataCard';
import Loader from '../../atoms/Loader/Loader';

const MedicalHistoryReportSection = ({ section }) => {
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

export default MedicalHistoryReportSection; 