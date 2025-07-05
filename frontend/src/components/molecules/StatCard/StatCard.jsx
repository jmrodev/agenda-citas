import React from 'react';
import styles from './StatCard.module.css';
import DoctorSelector from '../DoctorSelector/DoctorSelector';

const StatCard = ({ doctor, doctors, value, icon, color, selected, onDoctorChange, title }) => {
  const [showSelector, setShowSelector] = React.useState(false);

  const handleCardClick = () => {
    if (doctor && onDoctorChange) {
      setShowSelector(true);
    }
  };

  const handleDoctorSelect = (doctorId) => {
    if (onDoctorChange) {
      onDoctorChange(doctorId);
      setShowSelector(false);
    }
  };

  const displayTitle = title || (doctor?.name || 'Sin título');

  return (
    <div
      className={styles.card + (selected ? ' ' + styles.selected : '')}
      style={{ borderColor: color, cursor: doctor && onDoctorChange ? 'pointer' : 'default' }}
      onClick={handleCardClick}
    >
      {icon && <div className={styles.icon} style={{ color }}>{icon}</div>}
      <h2 className={styles.title}>{displayTitle}</h2>
      <p className={styles.value}>{value}</p>
      {showSelector && doctor && doctors && (
        <DoctorSelector
          doctors={doctors.map(d => ({ ...d, name: d.name || `Dr. ${d.first_name} ${d.last_name}` }))}
          selectedDoctor={doctor}
          onSelect={handleDoctorSelect}
          onClose={() => setShowSelector(false)}
        />
      )}
    </div>
  );
};

export default StatCard; 