import { render, screen } from '@testing-library/react';
import Label from './Label';

describe('Label Component', () => {
  const labelText = 'Nombre de Usuario';
  const inputId = 'username-input';

  test('renderiza el texto (children) del label', () => {
    render(<Label htmlFor={inputId}>{labelText}</Label>);
    expect(screen.getByText(labelText)).toBeInTheDocument();
  });

  test('aplica el atributo htmlFor correctamente', () => {
    render(<Label htmlFor={inputId}>{labelText}</Label>);
    const labelElement = screen.getByText(labelText);
    expect(labelElement).toHaveAttribute('for', inputId);
  });

  test('renderiza como un elemento label', () => {
    render(<Label htmlFor={inputId}>{labelText}</Label>);
    const labelElement = screen.getByText(labelText);
    expect(labelElement.tagName).toBe('LABEL');
  });

  test('aplica la clase base "label"', () => {
    render(<Label htmlFor={inputId}>{labelText}</Label>);
    const labelElement = screen.getByText(labelText);
    expect(labelElement).toHaveClass('label');
  });

  test('aplica clases CSS adicionales pasadas mediante className', () => {
    const customClass = 'mi-label-personalizado';
    render(<Label htmlFor={inputId} className={customClass}>{labelText}</Label>);
    const labelElement = screen.getByText(labelText);
    expect(labelElement).toHaveClass('label', customClass);
  });

  test('pasa atributos adicionales al elemento label', () => {
    render(
      <Label htmlFor={inputId} data-testid="custom-label" title="Etiqueta para el nombre">
        {labelText}
      </Label>
    );
    const labelElement = screen.getByTestId('custom-label');
    expect(labelElement).toBeInTheDocument();
    expect(labelElement).toHaveAttribute('title', 'Etiqueta para el nombre');
    expect(screen.getByText(labelText)).toBe(labelElement); // Asegurar que es el mismo elemento
  });

  test('renderiza correctamente sin htmlFor si es un caso de uso válido (aunque no es lo común)', () => {
    // Un label sin htmlFor puede usarse si el input está anidado dentro.
    // Pero este componente Label no está diseñado para anidar inputs directamente.
    // Aun así, no debería fallar si htmlFor no se pasa.
    render(<Label data-testid="label-no-for">{labelText}</Label>);
    const labelElement = screen.getByTestId('label-no-for');
    expect(labelElement).toBeInTheDocument();
    expect(labelElement).not.toHaveAttribute('for');
  });

  test('renderiza correctamente sin hijos (children) si es un caso válido', () => {
    // Un label sin texto visible es raro, pero podría usarse con aria-label en un input,
    // o si el contenido se añade de otra forma (no es el caso aquí).
    render(<Label htmlFor={inputId} data-testid="empty-label" />);
    const labelElement = screen.getByTestId('empty-label');
    expect(labelElement).toBeInTheDocument();
    expect(labelElement).toHaveTextContent('');
  });
}); 