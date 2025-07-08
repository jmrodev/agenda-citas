import { render, screen, fireEvent } from '@testing-library/react';
import Radio from './Radio';
import { vi } from 'vitest';

describe('Radio Component', () => {
  const testAriaLabel = 'Opción de radio';
  const testValue = 'valorUnico';
  const testName = 'grupoOpciones';

  test('renderiza un input de tipo radio', () => {
    render(<Radio aria-label={testAriaLabel} value={testValue} name={testName} onChange={() => {}} />);
    const radioElement = screen.getByRole('radio', { name: testAriaLabel });
    expect(radioElement).toBeInTheDocument();
    expect(radioElement.type).toBe('radio');
  });

  test('refleja el estado "checked" y los atributos name/value correctamente', () => {
    render(<Radio checked aria-label={testAriaLabel} value={testValue} name={testName} onChange={() => {}} />);
    const radioElement = screen.getByRole('radio', { name: testAriaLabel });
    expect(radioElement).toBeChecked();
    expect(radioElement).toHaveAttribute('value', testValue);
    expect(radioElement).toHaveAttribute('name', testName);
  });

  test('refleja el estado "unchecked" (no checked) correctamente', () => {
    render(<Radio checked={false} aria-label={testAriaLabel} value={testValue} name={testName} onChange={() => {}} />);
    expect(screen.getByRole('radio', { name: testAriaLabel })).not.toBeChecked();
  });

  test('llama a onChange cuando se hace click y no está deshabilitado', () => {
    const mockOnChange = vi.fn();
    // Para radio buttons, onChange se dispara cuando el estado checked cambia.
    // Al hacer click en un radio no chequeado, se chequea y onChange se llama.
    render(
      <Radio
        checked={false}
        onChange={mockOnChange}
        aria-label={testAriaLabel}
        value={testValue}
        name={testName}
      />
    );
    const radio = screen.getByRole('radio', { name: testAriaLabel });
    fireEvent.click(radio);
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    // El evento target.value debería ser el valor del radio button.
    expect(mockOnChange.mock.calls[0][0].target.value).toBe(testValue);
  });

  test('no llama a onChange cuando ya está checked y se hace click (comportamiento estándar de radio)', () => {
    const mockOnChange = vi.fn();
    render(
      <Radio
        checked={true} // Ya está chequeado
        onChange={mockOnChange}
        aria-label={testAriaLabel}
        value={testValue}
        name={testName}
      />
    );
    const radio = screen.getByRole('radio', { name: testAriaLabel });
    fireEvent.click(radio); // Hacer clic en un radio ya chequeado no lo deschequea ni llama onChange
    expect(mockOnChange).not.toHaveBeenCalled();
  });


  test('no llama a onChange cuando está deshabilitado y se hace click', () => {
    const mockOnChange = vi.fn();
    render(
      <Radio
        checked={false}
        onChange={mockOnChange}
        disabled
        aria-label={testAriaLabel}
        value={testValue}
        name={testName}
      />
    );
    const radio = screen.getByRole('radio', { name: testAriaLabel });
    fireEvent.click(radio);
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  test('está deshabilitado cuando la prop "disabled" es true', () => {
    render(<Radio disabled aria-label={testAriaLabel} value={testValue} name={testName} onChange={() => {}} />);
    expect(screen.getByRole('radio', { name: testAriaLabel })).toBeDisabled();
  });

  test('aplica la clase "error" y aria-invalid="true" cuando la prop "error" es true', () => {
    render(<Radio error aria-label={testAriaLabel} value={testValue} name={testName} onChange={() => {}} />);
    const radio = screen.getByRole('radio', { name: testAriaLabel });
    expect(radio).toHaveClass('radio error'); // 'radio' es la clase base
    expect(radio).toHaveAttribute('aria-invalid', 'true');
  });

  test('no aplica la clase "error" ni aria-invalid cuando "error" es false o no se proporciona', () => {
    const { rerender } = render(<Radio error={false} aria-label={testAriaLabel} value={testValue} name={testName} onChange={() => {}} />);
    const radio = screen.getByRole('radio', { name: testAriaLabel });
    expect(radio).not.toHaveClass('error');
    expect(radio.getAttribute('aria-invalid')).toBe('false');

    rerender(<Radio aria-label={testAriaLabel} value={testValue} name={testName} onChange={() => {}} />);
    const radioDefault = screen.getByRole('radio', { name: testAriaLabel });
    expect(radioDefault.getAttribute('aria-invalid')).toBe('false'); // El componente lo setea a true o false
  });

  test('aplica clases CSS adicionales pasadas mediante className', () => {
    const customClass = 'mi-radio-personalizado';
    render(<Radio className={customClass} aria-label={testAriaLabel} value={testValue} name={testName} onChange={() => {}} />);
    expect(screen.getByRole('radio', { name: testAriaLabel })).toHaveClass('radio', customClass);
  });

  test('asigna el id correctamente', () => {
    const testId = 'opcion-genero-masculino';
    render(<Radio id={testId} aria-label={testAriaLabel} value={testValue} name={testName} onChange={() => {}} />);
    expect(screen.getByRole('radio', { name: testAriaLabel })).toHaveAttribute('id', testId);
  });

  test('aplica aria-label correctamente', () => {
    render(<Radio aria-label={testAriaLabel} value={testValue} name={testName} onChange={() => {}} />);
    expect(screen.getByRole('radio', { name: testAriaLabel })).toBeInTheDocument();
  });

  test('aplica aria-describedby correctamente', () => {
    const descriptionId = 'descripcion-radio';
    render(
      <Radio
        aria-label={testAriaLabel}
        aria-describedby={descriptionId}
        value={testValue}
        name={testName}
        onChange={() => {}}
      />
    );
    expect(screen.getByRole('radio', { name: testAriaLabel })).toHaveAttribute('aria-describedby', descriptionId);
  });

  test('pasa atributos adicionales al elemento input', () => {
    render(
      <Radio
        data-testid="custom-radio"
        aria-label={testAriaLabel}
        value={testValue}
        name={testName}
        onChange={() => {}}
        data-customattr="valor-extra"
      />
    );
    const radio = screen.getByTestId('custom-radio');
    expect(radio).toBeInTheDocument();
    expect(radio).toHaveAttribute('data-customattr', 'valor-extra');
  });
}); 