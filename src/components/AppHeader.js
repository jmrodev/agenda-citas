import React from 'react';

const AppHeader = ({ 
  pacientesTardia, 
  serverStatus, 
  onNavigateToPatients, 
  onAgendarCita 
}) => {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="d-flex align-center justify-between w-100">
          <div className="d-flex align-center gap-3">
            <div>
              <h1 className="app-title">
                <span className="calendar-icon">👥</span>
                Sistema de Gestión
              </h1>
              <p className="app-subtitle">
                Gestiona citas y pacientes de manera profesional
              </p>
            </div>
            
            {/* Botón Agendar Cita */}
            <button 
              className="btn btn-primary btn-lg"
              onClick={onAgendarCita}
            >
              📅 Agendar Cita
            </button>
          </div>
          
          <div className="d-flex align-center gap-3">
            {/* Asistencia Tardía en Header */}
            <div className="header-alerts">
              {pacientesTardia.length > 0 && (
                <div className="alert-item">
                  <span className="alert-icon">⚠️</span>
                  <span className="alert-text">
                    {pacientesTardia.length} paciente{pacientesTardia.length > 1 ? 's' : ''} con asistencia tardía
                  </span>
                  <button 
                    className="btn btn-sm btn-warning"
                    onClick={onNavigateToPatients}
                  >
                    Ver
                  </button>
                </div>
              )}
            </div>
            
            {/* Estado del servidor */}
            <div className="d-flex align-center gap-2 font-xs text-muted">
              <span>Servidor:</span>
              <span className={`p-1 rounded-sm font-normal ${
                serverStatus === 'connected' ? 'bg-success text-inverse' : 
                serverStatus === 'checking' ? 'bg-warning text-inverse' : 'bg-error text-inverse'
              }`}>
                {serverStatus === 'connected' ? '🟢 Conectado' : 
                 serverStatus === 'checking' ? '🟡 Verificando...' : '🔴 Desconectado'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader; 