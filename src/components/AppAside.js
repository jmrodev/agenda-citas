import React from 'react';

const AppAside = ({ 
  citas, 
  proximaCita, 
  onNavigateToPatients, 
  onNavigateToCalendar, 
  onNavigateToStats, 
  onNavigateToData 
}) => {
  return (
    <aside className="app-aside">
      <div className="aside-content">
        {/* Acciones Rápidas - Sección superior */}
        <div className="aside-section">
          <h3 className="aside-title">⚡ Acciones Rápidas</h3>
          <div className="aside-actions">
            <button 
              className="btn btn-primary w-100 mb-2"
              onClick={onNavigateToCalendar}
            >
              📅 Ver Calendario
            </button>
            <button 
              className="btn btn-secondary w-100 mb-2"
              onClick={onNavigateToStats}
            >
              📊 Ver Estadísticas
            </button>
            <button 
              className="btn btn-secondary w-100 mb-2"
              onClick={onNavigateToData}
            >
              💾 Gestionar Datos
            </button>
            {/* Sección de Pacientes dentro de Acciones Rápidas */}
            <div className="actions-divider">
              <span className="divider-text">👥 Pacientes</span>
            </div>
            <button 
              className="btn btn-primary w-100 mb-2"
              onClick={onNavigateToPatients}
            >
              Ver Todos los Pacientes
            </button>
            <button 
              className="btn btn-secondary w-100"
              onClick={onNavigateToPatients}
            >
              Agregar Nuevo Paciente
            </button>
          </div>
        </div>

        {/* Próxima Cita */}
        <div className="aside-section">
          <h3 className="aside-title">⏰ Próxima Cita</h3>
          {proximaCita ? (
            <div className="proxima-cita">
              <div className="cita-info">
                <h4 className="cita-titulo">{proximaCita.title}</h4>
                <p className="cita-fecha">
                  {new Date(proximaCita.start).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <button 
                className="btn btn-primary w-100 mt-2"
                onClick={onNavigateToCalendar}
              >
                Ver en Calendario
              </button>
            </div>
          ) : (
            <div className="no-citas">
              <p className="text-muted text-center">No hay citas programadas</p>
              <button 
                className="btn btn-secondary w-100 mt-2"
                onClick={onNavigateToCalendar}
              >
                Programar Cita
              </button>
            </div>
          )}
        </div>

        {/* Información */}
        <div className="aside-section">
          <h3 className="aside-title">📊 Información</h3>
          <div className="aside-info">
            <div className="info-item">
              <span className="info-label">Total Citas:</span>
              <span className="info-value">{citas.length}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Hoy:</span>
              <span className="info-value">
                {citas.filter(cita => {
                  const today = new Date();
                  const citaDate = new Date(cita.start);
                  return citaDate.toDateString() === today.toDateString();
                }).length}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Esta Semana:</span>
              <span className="info-value">
                {citas.filter(cita => {
                  const today = new Date();
                  const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
                  const weekEnd = new Date(weekStart);
                  weekEnd.setDate(weekEnd.getDate() + 6);
                  const citaDate = new Date(cita.start);
                  return citaDate >= weekStart && citaDate <= weekEnd;
                }).length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AppAside; 