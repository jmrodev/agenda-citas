import React from 'react';
import { render, screen } from '@testing-library/react';
import ModalFooter from './ModalFooter';

describe('ModalFooter Component', () => {
  test('renderiza children y aplica la clase "footer" al div contenedor', () => {
    const childrenContent = <button>Aceptar</button>;
    const { container } = render(<ModalFooter>{childrenContent}</ModalFooter>);

    // Verificar que los children se renderizan
    expect(screen.getByRole('button', { name: 'Aceptar' })).toBeInTheDocument();

    // Verificar el div contenedor
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const footerDiv = container.firstChild;
    expect(footerDiv.tagName).toBe('DIV');
    expect(footerDiv).toHaveClass('footer');
  });

  test('renderiza correctamente múltiples children', () => {
    render(
      <ModalFooter>
        <button>Cancelar</button>
        <button>Guardar</button>
      </ModalFooter>
    );
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Guardar' })).toBeInTheDocument();
  });

  test('renderiza un div vacío si no se proporcionan children', () => {
    const { container } = render(<ModalFooter />);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const footerDiv = container.firstChild;
    expect(footerDiv).toBeInTheDocument();
    expect(footerDiv).toHaveClass('footer');
    // eslint-disable-next-line testing-library/no-node-access
    expect(footerDiv.children.length).toBe(0);
  });

  // El componente actual no acepta className, style, ni ...rest.
  // Si se añadiera esa funcionalidad, se necesitarían tests como el siguiente:
  /*
  test('aplica className, style y otras props al div contenedor principal', () => {
    const customClass = "mi-pie-modal";
    const customStyle = { paddingTop: '10px' };
    const { container } = render(
      <ModalFooter
        className={customClass}
        style={customStyle}
        data-testid="custom-footer"
      >
        Contenido
      </ModalFooter>
    );
    const footerDiv = screen.getByTestId('custom-footer'); // Asumiendo que ...rest pasa data-testid
    expect(footerDiv).toHaveClass('footer', customClass);
    expect(footerDiv).toHaveStyle('padding-top: 10px;');
  });
  */
}); 