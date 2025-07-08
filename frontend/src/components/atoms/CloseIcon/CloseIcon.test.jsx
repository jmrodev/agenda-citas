import { render, screen, fireEvent } from '@testing-library/react';
import CloseIcon from './CloseIcon';
import { vi } from 'vitest';

describe('CloseIcon Component', () => {
  test('renderiza un botón con el aria-label "Cerrar"', () => {
    render(<CloseIcon onClick={() => {}} />);
    const buttonElement = screen.getByRole('button', { name: 'Cerrar' });
    expect(buttonElement).toBeInTheDocument();
  });

  test('contiene un elemento SVG para el icono', () => {
    render(<CloseIcon onClick={() => {}} />);
    const buttonElement = screen.getByRole('button', { name: 'Cerrar' });
    // eslint-disable-next-line testing-library/no-node-access
    const svgElement = buttonElement.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
    // Opcionalmente, se pueden verificar atributos específicos del SVG si son importantes
    expect(svgElement).toHaveAttribute('width', '24');
    expect(svgElement).toHaveAttribute('height', '24');
  });

  test('llama a la función onClick cuando se hace click en el botón', () => {
    const mockOnClick = vi.fn();
    render(<CloseIcon onClick={mockOnClick} />);
    const buttonElement = screen.getByRole('button', { name: 'Cerrar' });
    fireEvent.click(buttonElement);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('aplica la clase base "closeButton" al botón', () => {
    render(<CloseIcon onClick={() => {}} />);
    const buttonElement = screen.getByRole('button', { name: 'Cerrar' });
    expect(buttonElement).toHaveClass('closeButton');
  });

  test('no falla si onClick no se proporciona (aunque el componente lo requiere por prop-types o TS)', () => {
    // Este test es para verificar la robustez, aunque idealmente onClick siempre se pasaría.
    // Si el componente está escrito en JS y no hay chequeo de tipos, podría ocurrir.
    // Si onClick es obligatorio por TS/PropTypes, este test podría ser menos relevante o fallar en la renderización.
    // Asumiendo que el componente simplemente no haría nada o podría incluso fallar si onClick fuera vital y no chequeado.
    // Dado el código actual, onClick se pasa directamente al <button>, por lo que si es undefined, no hay error al hacer click.
    render(<CloseIcon onClick={undefined} />);
    const buttonElement = screen.getByRole('button', { name: 'Cerrar' });
    expect(() => fireEvent.click(buttonElement)).not.toThrow();
  });

  // El componente CloseIcon no acepta className o ...rest directamente en su definición actual.
  // Si se quisiera que los aceptara, habría que modificar el componente.
  // Por ahora, no se testean esas props ya que no son manejadas.
}); 