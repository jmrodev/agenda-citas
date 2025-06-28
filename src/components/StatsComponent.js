import React from 'react';
import moment from 'moment';

const StatsComponent = ({ citas }) => {
  const obtenerEstadisticas = () => {
    const hoy = moment();
    const citasHoy = citas.filter(cita => 
      moment(cita.start).isSame(hoy, 'day')
    );
    
    const citasEstaSemana = citas.filter(cita => 
      moment(cita.start).isSame(hoy, 'week')
    );
    
    const citasEsteMes = citas.filter(cita => 
      moment(cita.start).isSame(hoy, 'month')
    );
    
    const proximaCita = citas
      .filter(cita => moment(cita.start).isAfter(hoy))
      .sort((a, b) => moment(a.start) - moment(b.start))[0];
    
    return {
      total: citas.length,
      hoy: citasHoy.length,
      estaSemana: citasEstaSemana.length,
      esteMes: citasEsteMes.length,
      proximaCita
    };
  };

  const stats = obtenerEstadisticas();

  return (
    <div className="stats-container" style={{
      background: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      marginBottom: '1rem',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    }}>
      <h3 style={{
        margin: '0 0 1rem 0',
        color: '#2c3e50',
        fontSize: '1.2rem',
        fontWeight: '600',
        textAlign: 'center'
      }}>
        📊 Estadísticas de Citas
      </h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '1rem'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '1rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '8px',
          color: 'white'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.total}</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Total</div>
        </div>
        
        <div style={{
          textAlign: 'center',
          padding: '1rem',
          background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
          borderRadius: '8px',
          color: 'white'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.hoy}</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Hoy</div>
        </div>
        
        <div style={{
          textAlign: 'center',
          padding: '1rem',
          background: 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)',
          borderRadius: '8px',
          color: 'white'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.estaSemana}</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Esta Semana</div>
        </div>
        
        <div style={{
          textAlign: 'center',
          padding: '1rem',
          background: 'linear-gradient(135deg, #dc3545 0%, #e83e8c 100%)',
          borderRadius: '8px',
          color: 'white'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.esteMes}</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Este Mes</div>
        </div>
      </div>
      
      {stats.proximaCita && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          background: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50', fontSize: '1rem' }}>
            🕐 Próxima Cita
          </h4>
          <div style={{ fontSize: '0.9rem', color: '#495057' }}>
            <strong>{stats.proximaCita.title}</strong>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>
            {moment(stats.proximaCita.start).format('DD/MM/YYYY HH:mm')}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsComponent; 