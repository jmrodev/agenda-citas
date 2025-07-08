import { render, screen } from '@testing-library/react';
import ProgressBar from './ProgressBar';

describe('ProgressBar Component', () => {
  test('renderiza el span interno con rol "progressbar" y atributos ARIA correctos', () => {
    render(<ProgressBar value={50} />);
    const progressBarElement = screen.getByRole('progressbar');
    expect(progressBarElement).toBeInTheDocument();
    expect(progressBarElement).toHaveAttribute('aria-valuenow', '50');
    expect(progressBarElement).toHaveAttribute('aria-valuemin', '0');
    expect(progressBarElement).toHaveAttribute('aria-valuemax', '100');
  });

  test('aplica el estilo de ancho (width) correctamente basado en el valor', () => {
    render(<ProgressBar value={75} />);
    const progressBarElement = screen.getByRole('progressbar');
    expect(progressBarElement).toHaveStyle('width: 75%');
  });

  test('limita el valor a un mínimo de 0 (safeValue)', () => {
    render(<ProgressBar value={-10} />);
    const progressBarElement = screen.getByRole('progressbar');
    expect(progressBarElement).toHaveStyle('width: 0%');
    expect(progressBarElement).toHaveAttribute('aria-valuenow', '0');
  });

  test('limita el valor a un máximo de 100 (safeValue)', () => {
    render(<ProgressBar value={150} />);
    const progressBarElement = screen.getByRole('progressbar');
    expect(progressBarElement).toHaveStyle('width: 100%');
    expect(progressBarElement).toHaveAttribute('aria-valuenow', '100');
  });

  test('aplica clases de tamaño "md" al contenedor y color "primary" a la barra por defecto', () => {
    render(<ProgressBar value={50} />);
    const progressBarElement = screen.getByRole('progressbar');
    // El contenedor <section> tiene la clase de tamaño
    // eslint-disable-next-line testing-library/no-node-access
    const containerElement = progressBarElement.parentElement;
    expect(containerElement).toHaveClass('progressBar md');
    // La barra <span> interna tiene la clase de color
    expect(progressBarElement).toHaveClass('bar primary');
  });

  test('aplica clases de tamaño específicas al contenedor', () => {
    render(<ProgressBar value={50} size="sm" />);
    const progressBarElement = screen.getByRole('progressbar');
    // eslint-disable-next-line testing-library/no-node-access
    const containerElement = progressBarElement.parentElement;
    expect(containerElement).toHaveClass('progressBar sm');
  });

  test('aplica clases de color específicas a la barra', () => {
    render(<ProgressBar value={50} color="success" />);
    const progressBarElement = screen.getByRole('progressbar');
    expect(progressBarElement).toHaveClass('bar success');
  });

  test('maneja tamaño y color no definidos en estilos usando los por defecto', () => {
    render(<ProgressBar value={50} size="xlarge" color="transparent" />);
    const progressBarElement = screen.getByRole('progressbar');
    // eslint-disable-next-line testing-library/no-node-access
    const containerElement = progressBarElement.parentElement;
    expect(containerElement).toHaveClass('progressBar'); // Solo la clase base, sin clase de tamaño no existente
    expect(containerElement).not.toHaveClass('xlarge');

    expect(progressBarElement).toHaveClass('bar'); // Solo la clase base, sin clase de color no existente
    expect(progressBarElement).not.toHaveClass('transparent');

    // Verificar que los fallbacks de clase CSS (si existen) o los valores por defecto de prop se aplican
    // En este caso, si 'xlarge' no es una clase válida, styles[size] será undefined, por lo que no se añade clase de tamaño.
    // El componente tiene size='md' por defecto, así que la clase 'md' SÍ se aplicará.
    // Similar para color='primary'.
    expect(containerElement).toHaveClass('md'); // Clase por defecto de la prop size
    expect(progressBarElement).toHaveClass('primary'); // Clase por defecto de la prop color
  });

  test('aplica clases CSS adicionales al contenedor principal', () => {
    const customClass = 'mi-progreso-personalizado';
    render(<ProgressBar value={30} className={customClass} />);
    const progressBarElement = screen.getByRole('progressbar');
    // eslint-disable-next-line testing-library/no-node-access
    const containerElement = progressBarElement.parentElement;
    expect(containerElement).toHaveClass('progressBar md', customClass);
  });

  test('pasa atributos adicionales al contenedor principal (section)', () => {
    render(<ProgressBar value={20} data-testid="custom-progress-container" title="Progreso actual" />);
    // El elemento con el rol 'progressbar' es el span interno.
    // El data-testid se pasa al contenedor <section>.
    const containerElement = screen.getByTestId('custom-progress-container');
    expect(containerElement).toBeInTheDocument();
    expect(containerElement).toHaveAttribute('title', 'Progreso actual');
    // eslint-disable-next-line testing-library/no-node-access
    expect(containerElement.firstChild).toHaveAttribute('role', 'progressbar'); // Asegurar que el hijo es la barra
  });
}); 