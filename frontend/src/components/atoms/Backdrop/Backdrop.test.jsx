import { render, screen, fireEvent } from '@testing-library/react';
import Backdrop from './Backdrop';
import { vi } from 'vitest';

describe('Backdrop Component', () => {
  test('renderiza el backdrop correctamente', () => {
    render(<Backdrop>Contenido</Backdrop>);
    const backdropElement = screen.getByText('Contenido').closest('section');
    expect(backdropElement).toBeInTheDocument();
    // Asumiendo que 'backdrop' es la clase principal del módulo CSS
    expect(backdropElement).toHaveClass('backdrop');
  });

  test('renderiza children dentro del backdrop', () => {
    const childText = 'Este es un contenido hijo';
    render(
      <Backdrop>
        <div>{childText}</div>
      </Backdrop>
    );
    expect(screen.getByText(childText)).toBeInTheDocument();
  });

  test('llama a la función onClick cuando se hace click en el backdrop', () => {
    const mockOnClick = vi.fn();
    render(<Backdrop onClick={mockOnClick}>Click Me</Backdrop>);

    // Hacemos clic en el backdrop. Si tiene contenido, podemos hacer clic en el contenido
    // o directamente en el elemento section si es accesible de otra forma.
    // En este caso, el texto 'Click Me' está dentro, así que obtenemos el section a partir de ahí.
    const backdropElement = screen.getByText('Click Me').closest('section');
    fireEvent.click(backdropElement);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('no falla si onClick no se proporciona y se hace click', () => {
    render(<Backdrop>No onClick</Backdrop>);
    const backdropElement = screen.getByText('No onClick').closest('section');

    // Se espera que no lance un error
    expect(() => fireEvent.click(backdropElement)).not.toThrow();
  });

  test('pasa atributos adicionales al elemento section', () => {
    render(<Backdrop data-testid="custom-backdrop">Attr Test</Backdrop>);
    expect(screen.getByTestId('custom-backdrop')).toBeInTheDocument();
    expect(screen.getByText('Attr Test')).toBeInTheDocument(); // Asegurar que el contenido también se renderiza
  });
}); 