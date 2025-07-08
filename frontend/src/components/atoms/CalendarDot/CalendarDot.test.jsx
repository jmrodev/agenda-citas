import { render, screen } from '@testing-library/react';
import CalendarDot from './CalendarDot';

describe('CalendarDot Component', () => {
  test('renderiza el componente span', () => {
    render(<CalendarDot data-testid="calendar-dot-span" />);
    const dotElement = screen.getByTestId('calendar-dot-span');
    expect(dotElement).toBeInTheDocument();
    // Verifica que el elemento renderizado sea un span
    expect(dotElement.tagName).toBe('SPAN');
  });

  test('aplica la clase base "calendarDot"', () => {
    render(<CalendarDot data-testid="calendar-dot-base" />);
    expect(screen.getByTestId('calendar-dot-base')).toHaveClass('calendarDot');
  });

  test('aplica el color "primary" por defecto', () => {
    render(<CalendarDot data-testid="calendar-dot-primary" />);
    // Asumiendo que 'primary' es una clase definida en tus CSS Modules para el color
    expect(screen.getByTestId('calendar-dot-primary')).toHaveClass('calendarDot primary');
  });

  test('aplica un color específico, por ejemplo "secondary"', () => {
    render(<CalendarDot color="secondary" data-testid="calendar-dot-secondary" />);
    expect(screen.getByTestId('calendar-dot-secondary')).toHaveClass('calendarDot secondary');
  });

  test('aplica un color no definido en estilos y no añade clase de color extra', () => {
    render(<CalendarDot color="unknownColor" data-testid="calendar-dot-unknown" />);
    const dotElement = screen.getByTestId('calendar-dot-unknown');
    // styles[color] || '' resultará en '' para unknownColor.
    expect(dotElement).toHaveClass('calendarDot');
    expect(dotElement).not.toHaveClass('unknownColor');
  });

  test('aplica clases CSS adicionales pasadas mediante className', () => {
    const customClass = 'mi-punto-personalizado';
    render(<CalendarDot className={customClass} data-testid="calendar-dot-custom-class" />);
    const dotElement = screen.getByTestId('calendar-dot-custom-class');
    expect(dotElement).toHaveClass('calendarDot primary', customClass);
  });

  test('pasa atributos adicionales al elemento span', () => {
    render(<CalendarDot title="Evento importante" data-testid="calendar-dot-attrs" />);
    const dotElement = screen.getByTestId('calendar-dot-attrs');
    expect(dotElement).toHaveAttribute('title', 'Evento importante');
  });
}); 