import { render, screen, fireEvent } from '@testing-library/react';
import Input from './Input';
import { vi } from 'vitest';

describe('Input Component', () => {
  const testPlaceholder = 'Ingrese texto aquí';

  test('renderiza un input con el placeholder correcto', () => {
    render(<Input placeholder={testPlaceholder} onChange={() => {}} />);
    expect(screen.getByPlaceholderText(testPlaceholder)).toBeInTheDocument();
  });

  test('refleja el valor (value) proporcionado', () => {
    const testValue = 'Texto inicial';
    render(<Input value={testValue} onChange={() => {}} />);
    // Para inputs, se accede al valor a través de la propiedad .value o displayValue
    expect(screen.getByDisplayValue(testValue)).toBeInTheDocument();
  });

  test('llama a onChange con el nuevo valor cuando el usuario escribe', () => {
    const mockOnChange = vi.fn();
    const initialValue = "abc";
    render(<Input value={initialValue} onChange={mockOnChange} placeholder={testPlaceholder} />);
    const inputElement = screen.getByPlaceholderText(testPlaceholder);

    fireEvent.change(inputElement, { target: { value: 'abcd' } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    // El mock es llamado con el evento. El valor está en event.target.value
    expect(mockOnChange.mock.calls[0][0].target.value).toBe('abcd');
  });

  test('actualiza su valor visualmente cuando se escribe (si es un input no controlado directamente en el test)', () => {
    // Este test es más para verificar el comportamiento del DOM si el componente no fuera estrictamente controlado por React en el test.
    // Para un componente controlado, el valor solo cambia si la prop 'value' cambia.
    // El test 'llama a onChange...' ya cubre la parte del evento.
    // Para probar el cambio visual, necesitaríamos un estado local o que el componente maneje su propio estado, lo cual no hace.
    // Si quisiéramos simular un input no controlado que actualiza su .value directamente:
    let inputValue = "test";
    const handleChange = (e) => { inputValue = e.target.value; };
    const { rerender } = render(<Input value={inputValue} onChange={handleChange} placeholder={testPlaceholder} />);
    const inputElement = screen.getByPlaceholderText(testPlaceholder);

    fireEvent.change(inputElement, { target: { value: 'nuevo valor' } });
    // inputValue se actualiza por handleChange
    rerender(<Input value={inputValue} onChange={handleChange} placeholder={testPlaceholder} />);
    expect(inputElement.value).toBe('nuevo valor');
  });


  test('acepta diferentes tipos de input, por ejemplo "password"', () => {
    render(<Input type="password" placeholder="Contraseña" onChange={() => {}} />);
    const inputElement = screen.getByPlaceholderText('Contraseña');
    expect(inputElement).toHaveAttribute('type', 'password');
  });

  test('está deshabilitado cuando la prop "disabled" es true', () => {
    render(<Input disabled placeholder={testPlaceholder} onChange={() => {}} />);
    expect(screen.getByPlaceholderText(testPlaceholder)).toBeDisabled();
  });

  test('es requerido cuando la prop "required" es true', () => {
    render(<Input required placeholder={testPlaceholder} onChange={() => {}} />);
    expect(screen.getByPlaceholderText(testPlaceholder)).toBeRequired();
  });

  test('aplica la clase base "input" y clases CSS adicionales', () => {
    const customClass = 'mi-input-personalizado';
    render(<Input className={customClass} placeholder={testPlaceholder} onChange={() => {}} />);
    const inputElement = screen.getByPlaceholderText(testPlaceholder);
    expect(inputElement).toHaveClass('input', customClass);
  });

  test('aplica aria-label correctamente', () => {
    const labelText = 'Nombre de usuario';
    render(<Input aria-label={labelText} onChange={() => {}} />);
    expect(screen.getByLabelText(labelText)).toBeInTheDocument();
  });

  test('pasa atributos adicionales al elemento input', () => {
    render(
      <Input
        placeholder={testPlaceholder}
        onChange={() => {}}
        data-testid="custom-input"
        maxLength={50}
        name="username"
      />
    );
    const inputElement = screen.getByTestId('custom-input');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('maxLength', '50');
    expect(inputElement).toHaveAttribute('name', 'username');
    expect(screen.getByPlaceholderText(testPlaceholder)).toBe(inputElement);
  });

  test('renderiza con valor inicial vacío por defecto', () => {
    render(<Input onChange={() => {}} placeholder={testPlaceholder} />);
    expect(screen.getByPlaceholderText(testPlaceholder)).toHaveValue('');
  });
}); 