import { render, screen, fireEvent } from '@testing-library/react';
import Textarea from './Textarea';
import { vi } from 'vitest';

describe('Textarea Component', () => {
  const testPlaceholder = 'Escribe tu descripción aquí...';
  const testAriaLabel = 'Campo de descripción';

  test('renderiza un textarea con el placeholder correcto', () => {
    render(<Textarea placeholder={testPlaceholder} onChange={() => {}} aria-label={testAriaLabel} />);
    expect(screen.getByPlaceholderText(testPlaceholder)).toBeInTheDocument();
  });

  test('refleja el valor (value) proporcionado', () => {
    const testValue = 'Este es un texto largo.';
    render(<Textarea value={testValue} onChange={() => {}} aria-label={testAriaLabel} />);
    expect(screen.getByDisplayValue(testValue)).toBeInTheDocument();
  });

  test('llama a onChange con el nuevo valor cuando el usuario escribe', () => {
    const mockOnChange = vi.fn();
    const initialValue = "Texto inicial";
    render(<Textarea value={initialValue} onChange={mockOnChange} aria-label={testAriaLabel} />);
    const textareaElement = screen.getByLabelText(testAriaLabel);

    const newValue = "Texto inicial modificado";
    fireEvent.change(textareaElement, { target: { value: newValue } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange.mock.calls[0][0].target.value).toBe(newValue);
  });

  test('actualiza su valor visualmente cuando se escribe (simulando control externo)', () => {
    let textareaValue = "prueba";
    const handleChange = (e) => { textareaValue = e.target.value; };
    const { rerender } = render(<Textarea value={textareaValue} onChange={handleChange} aria-label={testAriaLabel} />);
    const textareaElement = screen.getByLabelText(testAriaLabel);

    fireEvent.change(textareaElement, { target: { value: 'nuevo valor de textarea' } });
    rerender(<Textarea value={textareaValue} onChange={handleChange} aria-label={testAriaLabel} />);
    expect(textareaElement.value).toBe('nuevo valor de textarea');
  });

  test('está deshabilitado cuando la prop "disabled" es true', () => {
    render(<Textarea disabled aria-label={testAriaLabel} onChange={() => {}} />);
    expect(screen.getByLabelText(testAriaLabel)).toBeDisabled();
  });

  test('aplica el atributo rows correctamente', () => {
    render(<Textarea rows={5} aria-label={testAriaLabel} onChange={() => {}} />);
    expect(screen.getByLabelText(testAriaLabel)).toHaveAttribute('rows', '5');
  });

  test('usa rows=3 por defecto', () => {
    render(<Textarea aria-label={testAriaLabel} onChange={() => {}} />);
    expect(screen.getByLabelText(testAriaLabel)).toHaveAttribute('rows', '3');
  });

  test('aplica la clase "error" y aria-invalid="true" cuando "error" es true', () => {
    render(<Textarea error aria-label={testAriaLabel} onChange={() => {}} />);
    const textareaElement = screen.getByLabelText(testAriaLabel);
    expect(textareaElement).toHaveClass('textarea error');
    expect(textareaElement).toHaveAttribute('aria-invalid', 'true');
  });

  test('no aplica clase "error" ni aria-invalid cuando "error" es false o no se proporciona', () => {
    const { rerender } = render(<Textarea error={false} aria-label={testAriaLabel} onChange={() => {}} />);
    let textareaElement = screen.getByLabelText(testAriaLabel);
    expect(textareaElement).not.toHaveClass('error');
    expect(textareaElement.getAttribute('aria-invalid')).toBe('false');

    rerender(<Textarea aria-label={testAriaLabel} onChange={() => {}} />);
    textareaElement = screen.getByLabelText(testAriaLabel);
    expect(textareaElement.getAttribute('aria-invalid')).toBe('false');
  });

  test('aplica la clase base "textarea" y clases CSS adicionales', () => {
    const customClass = 'mi-textarea-personalizada';
    render(<Textarea className={customClass} aria-label={testAriaLabel} onChange={() => {}} />);
    const textareaElement = screen.getByLabelText(testAriaLabel);
    expect(textareaElement).toHaveClass('textarea', customClass);
  });

  test('aplica aria-label y aria-describedby correctamente', () => {
    const descriptionId = 'descripcion-textarea';
    render(
      <Textarea
        aria-label={testAriaLabel}
        aria-describedby={descriptionId}
        onChange={() => {}}
      />
    );
    const textareaElement = screen.getByLabelText(testAriaLabel);
    expect(textareaElement).toBeInTheDocument();
    expect(textareaElement).toHaveAttribute('aria-describedby', descriptionId);
  });

  test('pasa atributos adicionales al elemento textarea', () => {
    render(
      <Textarea
        aria-label={testAriaLabel}
        onChange={() => {}}
        data-testid="custom-textarea"
        maxLength={200}
        name="description"
      />
    );
    const textareaElement = screen.getByTestId('custom-textarea');
    expect(textareaElement).toBeInTheDocument();
    expect(textareaElement).toHaveAttribute('maxLength', '200');
    expect(textareaElement).toHaveAttribute('name', 'description');
  });

  test('renderiza con valor inicial undefined o null como vacío', () => {
    const { rerender } = render(<Textarea value={undefined} onChange={() => {}} aria-label={testAriaLabel} />);
    let textareaElement = screen.getByLabelText(testAriaLabel);
    // Cuando value es undefined, el textarea en React se considera no controlado inicialmente,
    // pero el componente Textarea lo pasa como value={undefined}, lo que resulta en un string vacío.
    expect(textareaElement).toHaveValue('');

    rerender(<Textarea value={null} onChange={() => {}} aria-label={testAriaLabel} />);
    textareaElement = screen.getByLabelText(testAriaLabel);
     // null también se trata como vacío para el value de textarea.
    expect(textareaElement).toHaveValue('');
  });
}); 