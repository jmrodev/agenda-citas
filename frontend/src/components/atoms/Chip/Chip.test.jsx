import { render, screen, fireEvent } from '@testing-library/react';
import Chip from './Chip';
import { vi } from 'vitest';

// Mock del componente Icon para simplificar los tests del Chip
vi.mock('../Icon/Icon', () => ({
  default: ({ name, size, className, 'aria-label': ariaLabel }) => (
    <svg data-testid={`icon-${name}`} className={className} aria-label={ariaLabel} width={size} height={size} />
  ),
}));

describe('Chip Component', () => {
  const chipText = 'Etiqueta';

  test('renderiza el texto (children) del chip dentro del span de etiqueta', () => {
    render(<Chip>{chipText}</Chip>);
    // El texto está dentro de un span con clase 'label'
    const labelSpan = screen.getByText(chipText);
    expect(labelSpan).toBeInTheDocument();
    expect(labelSpan).toHaveClass('label');
    // El span general del chip
    expect(labelSpan.closest('span.chip')).toBeInTheDocument();
  });

  test('aplica el color "primary" y tamaño "md" por defecto', () => {
    render(<Chip>{chipText}</Chip>);
    const chipElement = screen.getByText(chipText).closest('span.chip');
    expect(chipElement).toHaveClass('chip primary md');
  });

  test('aplica un color específico, por ejemplo "success"', () => {
    render(<Chip color="success">{chipText}</Chip>);
    const chipElement = screen.getByText(chipText).closest('span.chip');
    expect(chipElement).toHaveClass('chip success md');
  });

  test('aplica un tamaño específico, por ejemplo "sm"', () => {
    render(<Chip size="sm">{chipText}</Chip>);
    const chipElement = screen.getByText(chipText).closest('span.chip');
    expect(chipElement).toHaveClass('chip primary sm');
  });

  test('renderiza un icono cuando se proporciona la prop "icon"', () => {
    const iconName = 'star';
    render(<Chip icon={iconName}>{chipText}</Chip>);
    expect(screen.getByTestId(`icon-${iconName}`)).toBeInTheDocument();
    // Verificar que el icono tiene la clase correcta dentro del chip
    expect(screen.getByTestId(`icon-${iconName}`)).toHaveClass('icon');
  });

  test('no renderiza un icono si no se proporciona la prop "icon"', () => {
    render(<Chip>{chipText}</Chip>);
    expect(screen.queryByLabelText('icono')).not.toBeInTheDocument(); // El aria-label del icono
    expect(screen.queryByTestId(/icon-/)).not.toBeInTheDocument();
  });

  test('renderiza un botón de cierre cuando se proporciona la prop "onClose"', () => {
    const mockOnClose = vi.fn();
    render(<Chip onClose={mockOnClose}>{chipText}</Chip>);
    const closeButton = screen.getByRole('button', { name: 'Cerrar' });
    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toHaveClass('close');
    expect(screen.getByTestId('icon-close')).toBeInTheDocument(); // Icono dentro del botón
  });

  test('llama a onClose cuando se hace click en el botón de cerrar', () => {
    const mockOnClose = vi.fn();
    render(<Chip onClose={mockOnClose}>{chipText}</Chip>);
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar' }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('no renderiza el botón de cerrar si no se proporciona onClose', () => {
    render(<Chip>{chipText}</Chip>);
    expect(screen.queryByRole('button', { name: 'Cerrar' })).not.toBeInTheDocument();
  });

  test('aplica clases CSS adicionales pasadas mediante className', () => {
    const customClass = 'mi-chip-personalizado';
    render(<Chip className={customClass}>{chipText}</Chip>);
    const chipElement = screen.getByText(chipText).closest('span.chip');
    expect(chipElement).toHaveClass('chip primary md', customClass);
  });

  test('pasa atributos adicionales al elemento span principal del chip', () => {
    render(<Chip data-testid="custom-chip" title="Información adicional">{chipText}</Chip>);
    const chipElement = screen.getByTestId('custom-chip');
    expect(chipElement).toBeInTheDocument();
    expect(chipElement).toHaveAttribute('title', 'Información adicional');
    // Asegurar que el texto sigue estando
    expect(screen.getByText(chipText)).toBeInTheDocument();
  });

  test('renderiza correctamente sin hijos (children), mostrando solo icono y/o cierre si están definidos', () => {
    const mockOnClose = vi.fn();
    render(<Chip icon="info" onClose={mockOnClose} aria-label="Chip informativo cerrable sin texto" />);

    const chipElement = screen.getByRole('generic').closest('span.chip'); // El span principal del chip
    expect(chipElement).toBeInTheDocument();
    expect(chipElement).toHaveAttribute('aria-label', "Chip informativo cerrable sin texto");

    expect(screen.getByTestId('icon-info')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cerrar' })).toBeInTheDocument();

    // El span con clase 'label' debería estar vacío o no existir si no hay children
    // Depende de la implementación, aquí el span.label se renderiza vacío.
    const labelSpan = chipElement.querySelector('.label');
    expect(labelSpan).toBeInTheDocument();
    expect(labelSpan).toHaveTextContent('');
  });
}); 