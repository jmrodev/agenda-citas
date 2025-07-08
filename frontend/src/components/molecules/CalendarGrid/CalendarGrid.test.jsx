import React from 'react';
import { render, screen } from '@testing-library/react';
import CalendarGrid from './CalendarGrid';
import { vi } from 'vitest';

// Mockear CalendarDayInfo para verificar que se le pasan las props correctas
// y para simplificar el DOM en los tests de CalendarGrid.
vi.mock('../CalendarDayInfo/CalendarDayInfo', () => ({
  default: vi.fn((props) => (
    <div data-testid={`mock-dayinfo-${props.day || props.keyProp}`} {...props}>
      Day {props.day}
      {props.badge && <span>Badge: {props.badge}</span>}
      {props.chip && <span>Chip: {props.chip}</span>}
    </div>
  )),
}));

describe('CalendarGrid Component', () => {
  const mockDays = [
    { day: 1, badge: 'B1', chip: 'C1', onClick: vi.fn(), keyProp: 'day1' }, // Añadido keyProp para testid único
    { day: 2, isToday: true, onClick: vi.fn(), keyProp: 'day2' },
    { day: 3, isDisabled: true, onClick: vi.fn(), keyProp: 'day3' },
  ];

  beforeEach(() => {
    // Limpiar mocks de CalendarDayInfo y onClick de los días
    require('../CalendarDayInfo/CalendarDayInfo').default.mockClear();
    mockDays.forEach(day => day.onClick && day.onClick.mockClear());
  });

  test('renderiza un CalendarDayInfo para cada día con las props correctas por defecto', () => {
    render(<CalendarGrid days={mockDays} />);

    expect(require('../CalendarDayInfo/CalendarDayInfo').default).toHaveBeenCalledTimes(mockDays.length);

    mockDays.forEach((dayProps, index) => {
      // Verificar que CalendarDayInfo fue llamado con las props correctas
      expect(require('../CalendarDayInfo/CalendarDayInfo').default).toHaveBeenNthCalledWith(
        index + 1,
        expect.objectContaining(dayProps), // Espera un objeto que contenga todas las dayProps
        {} // El segundo argumento para el mock de un componente funcional (contexto)
      );

      // Verificar que el contenido renderizado por el mock está presente
      const dayInfoElement = screen.getByTestId(`mock-dayinfo-${dayProps.keyProp}`);
      expect(dayInfoElement).toBeInTheDocument();
      expect(screen.getByText(`Day ${dayProps.day}`)).toBeInTheDocument();
      if (dayProps.badge) {
        expect(screen.getByText(`Badge: ${dayProps.badge}`)).toBeInTheDocument();
      }
      if (dayProps.chip) {
        expect(screen.getByText(`Chip: ${dayProps.chip}`)).toBeInTheDocument();
      }
    });
  });

  test('llama a renderDay para cada día si se proporciona', () => {
    const mockRenderDay = vi.fn((dayProps, index) => (
      <div key={index} data-testid={`custom-day-${dayProps.day}`}>
        Custom Day {dayProps.day}
      </div>
    ));

    render(<CalendarGrid days={mockDays} renderDay={mockRenderDay} />);

    expect(mockRenderDay).toHaveBeenCalledTimes(mockDays.length);
    mockDays.forEach((dayProps, index) => {
      expect(mockRenderDay).toHaveBeenCalledWith(dayProps, index);
      expect(screen.getByTestId(`custom-day-${dayProps.day}`)).toBeInTheDocument();
      expect(screen.getByText(`Custom Day ${dayProps.day}`)).toBeInTheDocument();
    });
    // Asegurarse de que el CalendarDayInfo mock no fue llamado
    expect(require('../CalendarDayInfo/CalendarDayInfo').default).not.toHaveBeenCalled();
  });

  test('renderiza un div vacío con la clase "calendarGrid" si el array days está vacío', () => {
    const { container } = render(<CalendarGrid days={[]} />);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const gridElement = container.firstChild; // El div principal
    expect(gridElement).toBeInTheDocument();
    expect(gridElement).toHaveClass('calendarGrid');
    // eslint-disable-next-line testing-library/no-node-access
    expect(gridElement.children.length).toBe(0); // No debería tener hijos
  });

  test('aplica className, style y otras props al div contenedor principal', () => {
    const customClass = "mi-grid-calendario";
    const customStyle = { display: 'flex' };
    const { container } = render(
      <CalendarGrid
        days={[]} // Vacío para simplificar
        className={customClass}
        style={customStyle}
        data-grid-id="grid-principal"
        id="calendar-grid-container"
      />
    );
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const gridElement = container.firstChild;
    expect(gridElement).toHaveClass('calendarGrid', customClass);
    expect(gridElement).toHaveStyle('display: flex;');
    expect(gridElement).toHaveAttribute('data-grid-id', 'grid-principal');
    expect(gridElement).toHaveAttribute('id', 'calendar-grid-container');
  });
}); 