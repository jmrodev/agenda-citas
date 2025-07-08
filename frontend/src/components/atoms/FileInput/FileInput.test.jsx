import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import FileInput from './FileInput';

describe('FileInput', () => {
  test('renderiza el input de archivo con su etiqueta y maneja el cambio', () => {
    const mockOnChange = vi.fn();
    const labelText = "Seleccionar archivo";
    render(<FileInput label={labelText} onChange={mockOnChange} />);

    const fileInputElement = screen.getByLabelText(labelText);
    expect(fileInputElement).toBeInTheDocument();
    expect(fileInputElement).toHaveAttribute('type', 'file');

    const mockFile = new File(['dummy content'], 'example.png', { type: 'image/png' });
    fireEvent.change(fileInputElement, {
      target: { files: [mockFile] },
    });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    // Check if the event passed to mockOnChange has the correct file
    expect(mockOnChange.mock.calls[0][0].target.files[0]).toBe(mockFile);
    expect(mockOnChange.mock.calls[0][0].target.files.length).toBe(1);
  });

  test('renderiza sin etiqueta visible y se puede encontrar por testid', () => {
    render(<FileInput onChange={() => {}} data-testid="custom-file-input" />);
    // The component now adds a default data-testid="file-input" or uses the one provided
    expect(screen.getByTestId('custom-file-input')).toBeInTheDocument();
  });

  test('renderiza con testid por defecto si no se proporciona uno', () => {
    render(<FileInput onChange={() => {}} />);
    expect(screen.getByTestId('file-input')).toBeInTheDocument();
  });

  test('acepta props como accept, multiple, disabled', () => {
    const labelText = "Test Input";
    render(
      <FileInput
        label={labelText}
        onChange={() => {}}
        accept="image/*"
        multiple
        disabled
      />
    );
    const fileInputElement = screen.getByLabelText(labelText);
    expect(fileInputElement).toHaveAttribute('accept', 'image/*');
    expect(fileInputElement).toBeDisabled();
    expect(fileInputElement).toHaveAttribute('multiple');
  });

  test('se marca como aria-invalid cuando error es true', () => {
    const labelText = "Archivo con error";
    render(<FileInput label={labelText} onChange={() => {}} error={true} />);
    const fileInputElement = screen.getByLabelText(labelText);
    expect(fileInputElement).toHaveAttribute('aria-invalid', 'true');
  });

  test('no es aria-invalid cuando error no se pasa o es false', () => {
    const labelText = "Archivo sin error";
    const { rerender } = render(<FileInput label={labelText} onChange={() => {}} />);
    const fileInputElement = screen.getByLabelText(labelText);
    expect(fileInputElement).not.toHaveAttribute('aria-invalid');
    // also test with error={false}
    rerender(<FileInput label={labelText} onChange={() => {}} error={false} />);
    expect(screen.getByLabelText(labelText)).not.toHaveAttribute('aria-invalid');
  });
}); 