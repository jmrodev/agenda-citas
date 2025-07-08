import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import FileInput from './FileInput';

describe('FileInput Component', () => {
  test('renderiza el input de archivo con su etiqueta y maneja el cambio', () => {
    const mockOnChange = vi.fn();
    const labelText = "Seleccionar archivo";
    render(<FileInput label={labelText} onChange={mockOnChange} />);

    const fileInputElement = screen.getByLabelText(labelText);
    expect(fileInputElement).toBeInTheDocument();
    expect(fileInputElement).toHaveAttribute('type', 'file');

    const mockFile = new File(['dummy content'], 'example.png', { type: 'image/png' });
    // Simular la selección de un archivo
    fireEvent.change(fileInputElement, {
      target: { files: [mockFile] },
    });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    // Verificar que el mock fue llamado con el archivo correcto
    expect(mockOnChange.mock.calls[0][0].target.files[0]).toBe(mockFile);
    expect(mockOnChange.mock.calls[0][0].target.files.length).toBe(1);
  });

  test('renderiza sin etiqueta de texto visible si no se proporciona label, pero el input es accesible', () => {
    // El input en sí mismo no será accesible por un label de texto, pero sí por su data-testid.
    // El elemento <label> wrapper seguirá existiendo.
    const { container } = render(<FileInput onChange={() => {}} data-testid="custom-file-input" />);
    expect(screen.getByTestId('custom-file-input')).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const labelElement = container.querySelector('label');
    expect(labelElement).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-node-access
    expect(labelElement.querySelector('span')).toBeNull(); // No debería haber un span para el label
  });

  test('renderiza con testid por defecto "file-input" si no se proporciona data-testid', () => {
    render(<FileInput onChange={() => {}} />);
    expect(screen.getByTestId('file-input')).toBeInTheDocument();
  });

  test('acepta y aplica props como accept, multiple, disabled', () => {
    const labelText = "Test Input Múltiple";
    render(
      <FileInput
        label={labelText}
        onChange={() => {}}
        accept="image/*,.pdf"
        multiple
        disabled
      />
    );
    const fileInputElement = screen.getByLabelText(labelText);
    expect(fileInputElement).toHaveAttribute('accept', 'image/*,.pdf');
    expect(fileInputElement).toHaveAttribute('multiple');
    expect(fileInputElement).toBeDisabled();
  });

  test('se marca como aria-invalid="true" cuando la prop error es true', () => {
    const labelText = "Archivo con Error";
    render(<FileInput label={labelText} onChange={() => {}} error={true} />);
    const fileInputElement = screen.getByLabelText(labelText);
    expect(fileInputElement).toHaveAttribute('aria-invalid', 'true');
  });

  test('no tiene aria-invalid="true" cuando la prop error es false o no se proporciona', () => {
    const labelText = "Archivo OK";
    const { rerender } = render(<FileInput label={labelText} onChange={() => {}} />);
    const fileInputElementDefault = screen.getByLabelText(labelText);
    // Debería ser false o no estar el atributo. El componente lo setea explícitamente.
    expect(fileInputElementDefault).toHaveAttribute('aria-invalid', 'false');

    rerender(<FileInput label={labelText} onChange={() => {}} error={false} />);
    const fileInputElementErrorFalse = screen.getByLabelText(labelText);
    expect(fileInputElementErrorFalse).toHaveAttribute('aria-invalid', 'false');
  });

  test('aplica clases CSS adicionales al elemento label contenedor', () => {
    const customClass = 'mi-file-input-personalizado';
    const labelText = "Input con clase";
    render(<FileInput label={labelText} onChange={() => {}} className={customClass} />);
    // El input está dentro del label, así que buscamos el label por el texto del input.
    // O, si el label tiene su propio texto visible, por ese texto.
    // En este caso, el span con el texto del label está dentro del label.
    const labelElement = screen.getByText(labelText).closest('label');
    expect(labelElement).toHaveClass(customClass);
  });

  test('pasa atributos adicionales al elemento input', () => {
    const labelText = "Input con Attrs";
    render(<FileInput label={labelText} onChange={() => {}} name="upload" data-customattr="valor" />);
    const fileInputElement = screen.getByLabelText(labelText);
    expect(fileInputElement).toHaveAttribute('name', 'upload');
    expect(fileInputElement).toHaveAttribute('data-customattr', 'valor');
  });
}); 