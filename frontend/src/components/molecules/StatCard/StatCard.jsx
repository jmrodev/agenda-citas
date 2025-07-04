import React from 'react';
import styles from './StatCard.module.css';
import DoctorSelector from '../DoctorSelector/DoctorSelector';

const StatCard = ({ doctor, doctors, value, icon, color, selected, onDoctorChange }) => {
  const [showSelector, setShowSelector] = React.useState(false);

  const handleCardClick = () => {
    setShowSelector(true);
  };

  const handleDoctorSelect = (doctorId) => {
    onDoctorChange(doctorId);
    setShowSelector(false);
  };

  return (
    <div
      className={styles.card + (selected ? ' ' + styles.selected : '')}
      style={{ borderColor: color, cursor: 'pointer' }}
      onClick={handleCardClick}
    >
      {icon && <div className={styles.icon} style={{ color }}>{icon}</div>}
      <h2 className={styles.title}>{doctor.name}</h2>
      <p className={styles.value}>{value}</p>
      {showSelector && (
        <DoctorSelector
          doctors={doctors}
          selectedDoctor={doctor}
          onSelect={handleDoctorSelect}
          onClose={() => setShowSelector(false)}
        />
      )}
    </div>
  );
};

export default StatCard; 