import { render, screen, fireEvent } from '@testing-library/react';
import Switch from './Switch';
import { vi } from 'vitest';

describe('Switch Component', () => {
  const testAriaLabel = 'Activar notificaciones';

  test('renderiza un input tipo checkbox dentro de un label', () => {
    render(<Switch aria-label={testAriaLabel} onChange={() => {}} />);
    const switchInput = screen.getByRole('checkbox', { name: testAriaLabel });
    expect(switchInput).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-node-access
    const labelElement = switchInput.closest('label');
    expect(labelElement).toBeInTheDocument();
    expect(labelElement).toHaveClass('switch');
    // eslint-disable-next-line testing-library/no-node-access
    expect(labelElement.querySelector('span.slider')).toBeInTheDocument();
  });

  test('refleja el estado "checked" (y aria-checked) correctamente', () => {
    render(<Switch checked={true} aria-label={testAriaLabel} onChange={() => {}} />);
    const switchInput = screen.getByRole('checkbox', { name: testAriaLabel });
    expect(switchInput).toBeChecked();
    expect(switchInput).toHaveAttribute('aria-checked', 'true');
  });

  test('refleja el estado "unchecked" (y aria-checked) correctamente', () => {
    render(<Switch checked={false} aria-label={testAriaLabel} onChange={() => {}} />);
    const switchInput = screen.getByRole('checkbox', { name: testAriaLabel });
    expect(switchInput).not.toBeChecked();
    expect(switchInput).toHaveAttribute('aria-checked', 'false');
  });

  test('llama a onChange cuando se hace click en el label (y por ende en el input)', () => {
    const mockOnChange = vi.fn();
    render(<Switch checked={false} onChange={mockOnChange} aria-label={testAriaLabel} />);
    const switchInput = screen.getByRole('checkbox', { name: testAriaLabel });
    // eslint-disable-next-line testing-library/no-node-access
    const labelElement = switchInput.closest('label');

    // Hacer clic en el label debería disparar el onChange del input anidado
    fireEvent.click(labelElement);
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    // El evento target.checked debería ser true
    expect(mockOnChange.mock.calls[0][0].target.checked).toBe(true);
  });

  test('no llama a onChange cuando está deshabilitado y se hace click', () => {
    const mockOnChange = vi.fn();
    render(<Switch disabled onChange={mockOnChange} aria-label={testAriaLabel} />);
    const switchInput = screen.getByRole('checkbox', { name: testAriaLabel });
    // eslint-disable-next-line testing-library/no-node-access
    const labelElement = switchInput.closest('label');

    fireEvent.click(labelElement);
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  test('está deshabilitado (input y label) cuando la prop "disabled" es true', () => {
    render(<Switch disabled aria-label={testAriaLabel} onChange={() => {}} />);
    const switchInput = screen.getByRole('checkbox', { name: testAriaLabel });
    expect(switchInput).toBeDisabled();
    // eslint-disable-next-line testing-library/no-node-access
    const labelElement = switchInput.closest('label');
    expect(labelElement).toHaveClass('switch disabled');
  });

  test('aplica la clase "error" al label y aria-invalid="true" al input cuando "error" es true', () => {
    render(<Switch error aria-label={testAriaLabel} onChange={() => {}} />);
    const switchInput = screen.getByRole('checkbox', { name: testAriaLabel });
    // eslint-disable-next-line testing-library/no-node-access
    const labelElement = switchInput.closest('label');

    expect(labelElement).toHaveClass('switch error');
    expect(switchInput).toHaveAttribute('aria-invalid', 'true');
  });

  test('no aplica clase "error" ni aria-invalid cuando "error" es false o no se proporciona', () => {
    const { rerender } = render(<Switch error={false} aria-label={testAriaLabel} onChange={() => {}} />);
    let switchInput = screen.getByRole('checkbox', { name: testAriaLabel });
    // eslint-disable-next-line testing-library/no-node-access
    let labelElement = switchInput.closest('label');
    expect(labelElement).not.toHaveClass('error');
    expect(switchInput.getAttribute('aria-invalid')).toBe('false');


    rerender(<Switch aria-label={testAriaLabel} onChange={() => {}} />);
    switchInput = screen.getByRole('checkbox', { name: testAriaLabel });
    // eslint-disable-next-line testing-library/no-node-access
    labelElement = switchInput.closest('label');
    expect(labelElement).not.toHaveClass('error');
    expect(switchInput.getAttribute('aria-invalid')).toBe('false'); // El componente lo setea a true o false
  });

  test('aplica clases CSS adicionales al elemento label', () => {
    const customClass = 'mi-switch-personalizado';
    render(<Switch className={customClass} aria-label={testAriaLabel} onChange={() => {}} />);
    const switchInput = screen.getByRole('checkbox', { name: testAriaLabel });
    // eslint-disable-next-line testing-library/no-node-access
    const labelElement = switchInput.closest('label');
    expect(labelElement).toHaveClass('switch', customClass);
  });

  test('pasa atributos adicionales al elemento input', () => {
    render(
      <Switch
        data-testid="custom-switch-input"
        name="notifications"
        aria-label={testAriaLabel}
        onChange={() => {}}
      />
    );
    const switchInput = screen.getByTestId('custom-switch-input');
    expect(switchInput).toBeInTheDocument();
    expect(switchInput).toHaveAttribute('name', 'notifications');
  });
}); 