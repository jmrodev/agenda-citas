import { render, screen } from '@testing-library/react';
import Loader from './Loader';

describe('Loader Component', () => {
  const defaultLoadingText = 'Cargando...';

  test('renderiza el spinner con rol "status" y aria-label por defecto', () => {
    render(<Loader />);
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toBeInTheDocument();
    expect(spinnerElement).toHaveAttribute('aria-label', 'Cargando');
    expect(spinnerElement).toHaveClass('spinner medium primary'); // Clases por defecto
  });

  test('renderiza el texto de carga por defecto', () => {
    render(<Loader />);
    expect(screen.getByText(defaultLoadingText)).toBeInTheDocument();
    expect(screen.getByText(defaultLoadingText)).toHaveClass('text');
  });

  test('renderiza un texto de carga personalizado', () => {
    const customText = 'Procesando datos...';
    render(<Loader text={customText} />);
    expect(screen.getByText(customText)).toBeInTheDocument();
  });

  test('no renderiza el span de texto si la prop text es null o una cadena vacía', () => {
    const { rerender } = render(<Loader text={null} />);
    expect(screen.queryByText(defaultLoadingText)).not.toBeInTheDocument(); // Texto por defecto no debería estar
    // Verificar que el span con la clase 'text' no existe
    // eslint-disable-next-line testing-library/no-container
    expect(render(<Loader text={null} />).container.querySelector(`.${'text'}`)).not.toBeInTheDocument();


    rerender(<Loader text="" />);
    // eslint-disable-next-line testing-library/no-container
    expect(render(<Loader text="" />).container.querySelector(`.${'text'}`)).not.toBeInTheDocument();
  });

  test('aplica clases de tamaño correctamente al spinner', () => {
    render(<Loader size="large" />);
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('spinner large primary'); // 'large' de la prop, 'primary' por defecto
  });

  test('aplica clases de color correctamente al spinner', () => {
    render(<Loader color="secondary" />);
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('spinner medium secondary'); // 'secondary' de la prop, 'medium' por defecto
  });

  test('aplica tamaño y color no definidos en estilos usando los por defecto', () => {
    render(<Loader size="extra-large" color="transparent" />);
    const spinnerElement = screen.getByRole('status');
    // Debería usar las clases por defecto 'medium' y 'primary' porque 'extra-large' y 'transparent' no están en styles
    expect(spinnerElement).toHaveClass('spinner medium primary');
    expect(spinnerElement).not.toHaveClass('extra-large');
    expect(spinnerElement).not.toHaveClass('transparent');
  });

  test('el contenedor principal tiene atributos aria-busy="true" y aria-live="polite"', () => {
    render(<Loader />);
    // El spinner está dentro de una sección. Necesitamos obtener esa sección.
    // Podemos buscar por el rol del spinner y luego ir a su padre.
    const spinnerElement = screen.getByRole('status');
    const containerElement = spinnerElement.parentElement; // Asumiendo que el spinner es hijo directo

    expect(containerElement).toHaveAttribute('aria-busy', 'true');
    expect(containerElement).toHaveAttribute('aria-live', 'polite');
    expect(containerElement).toHaveClass('loaderContainer');
  });

  // El componente Loader no acepta className directamente en su contenedor o spinner,
  // ni pasa ...rest. Si se necesitara, habría que modificar el componente.
}); 