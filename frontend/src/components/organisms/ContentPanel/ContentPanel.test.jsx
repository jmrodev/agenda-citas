import { render, screen } from '@testing-library/react';
import ContentPanel from './ContentPanel';

describe('ContentPanel', () => {
  test('renders children correctly', () => {
    render(
      <ContentPanel>
        <div data-testid="child-div">Contenido de prueba</div>
        <p>Otro contenido</p>
      </ContentPanel>
    );

    // Verificar que el div hijo está presente
    expect(screen.getByTestId('child-div')).toBeInTheDocument();
    expect(screen.getByText('Contenido de prueba')).toBeInTheDocument();
    expect(screen.getByText('Otro contenido')).toBeInTheDocument();
  });

  test('applies the correct CSS class', () => {
    const { container } = render(
      <ContentPanel>
        <div>Hola</div>
      </ContentPanel>
    );
    // El contenedor directo del ContentPanel debería tener la clase CSS
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    expect(container.firstChild).toHaveClass(expect.stringContaining('contentPanel'));
  });

  test('renders without children', () => {
    const { container } = render(<ContentPanel />);
    // Debería renderizar el div principal sin errores, aunque esté vacío
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    expect(container.firstChild).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    expect(container.firstChild).toHaveClass(expect.stringContaining('contentPanel'));
  });
});
