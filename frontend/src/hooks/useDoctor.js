import { useContext } from 'react';
import { DoctorContext } from '../components/context/DoctorContext';

export const useDoctor = () => useContext(DoctorContext); 