// App.js
import React, { useEffect } from 'react';
import MyCalendar from './components/CalendarComponent';
import StatsPageComponent from './components/StatsPageComponent';
import DayViewComponent from './components/DayViewComponent';
import DataManagerComponent from './components/DataManagerComponent';
import SimplePatientsComponent from './components/SimplePatientsComponent';
import ConfigurationComponent from './components/ConfigurationComponent';
import HealthInsuranceComponent from './components/HealthInsuranceComponent';
import AppHeader from './components/AppHeader';
import AppAside from './components/AppAside';
import Modal from 'react-modal';
import './styles/main.css';
import { useAppData } from './hooks/useAppData';
import { useNavigation } from './hooks/useNavigation';

// Configurar el elemento raíz para el modal
Modal.setAppElement('#root');

const App = () => {
  const {
    citas,
    serverStatus,
    getProximaCita,
    getPacientesAsistenciaTardia,
    handleDataChange
  } = useAppData();

  const {
    currentPage,
    selectedDate,
    debugInfo,
    handleDayClick,
    handleBackToMonth,
    handleNavigateToPatients,
    handleAgendarCita,
    navigateTo
  } = useNavigation();

  useEffect(() => {
    // Cargar tema desde localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const handleCitaClick = (cita) => {
    console.log('Cita clickeada:', cita);
  };

  const renderCurrentPage = () => {
    const debugMsg = `Renderizando página: ${currentPage} - ${new Date().toLocaleTimeString()}`;
    console.log('App:', debugMsg);
    
    switch (currentPage) {
      case 'stats':
        return <StatsPageComponent citas={citas} />;
      case 'patients':
        console.log('App: Renderizando SimplePatientsComponent con', citas.length, 'citas');
        return (
          <div>
            <div style={{ 
              background: '#f8f9fa', 
              padding: '10px', 
              marginBottom: '20px', 
              borderRadius: '8px',
              fontSize: '12px',
              color: '#666'
            }}>
              Debug: {debugInfo} | Página actual: {currentPage} | Citas: {citas.length}
            </div>
            <SimplePatientsComponent citas={citas} />
          </div>
        );
      case 'configuration':
        return <ConfigurationComponent />;
      case 'healthInsurance':
        return <HealthInsuranceComponent />;
      case 'data':
        return <DataManagerComponent onDataChange={handleDataChange} />;
      case 'day':
        return (
          <div className="d-flex flex-column">
            <div className="d-flex justify-between align-center mb-3">
              <button 
                onClick={handleBackToMonth}
                className="btn btn-primary"
              >
                ← Volver al Calendario
              </button>
              <h2 className="text-primary font-bold">
                Vista Detallada del Día
              </h2>
            </div>
            <DayViewComponent 
              citas={citas} 
              selectedDate={selectedDate}
              onCitaClick={handleCitaClick}
            />
          </div>
        );
      default:
        return (
  <div>
            <MyCalendar 
              onCitasChange={handleDataChange} 
              onDayClick={handleDayClick}
            />
          </div>
        );
    }
  };

  const proximaCita = getProximaCita();
  const pacientesTardia = getPacientesAsistenciaTardia();

  return (
    <div className="app-container">
      <AppHeader 
        pacientesTardia={pacientesTardia}
        serverStatus={serverStatus}
        onNavigateToPatients={handleNavigateToPatients}
        onAgendarCita={handleAgendarCita}
      />

      {/* Layout principal con aside y contenido */}
      <div className="d-flex min-h-100vh">
        <AppAside 
          citas={citas}
          proximaCita={proximaCita}
          onNavigateToPatients={handleNavigateToPatients}
          onNavigateToCalendar={() => navigateTo('calendar')}
          onNavigateToStats={() => navigateTo('stats')}
          onNavigateToData={() => navigateTo('data')}
        />

        {/* Contenido principal */}
        <main className="app-main">
          {renderCurrentPage()}
        </main>
      </div>
  </div>
);
};

export default App;