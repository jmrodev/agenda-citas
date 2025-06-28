import React, { useMemo } from 'react';
import moment from 'moment';

const StatsPageComponent = ({ citas = [] }) => {
  const stats = useMemo(() => {
    try {
      const hoy = moment();
      const citasValidas = citas.filter(cita => 
        cita && cita.start && moment(cita.start).isValid()
      );
      
      const citasHoy = citasValidas.filter(cita => 
        moment(cita.start).isSame(hoy, 'day')
      );
      
      const citasEstaSemana = citasValidas.filter(cita => 
        moment(cita.start).isSame(hoy, 'week')
      );
      
      const citasEsteMes = citasValidas.filter(cita => 
        moment(cita.start).isSame(hoy, 'month')
      );
      
      const proximaCita = citasValidas
        .filter(cita => moment(cita.start).isAfter(hoy))
        .sort((a, b) => moment(a.start) - moment(b.start))[0];

      // Estadísticas por día de la semana
      const citasPorDia = {};
      const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      
      citasValidas.forEach(cita => {
        const dia = moment(cita.start).day();
        const nombreDia = diasSemana[dia];
        citasPorDia[nombreDia] = (citasPorDia[nombreDia] || 0) + 1;
      });

      // Estadísticas por hora
      const citasPorHora = {};
      for (let i = 8; i <= 20; i++) {
        citasPorHora[i] = 0;
      }
      
      citasValidas.forEach(cita => {
        const hora = moment(cita.start).hour();
        if (hora >= 8 && hora <= 20) {
          citasPorHora[hora]++;
        }
      });

      // Citas pasadas vs futuras
      const citasPasadas = citasValidas.filter(cita => moment(cita.start).isBefore(hoy));
      const citasFuturas = citasValidas.filter(cita => moment(cita.start).isAfter(hoy));

      return {
        total: citasValidas.length,
        hoy: citasHoy.length,
        estaSemana: citasEstaSemana.length,
        esteMes: citasEsteMes.length,
        proximaCita,
        citasPorDia,
        citasPorHora,
        citasPasadas: citasPasadas.length,
        citasFuturas: citasFuturas.length,
        diasSemana
      };
    } catch (error) {
      console.error('Error al calcular estadísticas:', error);
      return {
        total: 0,
        hoy: 0,
        estaSemana: 0,
        esteMes: 0,
        proximaCita: null,
        citasPorDia: {},
        citasPorHora: {},
        citasPasadas: 0,
        citasFuturas: 0,
        diasSemana: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
      };
    }
  }, [citas]);

  const renderCitasPorDia = useMemo(() => {
    return stats.diasSemana.map(dia => {
      const count = stats.citasPorDia[dia] || 0;
      const porcentaje = stats.total > 0 ? (count / stats.total * 100).toFixed(1) : 0;
      
      return (
        <div key={dia} style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.5rem',
          borderBottom: '1px solid #e9ecef'
        }}>
          <span style={{ fontWeight: '500', color: '#2c3e50' }}>{dia}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: '#667eea', fontWeight: '600' }}>{count}</span>
            <div style={{
              width: '60px',
              height: '8px',
              background: '#e9ecef',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${porcentaje}%`,
                height: '100%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                transition: 'width 0.3s ease'
              }} />
            </div>
            <span style={{ fontSize: '0.8rem', color: '#6c757d', minWidth: '30px' }}>
              {porcentaje}%
            </span>
          </div>
        </div>
      );
    });
  }, [stats]);

  const renderCitasPorHora = useMemo(() => {
    return Object.entries(stats.citasPorHora).map(([hora, count]) => {
      const porcentaje = stats.total > 0 ? (count / stats.total * 100).toFixed(1) : 0;
      
      return (
        <div key={hora} style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.5rem',
          borderBottom: '1px solid #e9ecef'
        }}>
          <span style={{ fontWeight: '500', color: '#2c3e50' }}>
            {hora.padStart(2, '0')}:00
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: '#667eea', fontWeight: '600' }}>{count}</span>
            <div style={{
              width: '60px',
              height: '8px',
              background: '#e9ecef',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${porcentaje}%`,
                height: '100%',
                background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                transition: 'width 0.3s ease'
              }} />
            </div>
            <span style={{ fontSize: '0.8rem', color: '#6c757d', minWidth: '30px' }}>
              {porcentaje}%
            </span>
          </div>
        </div>
      );
    });
  }, [stats]);

  return (
    <div className="stats-page" style={{
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h1 style={{
          textAlign: 'center',
          color: '#2c3e50',
          fontSize: '2rem',
          fontWeight: '700',
          marginBottom: '2rem'
        }}>
          📊 Estadísticas Detalladas de Citas
        </h1>

        {/* Tarjetas principales */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            textAlign: 'center',
            padding: '1.5rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            color: 'white'
          }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              {stats.total}
            </div>
            <div style={{ fontSize: '1rem', opacity: 0.9 }}>Total de Citas</div>
          </div>
          
          <div style={{
            textAlign: 'center',
            padding: '1.5rem',
            background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
            borderRadius: '12px',
            color: 'white'
          }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              {stats.hoy}
            </div>
            <div style={{ fontSize: '1rem', opacity: 0.9 }}>Citas Hoy</div>
          </div>
          
          <div style={{
            textAlign: 'center',
            padding: '1.5rem',
            background: 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)',
            borderRadius: '12px',
            color: 'white'
          }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              {stats.estaSemana}
            </div>
            <div style={{ fontSize: '1rem', opacity: 0.9 }}>Esta Semana</div>
          </div>
          
          <div style={{
            textAlign: 'center',
            padding: '1.5rem',
            background: 'linear-gradient(135deg, #dc3545 0%, #e83e8c 100%)',
            borderRadius: '12px',
            color: 'white'
          }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              {stats.esteMes}
            </div>
            <div style={{ fontSize: '1rem', opacity: 0.9 }}>Este Mes</div>
          </div>
        </div>

        {/* Próxima cita */}
        {stats.proximaCita && (
          <div style={{
            background: 'linear-gradient(135deg, #17a2b8 0%, #6f42c1 100%)',
            color: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            marginBottom: '2rem'
          }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>
              🎯 Próxima Cita
            </h3>
            <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>
              {stats.proximaCita.title}
            </div>
            <div style={{ opacity: 0.9 }}>
              {moment(stats.proximaCita.start).format('dddd, D [de] MMMM [a las] HH:mm')}
            </div>
          </div>
        )}

        {/* Distribución temporal */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#2c3e50' }}>
              📅 Citas por Día de la Semana
            </h3>
            {renderCitasPorDia()}
          </div>
          
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#2c3e50' }}>
              🕐 Citas por Hora del Día
            </h3>
            {renderCitasPorHora()}
          </div>
        </div>

        {/* Resumen temporal */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{
            textAlign: 'center',
            padding: '1rem',
            background: '#e9ecef',
            borderRadius: '8px'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#6c757d' }}>
              {stats.citasPasadas}
            </div>
            <div style={{ color: '#6c757d' }}>Citas Pasadas</div>
          </div>
          
          <div style={{
            textAlign: 'center',
            padding: '1rem',
            background: '#e9ecef',
            borderRadius: '8px'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#6c757d' }}>
              {stats.citasFuturas}
            </div>
            <div style={{ color: '#6c757d' }}>Citas Futuras</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPageComponent; 