import React, { useEffect, useState } from 'react';
import { useDoctor } from '../../context/DoctorContext';
import { authFetch } from '../../utils/authFetch';

const DoctorSelect = () => {
  const { doctor, setDoctor } = useDoctor();
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      const res = await authFetch('/api/doctors');
      const data = await res.json();
      setDoctors(data);
      if (!doctor && data.length > 0) setDoctor(data[0]);
    };
    fetchDoctors();
    // eslint-disable-next-line
  }, []);

  return (
    <select
      value={doctor?.doctor_id || ''}
      onChange={e => {
        const selected = doctors.find(d => d.doctor_id === Number(e.target.value));
        setDoctor(selected);
      }}
      style={{ marginLeft: 16, minWidth: 120 }}
    >
      {doctors.map(d => (
        <option key={d.doctor_id} value={d.doctor_id}>
          Dr. {d.first_name} {d.last_name}
        </option>
      ))}
    </select>
  );
};

export default DoctorSelect; 