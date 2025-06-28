import { useState } from 'react';

export const useNavigation = () => {
  const [currentPage, setCurrentPage] = useState('calendar');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [debugInfo, setDebugInfo] = useState('');

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setCurrentPage('day');
  };

  const handleBackToMonth = () => {
    setCurrentPage('calendar');
  };

  const handleNavigateToPatients = () => {
    const debugMsg = `Navegando a pacientes desde: ${currentPage} - ${new Date().toLocaleTimeString()}`;
    console.log('App:', debugMsg);
    setDebugInfo(debugMsg);
    setCurrentPage('patients');
  };

  const handleAgendarCita = () => {
    setSelectedDate(new Date());
    setCurrentPage('day');
  };

  const navigateTo = (page) => {
    console.log('Navegando a:', page);
    setCurrentPage(page);
  };

  return {
    currentPage,
    selectedDate,
    debugInfo,
    handleDayClick,
    handleBackToMonth,
    handleNavigateToPatients,
    handleAgendarCita,
    navigateTo
  };
}; 