import { render, screen } from '@testing-library/react';
import CalendarWeekday from './CalendarWeekday';

describe('CalendarWeekday Component', () => {
  const weekdayText = 'Mar';

  test('renderiza el texto (children) del día de la semana', () => {
    render(<CalendarWeekday>{weekdayText}</CalendarWeekday>);
    expect(screen.getByText(weekdayText)).toBeInTheDocument();
  });

  test('renderiza como un elemento span', () => {
    render(<CalendarWeekday>{weekdayText}</CalendarWeekday>);
    const weekdayElement = screen.getByText(weekdayText);
    expect(weekdayElement.tagName).toBe('SPAN');
  });

  test('aplica la clase base "calendarWeekday"', () => {
    render(<CalendarWeekday>{weekdayText}</CalendarWeekday>);
    const weekdayElement = screen.getByText(weekdayText);
    expect(weekdayElement).toHaveClass('calendarWeekday');
  });

  test('aplica clases CSS adicionales pasadas mediante className', () => {
    const customClass = 'mi-dia-semana-personalizado';
    render(<CalendarWeekday className={customClass}>{weekdayText}</CalendarWeekday>);
    const weekdayElement = screen.getByText(weekdayText);
    expect(weekdayElement).toHaveClass('calendarWeekday', customClass);
  });

  test('pasa atributos adicionales al elemento span', () => {
    render(<CalendarWeekday title="Martes" data-testid="weekday-span">{weekdayText}</CalendarWeekday>);
    const weekdayElement = screen.getByTestId('weekday-span');
    expect(weekdayElement).toBeInTheDocument();
    expect(weekdayElement).toHaveAttribute('title', 'Martes');
    expect(screen.getByText(weekdayText)).toBe(weekdayElement); // Asegurar que es el mismo elemento
  });

  test('renderiza correctamente sin hijos (children) si es un caso válido', () => {
    // Esto dependerá de si es un caso de uso permitido.
    // Si no se esperan children, este test puede ser irrelevante o necesitar un aria-label.
    render(<CalendarWeekday data-testid="empty-weekday" />);
    const weekdayElement = screen.getByTestId('empty-weekday');
    expect(weekdayElement).toBeInTheDocument();
    expect(weekdayElement).toHaveTextContent('');
  });
}); 