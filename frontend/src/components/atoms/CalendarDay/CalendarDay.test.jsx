import { render, screen, fireEvent } from '@testing-library/react';
import CalendarDay from './CalendarDay';
import { vi } from 'vitest';

describe('CalendarDay Component', () => {
  const dayNumber = 15;

  test('renderiza el número del día', () => {
    render(<CalendarDay day={dayNumber} />);
    expect(screen.getByRole('button', { name: `${dayNumber}` })).toBeInTheDocument();
    expect(screen.getByText(`${dayNumber}`)).toBeInTheDocument();
  });

  test('llama a onClick cuando se hace click y no está deshabilitado', () => {
    const mockOnClick = vi.fn();
    render(<CalendarDay day={dayNumber} onClick={mockOnClick} />);
    fireEvent.click(screen.getByRole('button', { name: `${dayNumber}` }));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('no llama a onClick cuando está deshabilitado', () => {
    const mockOnClick = vi.fn();
    render(<CalendarDay day={dayNumber} onClick={mockOnClick} isDisabled />);
    fireEvent.click(screen.getByRole('button', { name: `${dayNumber}` }));
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  test('está deshabilitado cuando isDisabled es true', () => {
    render(<CalendarDay day={dayNumber} isDisabled />);
    expect(screen.getByRole('button', { name: `${dayNumber}` })).toBeDisabled();
    expect(screen.getByRole('button', { name: `${dayNumber}` })).toHaveClass('disabled');
  });

  test('aplica la clase "selected" cuando isSelected es true', () => {
    render(<CalendarDay day={dayNumber} isSelected />);
    expect(screen.getByRole('button', { name: `${dayNumber}` })).toHaveClass('selected');
  });

  test('aplica la clase "today" cuando isToday es true', () => {
    render(<CalendarDay day={dayNumber} isToday />);
    expect(screen.getByRole('button', { name: `${dayNumber}` })).toHaveClass('today');
  });

  test('muestra un punto (event indicator) cuando hasEvent es true', () => {
    render(<CalendarDay day={dayNumber} hasEvent />);
    // Busca el span con la clase específica para el punto del evento.
    // La clase podría ser 'calendar-dot' o similar dependiendo de tu implementación de CSS modules.
    // Asumimos que el componente CalendarDot o el span tiene una clase identificable.
    // Si es un span simple, podríamos buscar por su clase CSS module.
    const buttonElement = screen.getByRole('button', { name: `${dayNumber}` });
    // eslint-disable-next-line testing-library/no-node-access
    const eventDot = buttonElement.querySelector('span'); // Asumiendo que el punto es un span
    expect(eventDot).toBeInTheDocument();
    expect(eventDot).toHaveClass('calendar-dot'); // Verifica la clase del módulo CSS
  });

  test('no muestra un punto (event indicator) cuando hasEvent es false o no se proporciona', () => {
    render(<CalendarDay day={dayNumber} />);
    const buttonElement = screen.getByRole('button', { name: `${dayNumber}` });
    // eslint-disable-next-line testing-library/no-node-access
    expect(buttonElement.querySelector('span.calendar-dot')).not.toBeInTheDocument();
  });

  test('aplica clases CSS adicionales pasadas mediante className', () => {
    const customClass = 'mi-dia-especial';
    render(<CalendarDay day={dayNumber} className={customClass} />);
    expect(screen.getByRole('button', { name: `${dayNumber}` })).toHaveClass('calendarDay', customClass);
  });

  test('pasa atributos adicionales al elemento button', () => {
    render(<CalendarDay day={dayNumber} data-testid="dia-calendario" aria-current="date" />);
    const buttonElement = screen.getByTestId('dia-calendario');
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveAttribute('aria-current', 'date');
    expect(screen.getByRole('button', { name: `${dayNumber}` })).toBe(buttonElement);
  });

  test('tiene el tipo "button" por defecto', () => {
    render(<CalendarDay day={dayNumber} />);
    expect(screen.getByRole('button', { name: `${dayNumber}` })).toHaveAttribute('type', 'button');
  });
}); 