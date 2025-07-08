import { render, screen, fireEvent } from '@testing-library/react';
import Select from './Select';
import { vi } from 'vitest';

describe('Select Component', () => {
  const testOptions = [
    { value: 'op1', label: 'Opción Uno' },
    { value: 'op2', label: 'Opción Dos' },
    { value: 'op3', label: 'Opción Tres (Deshabilitada)', disabled: true },
  ];
  const testAriaLabel = 'Selector de opciones';

  test('renderiza un select con el aria-label y las opciones correctas', () => {
    render(<Select options={testOptions} aria-label={testAriaLabel} onChange={() => {}} />);
    const selectElement = screen.getByRole('combobox', { name: testAriaLabel });
    expect(selectElement).toBeInTheDocument();

    // Verificar opciones
    expect(screen.getByRole('option', { name: 'Opción Uno' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Opción Dos' })).toBeInTheDocument();
    const option3 = screen.getByRole('option', { name: 'Opción Tres (Deshabilitada)' });
    expect(option3).toBeInTheDocument();
    expect(option3).toBeDisabled();

    // eslint-disable-next-line testing-library/no-node-access
    expect(selectElement.children.length).toBe(testOptions.length);
  });

  test('refleja el valor (value) seleccionado correctamente', () => {
    render(<Select options={testOptions} value="op2" aria-label={testAriaLabel} onChange={() => {}} />);
    const selectElement = screen.getByRole('combobox', { name: testAriaLabel });
    expect(selectElement).toHaveValue('op2');

    // Verificar que la opción correcta está seleccionada
    const option1 = screen.getByRole('option', { name: 'Opción Uno' });
    const option2 = screen.getByRole('option', { name: 'Opción Dos' });
    expect(option1.selected).toBe(false);
    expect(option2.selected).toBe(true);
  });

  test('llama a onChange con el nuevo valor cuando el usuario selecciona una opción', () => {
    const mockOnChange = vi.fn();
    render(<Select options={testOptions} value="op1" onChange={mockOnChange} aria-label={testAriaLabel} />);
    const selectElement = screen.getByRole('combobox', { name: testAriaLabel });

    fireEvent.change(selectElement, { target: { value: 'op2' } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange.mock.calls[0][0].target.value).toBe('op2');
  });

  test('está deshabilitado cuando la prop "disabled" es true en el select', () => {
    render(<Select options={testOptions} disabled aria-label={testAriaLabel} onChange={() => {}} />);
    expect(screen.getByRole('combobox', { name: testAriaLabel })).toBeDisabled();
  });

  test('aplica la clase "error" y aria-invalid="true" cuando la prop "error" es true', () => {
    render(<Select options={testOptions} error aria-label={testAriaLabel} onChange={() => {}} />);
    const selectElement = screen.getByRole('combobox', { name: testAriaLabel });
    expect(selectElement).toHaveClass('select error'); // 'select' es la clase base
    expect(selectElement).toHaveAttribute('aria-invalid', 'true');
  });

  test('no aplica la clase "error" ni aria-invalid cuando "error" es false o no se proporciona', () => {
    const { rerender } = render(<Select options={testOptions} error={false} aria-label={testAriaLabel} onChange={() => {}} />);
    const selectElement = screen.getByRole('combobox', { name: testAriaLabel });
    expect(selectElement).not.toHaveClass('error');
    expect(selectElement.getAttribute('aria-invalid')).toBe('false');

    rerender(<Select options={testOptions} aria-label={testAriaLabel} onChange={() => {}} />);
    const selectDefault = screen.getByRole('combobox', { name: testAriaLabel });
    expect(selectDefault.getAttribute('aria-invalid')).toBe('false');
  });

  test('aplica clases CSS adicionales pasadas mediante className', () => {
    const customClass = 'mi-select-personalizado';
    render(<Select options={testOptions} className={customClass} aria-label={testAriaLabel} onChange={() => {}} />);
    expect(screen.getByRole('combobox', { name: testAriaLabel })).toHaveClass('select', customClass);
  });

  test('aplica aria-describedby correctamente', () => {
    const descriptionId = 'descripcion-select';
    render(
      <Select
        options={testOptions}
        aria-label={testAriaLabel}
        aria-describedby={descriptionId}
        onChange={() => {}}
      />
    );
    expect(screen.getByRole('combobox', { name: testAriaLabel })).toHaveAttribute('aria-describedby', descriptionId);
  });

  test('pasa atributos adicionales al elemento select', () => {
    render(
      <Select
        options={testOptions}
        aria-label={testAriaLabel}
        onChange={() => {}}
        data-testid="custom-select"
        name="opciones-lista"
      />
    );
    const selectElement = screen.getByTestId('custom-select');
    expect(selectElement).toBeInTheDocument();
    expect(selectElement).toHaveAttribute('name', 'opciones-lista');
  });

  test('renderiza sin opciones si options array está vacío', () => {
    render(<Select options={[]} aria-label={testAriaLabel} onChange={() => {}} />);
    const selectElement = screen.getByRole('combobox', { name: testAriaLabel });
    // eslint-disable-next-line testing-library/no-node-access
    expect(selectElement.children.length).toBe(0);
  });

  test('renderiza con una opción por defecto si no se pasa value y options no está vacío', () => {
    // El comportamiento estándar del select es seleccionar la primera opción si 'value' no coincide con ninguna.
    render(<Select options={testOptions} aria-label={testAriaLabel} onChange={() => {}} />);
    const selectElement = screen.getByRole('combobox', { name: testAriaLabel });
    expect(selectElement).toHaveValue(testOptions[0].value); // Debería tener el valor de la primera opción
  });
}); 