import { render, screen, fireEvent } from '@testing-library/react';
import Checkbox from './Checkbox';
import { vi } from 'vitest';

describe('Checkbox Component', () => {
  const testLabel = 'Aceptar términos';

  test('renderiza un input de tipo checkbox', () => {
    render(<Checkbox aria-label={testLabel} />);
    const checkboxElement = screen.getByRole('checkbox', { name: testLabel });
    expect(checkboxElement).toBeInTheDocument();
    expect(checkboxElement.type).toBe('checkbox');
  });

  test('refleja el estado "checked" correctamente', () => {
    render(<Checkbox checked aria-label={testLabel} />);
    expect(screen.getByRole('checkbox', { name: testLabel })).toBeChecked();
  });

  test('refleja el estado "unchecked" (no checked) correctamente', () => {
    render(<Checkbox checked={false} aria-label={testLabel} />);
    expect(screen.getByRole('checkbox', { name: testLabel })).not.toBeChecked();
  });

  test('llama a onChange cuando se hace click y no está deshabilitado', () => {
    const mockOnChange = vi.fn();
    render(<Checkbox checked={false} onChange={mockOnChange} aria-label={testLabel} />);
    const checkbox = screen.getByRole('checkbox', { name: testLabel });
    fireEvent.click(checkbox);
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    // El mock de onChange debería ser llamado con el evento, y el estado target.checked sería true.
    // Esto depende de si quieres testear los argumentos de onChange.
    // Ejemplo: expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({ target: { checked: true } }));
  });

  test('no llama a onChange cuando está deshabilitado y se hace click', () => {
    const mockOnChange = vi.fn();
    render(<Checkbox checked={false} onChange={mockOnChange} disabled aria-label={testLabel} />);
    const checkbox = screen.getByRole('checkbox', { name: testLabel });
    fireEvent.click(checkbox);
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  test('está deshabilitado cuando la prop "disabled" es true', () => {
    render(<Checkbox disabled aria-label={testLabel} />);
    expect(screen.getByRole('checkbox', { name: testLabel })).toBeDisabled();
  });

  test('aplica la clase "error" y aria-invalid="true" cuando la prop "error" es true', () => {
    render(<Checkbox error aria-label={testLabel} />);
    const checkbox = screen.getByRole('checkbox', { name: testLabel });
    expect(checkbox).toHaveClass('checkbox error'); // 'checkbox' es la clase base
    expect(checkbox).toHaveAttribute('aria-invalid', 'true');
  });

  test('no aplica la clase "error" ni aria-invalid cuando "error" es false', () => {
    render(<Checkbox error={false} aria-label={testLabel} />);
    const checkbox = screen.getByRole('checkbox', { name: testLabel });
    expect(checkbox).not.toHaveClass('error');
    // aria-invalid puede no estar presente o ser 'false'. El comportamiento estándar es que no esté si no hay error.
    // Si se establece explícitamente a false en el componente: expect(checkbox).toHaveAttribute('aria-invalid', 'false');
    // Si se omite: expect(checkbox).not.toHaveAttribute('aria-invalid', 'true'); (o simplemente no tener el atributo)
    expect(checkbox.getAttribute('aria-invalid')).toBe('false'); // El componente lo setea a true o false
  });

  test('aplica clases CSS adicionales pasadas mediante className', () => {
    const customClass = 'mi-checkbox-personalizado';
    render(<Checkbox className={customClass} aria-label={testLabel} />);
    expect(screen.getByRole('checkbox', { name: testLabel })).toHaveClass('checkbox', customClass);
  });

  test('asigna el id correctamente', () => {
    const testId = 'terminos-y-condiciones';
    render(<Checkbox id={testId} aria-label={testLabel} />);
    expect(screen.getByRole('checkbox', { name: testLabel })).toHaveAttribute('id', testId);
  });

  test('aplica aria-label correctamente', () => {
    render(<Checkbox aria-label={testLabel} />);
    expect(screen.getByRole('checkbox', { name: testLabel })).toBeInTheDocument();
  });

  test('aplica aria-describedby correctamente', () => {
    const descriptionId = 'descripcion-checkbox';
    render(<Checkbox aria-label={testLabel} aria-describedby={descriptionId} />);
    expect(screen.getByRole('checkbox', { name: testLabel })).toHaveAttribute('aria-describedby', descriptionId);
  });

  test('pasa atributos adicionales al elemento input', () => {
    render(<Checkbox data-testid="custom-checkbox" name="agree" aria-label={testLabel} />);
    const checkbox = screen.getByTestId('custom-checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute('name', 'agree');
  });
}); 