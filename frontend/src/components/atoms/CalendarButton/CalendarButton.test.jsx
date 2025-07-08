import { render, screen, fireEvent } from '@testing-library/react';
import CalendarButton from './CalendarButton';
import { vi } from 'vitest';

describe('CalendarButton Component', () => {
  const buttonText = 'Día 5';

  test('renderiza el texto (children) del botón', () => {
    render(<CalendarButton>{buttonText}</CalendarButton>);
    // El rol es 'button' y el nombre accesible es el texto del children
    expect(screen.getByRole('button', { name: buttonText })).toBeInTheDocument();
  });

  test('llama a la función onClick cuando se hace click', () => {
    const mockOnClick = vi.fn();
    render(<CalendarButton onClick={mockOnClick}>{buttonText}</CalendarButton>);
    fireEvent.click(screen.getByRole('button', { name: buttonText }));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('no llama a onClick cuando está deshabilitado', () => {
    const mockOnClick = vi.fn();
    render(<CalendarButton onClick={mockOnClick} disabled>{buttonText}</CalendarButton>);
    fireEvent.click(screen.getByRole('button', { name: buttonText }));
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  test('tiene el tipo "button" por defecto (implícito en el componente)', () => {
    render(<CalendarButton>{buttonText}</CalendarButton>);
    expect(screen.getByRole('button', { name: buttonText })).toHaveAttribute('type', 'button');
  });

  test('está deshabilitado cuando la prop "disabled" es true', () => {
    render(<CalendarButton disabled>{buttonText}</CalendarButton>);
    expect(screen.getByRole('button', { name: buttonText })).toBeDisabled();
  });

  test('aplica la clase base "calendarButton"', () => {
    render(<CalendarButton>{buttonText}</CalendarButton>);
    expect(screen.getByRole('button', { name: buttonText })).toHaveClass('calendarButton');
  });

  test('aplica clases CSS adicionales pasadas mediante className', () => {
    const customClass = 'mi-boton-calendario-personalizado';
    render(<CalendarButton className={customClass}>{buttonText}</CalendarButton>);
    const buttonElement = screen.getByRole('button', { name: buttonText });
    expect(buttonElement).toHaveClass('calendarButton', customClass);
  });

  test('pasa atributos adicionales al elemento button', () => {
    render(<CalendarButton data-testid="custom-calendar-button" aria-pressed="true">{buttonText}</CalendarButton>);
    const buttonElement = screen.getByTestId('custom-calendar-button');
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: buttonText })).toBe(buttonElement); // Asegurar que es el mismo botón
  });

  test('renderiza correctamente sin children si se proporciona un aria-label', () => {
    const label = "Seleccionar fecha anterior";
    render(<CalendarButton aria-label={label} />);
    const buttonElement = screen.getByRole('button', { name: label });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveTextContent(''); // No tiene children visibles
  });
}); 