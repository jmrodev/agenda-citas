import { render, screen, fireEvent } from '@testing-library/react';
import CalendarView from './CalendarView';

// Mock de los componentes hijos
jest.mock('../../molecules/CalendarHeader/CalendarHeader', () => {
  return function MockCalendarHeader({ month, year, onPrev, onNext }) {
    return (
      <div data-testid="calendar-header">
        <button onClick={onPrev} data-testid="prev-button">Anterior</button>
        <span data-testid="month-year">{month}/{year}</span>
        <button onClick={onNext} data-testid="next-button">Siguiente</button>
      </div>
    );
  };
});

jest.mock('../../molecules/CalendarWeekdays/CalendarWeekdays', () => {
  return function MockCalendarWeekdays() {
    return <div data-testid="calendar-weekdays">Días de la semana</div>;
  };
});

jest.mock('../../molecules/CalendarGrid/CalendarGrid', () => {
  return function MockCalendarGrid({ days }) {
    return (
      <div data-testid="calendar-grid">
        {days.map((day, index) => (
          <button
            key={index}
            onClick={day.onClick}
            disabled={day.isDisabled}
            data-testid={`day-${day.day}`}
            data-selected={day.isSelected}
            data-today={day.isToday}
            data-has-event={day.hasEvent}
          >
            {day.day}
          </button>
        ))}
      </div>
    );
  };
});

jest.mock('../../molecules/CalendarEventList/CalendarEventList', () => {
  return function MockCalendarEventList({ events }) {
    return (
      <div data-testid="calendar-event-list">
        {events.map((event, index) => (
          <div key={index} data-testid={`event-${index}`}>
            {event.title} - {event.time}
          </div>
        ))}
      </div>
    );
  };
});

// Mock de la función de debug
jest.mock('../../../utils/debug.js', () => ({
  createLogger: () => ({
    log: jest.fn(),
  }),
}));

describe('CalendarView', () => {
  const mockOnDayClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza el calendario con componentes básicos', () => {
    render(<CalendarView onDayClick={mockOnDayClick} />);
    
    expect(screen.getByTestId('calendar-header')).toBeInTheDocument();
    expect(screen.getByTestId('calendar-weekdays')).toBeInTheDocument();
    expect(screen.getByTestId('calendar-grid')).toBeInTheDocument();
    expect(screen.getByTestId('calendar-event-list')).toBeInTheDocument();
  });

  test('muestra el mes y año actual por defecto', () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    render(<CalendarView onDayClick={mockOnDayClick} />);
    
    expect(screen.getByTestId('month-year')).toHaveTextContent(`${currentMonth}/${currentYear}`);
  });

  test('permite navegar al mes anterior', () => {
    render(<CalendarView onDayClick={mockOnDayClick} />);
    
    const prevButton = screen.getByTestId('prev-button');
    fireEvent.click(prevButton);
    
    // Verificar que se actualiza el mes
    const currentDate = new Date();
    const previousMonth = currentDate.getMonth() === 0 ? 11 : currentDate.getMonth() - 1;
    const expectedYear = currentDate.getMonth() === 0 ? currentDate.getFullYear() - 1 : currentDate.getFullYear();
    
    expect(screen.getByTestId('month-year')).toHaveTextContent(`${previousMonth}/${expectedYear}`);
  });

  test('permite navegar al mes siguiente', () => {
    render(<CalendarView onDayClick={mockOnDayClick} />);
    
    const nextButton = screen.getByTestId('next-button');
    fireEvent.click(nextButton);
    
    // Verificar que se actualiza el mes
    const currentDate = new Date();
    const nextMonth = currentDate.getMonth() === 11 ? 0 : currentDate.getMonth() + 1;
    const expectedYear = currentDate.getMonth() === 11 ? currentDate.getFullYear() + 1 : currentDate.getFullYear();
    
    expect(screen.getByTestId('month-year')).toHaveTextContent(`${nextMonth}/${expectedYear}`);
  });

  test('renderiza días del mes correctamente', () => {
    render(<CalendarView onDayClick={mockOnDayClick} />);
    
    // Verificar que se renderizan días (al menos algunos)
    const days = screen.getAllByTestId(/^day-/);
    expect(days.length).toBeGreaterThan(0);
  });

  test('llama onDayClick cuando se hace click en un día', () => {
    render(<CalendarView onDayClick={mockOnDayClick} />);
    
    const days = screen.getAllByTestId(/^day-/);
    const firstEnabledDay = days.find(day => !day.disabled);
    
    if (firstEnabledDay) {
      fireEvent.click(firstEnabledDay);
      expect(mockOnDayClick).toHaveBeenCalled();
    }
  });

  test('muestra eventos cuando se proporcionan', () => {
    const events = {
      '2024-06-15': [
        { title: 'Cita con Dr. García', time: '10:00' },
        { title: 'Consulta de seguimiento', time: '14:30' }
      ]
    };
    
    render(<CalendarView onDayClick={mockOnDayClick} events={events} />);
    
    // Los eventos se muestran en el CalendarEventList cuando se selecciona el día
    const days = screen.getAllByTestId(/^day-/);
    const dayWithEvent = days.find(day => day.getAttribute('data-has-event') === 'true');
    
    if (dayWithEvent) {
      fireEvent.click(dayWithEvent);
      expect(screen.getByTestId('calendar-event-list')).toBeInTheDocument();
    }
  });

  test('resetea la selección al cambiar de mes', () => {
    render(<CalendarView onDayClick={mockOnDayClick} />);
    
    // Seleccionar un día
    const days = screen.getAllByTestId(/^day-/);
    const firstEnabledDay = days.find(day => !day.disabled);
    
    if (firstEnabledDay) {
      fireEvent.click(firstEnabledDay);
      expect(firstEnabledDay.getAttribute('data-selected')).toBe('true');
      
      // Cambiar de mes
      const nextButton = screen.getByTestId('next-button');
      fireEvent.click(nextButton);
      
      // Verificar que la selección se resetea
      expect(firstEnabledDay.getAttribute('data-selected')).toBe('false');
    }
  });

  test('aplica className y style personalizados', () => {
    const customClassName = 'custom-calendar';
    const customStyle = { backgroundColor: 'red' };
    
    render(
      <CalendarView 
        onDayClick={mockOnDayClick} 
        className={customClassName}
        style={customStyle}
      />
    );
    
    const calendarView = screen.getByTestId('calendar-header').parentElement;
    expect(calendarView).toHaveClass(customClassName);
    expect(calendarView).toHaveStyle(customStyle);
  });

  test('maneja mes y año iniciales personalizados', () => {
    const initialMonth = 5; // Junio
    const initialYear = 2024;
    
    render(
      <CalendarView 
        onDayClick={mockOnDayClick}
        initialMonth={initialMonth}
        initialYear={initialYear}
      />
    );
    
    expect(screen.getByTestId('month-year')).toHaveTextContent(`${initialMonth}/${initialYear}`);
  });

  test('marca el día actual correctamente', () => {
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    
    render(<CalendarView onDayClick={mockOnDayClick} />);
    
    const todayButton = screen.getByTestId(`day-${currentDay}`);
    expect(todayButton.getAttribute('data-today')).toBe('true');
  });
}); 