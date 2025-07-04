import React from 'react';
import CalendarView from '../../organisms/CalendarView/CalendarView';
import { createLogger } from '../../../utils/debug.js';

const CalendarDemoPage = () => { // Renombrar el componente también
  const logger = createLogger('CalendarDemoPage');
  logger.log('render');
  return (
    <div className='CalendarDemoPage' style={{ padding: '2rem', background: 'var(--app-bg, #f9fafb)' }}>
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

export default CalendarDemoPage;
