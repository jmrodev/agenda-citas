import { render, screen } from '@testing-library/react';
import CalendarWeekdays from './CalendarWeekdays';

describe('CalendarWeekdays Component', () => {
  const defaultWeekdays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  test('renderiza los días de la semana por defecto y sus clases', () => {
    const { container } = render(<CalendarWeekdays />);

    // Verificar el contenedor principal
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const weekdaysContainer = container.firstChild;
    expect(weekdaysContainer).toBeInTheDocument();
    expect(weekdaysContainer).toHaveClass('calendarWeekdays');

    // Verificar cada día
    defaultWeekdays.forEach(dayName => {
      const dayElement = screen.getByText(dayName);
      expect(dayElement).toBeInTheDocument();
      expect(dayElement.tagName).toBe('SPAN');
      expect(dayElement).toHaveClass('day');
    });

    // Verificar la cantidad de días renderizados
    // eslint-disable-next-line testing-library/no-node-access
    const dayElements = container.querySelectorAll(`.${'day'}`);
    expect(dayElements.length).toBe(defaultWeekdays.length);
  });

  test('renderiza un array de días personalizado', () => {
    const customDays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
    render(<CalendarWeekdays days={customDays} />);

    customDays.forEach(dayName => {
      expect(screen.getByText(dayName)).toBeInTheDocument();
    });
    // Asegurarse de que los días por defecto no están
    expect(screen.queryByText('Lun')).not.toBeInTheDocument();
  });

  test('renderiza un contenedor vacío si el array days está vacío', () => {
    const { container } = render(<CalendarWeekdays days={[]} />);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const weekdaysContainer = container.firstChild;
    expect(weekdaysContainer).toBeInTheDocument();
    expect(weekdaysContainer).toHaveClass('calendarWeekdays');
    // eslint-disable-next-line testing-library/no-node-access
    expect(weekdaysContainer.children.length).toBe(0);
  });

  test('aplica className, style y otras props al div contenedor principal', () => {
    const customClass = "mis-dias-semana";
    const customStyle = { fontWeight: 'bold' };
    const { container } = render(
      <CalendarWeekdays
        className={customClass}
        style={customStyle}
        data-testid="weekdays-custom"
        id="dias-semana-id"
      />
    );
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const weekdaysContainer = container.firstChild;
    expect(weekdaysContainer).toHaveClass('calendarWeekdays', customClass);
    expect(weekdaysContainer).toHaveStyle('font-weight: bold;');
    expect(weekdaysContainer).toHaveAttribute('data-testid', 'weekdays-custom');
    expect(weekdaysContainer).toHaveAttribute('id', 'dias-semana-id');
  });
}); 