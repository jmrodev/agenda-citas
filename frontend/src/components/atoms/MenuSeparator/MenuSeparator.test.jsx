import { render, screen } from '@testing-library/react';
import MenuSeparator from './MenuSeparator';

describe('MenuSeparator Component', () => {
  test('renderiza un elemento hr con la clase "separator"', () => {
    render(<MenuSeparator />);
    // Los elementos <hr> tienen un rol implícito de 'separator'
    const separatorElement = screen.getByRole('separator');
    expect(separatorElement).toBeInTheDocument();
    expect(separatorElement.tagName).toBe('HR');
    expect(separatorElement).toHaveClass('separator');
  });

  test('no acepta children ni otras props directamente (es un componente simple)', () => {
    // Este test es más para documentar la naturaleza del componente.
    // No se espera que falle si se le pasan props, pero estas no tendrán efecto en el renderizado
    // a menos que el componente sea modificado para usarlas.
    const { container } = render(
      <MenuSeparator data-testid="sep-con-props-no-usadas" className="extra-class">
        {/* @ts-expect-error MenuSeparator no acepta children */}
        Contenido inesperado
      </MenuSeparator>
    );

    const separatorElement = screen.getByRole('separator');
    expect(separatorElement).toBeInTheDocument();
    // La clase 'extra-class' no se aplicará porque el componente no la propaga.
    expect(separatorElement).not.toHaveClass('extra-class');
    // El contenido 'Contenido inesperado' no se renderizará.
    expect(screen.queryByText('Contenido inesperado')).not.toBeInTheDocument();
    // El data-testid tampoco se aplicará al hr.
    expect(screen.queryByTestId("sep-con-props-no-usadas")).toBeNull();
    // El hr renderizado es el que se espera.
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    expect(container.querySelector('hr.separator')).toBe(separatorElement);
  });
}); 