import React from 'react';
import CalendarView from '../organisms/CalendarView/CalendarView';

const App = () => {
  console.log('App render');
  return (
    <div className='App' style={{ padding: '2rem', background: 'var(--app-bg, #f9fafb)' }}>
      <CalendarView
        events={{
          '2024-06-04': [
            { title: 'Consulta con Dr. Juan', time: '10:00' }
          ],
          '2024-06-07': [
            { title: 'Vacuna', time: '12:30' }
          ],
          '2024-06-12': [
            { title: 'Control pediátrico', time: '09:00' },
            { title: 'Ecografía', time: '15:00' }
          ]
        }}
      />
    </div>
  );
};

export default App; 