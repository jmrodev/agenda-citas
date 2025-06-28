import React from 'react';
import moment from 'moment';

const DayViewComponent = ({ citas, selectedDate, onCitaClick }) => {
  // Filtrar citas del día seleccionado
  const citasDelDia = citas.filter(cita => 
    moment(cita.start).isSame(selectedDate, 'day')
  ).sort((a, b) => moment(a.start) - moment(b.start));

  // Generar slots de hora de 8:00 a 20:00
  const generarSlots = () => {
    const slots = [];
    const inicio = moment(selectedDate).startOf('day').add(8, 'hours');
    const fin = moment(selectedDate).startOf('day').add(20, 'hours');
    
    let horaActual = inicio.clone();
    while (horaActual.isBefore(fin)) {
      slots.push(horaActual.clone());
      horaActual.add(1, 'hour');
    }
    
    return slots;
  };

  const slots = generarSlots();

  const obtenerCitaEnSlot = (slot) => {
    return citasDelDia.find(cita => 
      moment(cita.start).isSame(slot, 'hour')
    );
  };

  return (
    <div className="day-view" style={{
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
        📅 Citas del {moment(selectedDate).format('dddd, DD [de] MMMM [de] YYYY')}
      </h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: '80px 1fr',
        gap: '0.5rem',
        maxHeight: '400px',
        overflowY: 'auto'
      }}>
        {slots.map((slot, index) => {
          const cita = obtenerCitaEnSlot(slot);
          const esHoraPasada = moment(slot).isBefore(moment(), 'hour');
          
          return (
            <React.Fragment key={index}>
              <div style={{
                padding: '0.5rem',
                background: esHoraPasada ? '#f8f9fa' : '#e3f2fd',
                border: '1px solid #e9ecef',
                borderRadius: '6px',
                textAlign: 'center',
                fontSize: '0.9rem',
                fontWeight: '500',
                color: esHoraPasada ? '#6c757d' : '#2c3e50'
              }}>
                {slot.format('HH:mm')}
              </div>
              
              <div 
                style={{
                  padding: '0.5rem',
                  background: cita 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : (esHoraPasada ? '#f8f9fa' : '#ffffff'),
                  border: cita 
                    ? 'none'
                    : '1px solid #e9ecef',
                  borderRadius: '6px',
                  cursor: cita ? 'pointer' : 'default',
                  color: cita ? 'white' : '#6c757d',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease',
                  minHeight: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onClick={() => {
                  if (cita) {
                    onCitaClick(cita);
                  }
                }}
                onMouseEnter={(e) => {
                  if (cita) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (cita) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              >
                {cita ? (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: '600' }}>{cita.title}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                      {moment(cita.start).format('HH:mm')} - {moment(cita.end).format('HH:mm')}
                    </div>
                  </div>
                ) : (
                  esHoraPasada ? 'Hora pasada' : 'Disponible'
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>
      
      {citasDelDia.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          color: '#6c757d',
          fontSize: '1rem'
        }}>
          📝 No hay citas programadas para este día
        </div>
      )}
      
      <div style={{
        marginTop: '1rem',
        padding: '1rem',
        background: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50', fontSize: '1rem' }}>
          💡 Información
        </h4>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#495057', fontSize: '0.9rem' }}>
          <li>Haz clic en una cita para editarla</li>
          <li>Haz clic en un horario vacío para crear una nueva cita</li>
          <li>Las horas pasadas se muestran en gris</li>
        </ul>
      </div>
    </div>
  );
};

export default DayViewComponent; 