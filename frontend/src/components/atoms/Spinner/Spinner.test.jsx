import { render, screen } from '@testing-library/react';
import Spinner from './Spinner';

describe('Spinner Component', () => {
  const defaultAriaLabel = 'Cargando...';

  test('renderiza un span con rol "status" y aria-label por defecto', () => {
    render(<Spinner />);
    const spinnerElement = screen.getByRole('status', { name: defaultAriaLabel });
    expect(spinnerElement).toBeInTheDocument();
    expect(spinnerElement.tagName).toBe('SPAN');
  });

  test('contiene un span visualmente oculto con el texto del aria-label', () => {
    render(<Spinner />);
    const spinnerElement = screen.getByRole('status', { name: defaultAriaLabel });
    // eslint-disable-next-line testing-library/no-node-access
    const hiddenSpan = spinnerElement.querySelector('span.visuallyHidden');
    expect(hiddenSpan).toBeInTheDocument();
    expect(hiddenSpan).toHaveTextContent(defaultAriaLabel);
  });

  test('acepta un aria-label personalizado', () => {
    const customLabel = "Procesando su solicitud";
    render(<Spinner aria-label={customLabel} />);
    const spinnerElement = screen.getByRole('status', { name: customLabel });
    expect(spinnerElement).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-node-access
    const hiddenSpan = spinnerElement.querySelector('span.visuallyHidden');
    expect(hiddenSpan).toHaveTextContent(customLabel);
  });

  test('aplica tamaño (size) a través de estilos inline y color a través de clases', () => {
    const testSize = 48;
    render(<Spinner size={testSize} color="secondary" />);
    const spinnerElement = screen.getByRole('status');

    expect(spinnerElement).toHaveStyle(`width: ${testSize}px`);
    expect(spinnerElement).toHaveStyle(`height: ${testSize}px`);
    // Clases: base 'spinner' y color 'secondary'
    expect(spinnerElement).toHaveClass('spinner secondary');
  });

  test('usa tamaño 32 y color "primary" por defecto', () => {
    render(<Spinner />);
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveStyle('width: 32px');
    expect(spinnerElement).toHaveStyle('height: 32px');
    expect(spinnerElement).toHaveClass('spinner primary');
  });

  test('maneja color no definido en estilos usando la clase base (o el color por defecto "primary")', () => {
    render(<Spinner color="unknownColor" />);
    const spinnerElement = screen.getByRole('status');
    // styles[color] || '' resultará en ''. La clase 'primary' se aplica por el valor por defecto de la prop.
    expect(spinnerElement).toHaveClass('spinner primary');
    expect(spinnerElement).not.toHaveClass('unknownColor');
  });

  test('aplica clases CSS adicionales pasadas mediante className', () => {
    const customClass = 'mi-spinner-especial';
    render(<Spinner className={customClass} />);
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toHaveClass('spinner primary', customClass);
  });

  test('pasa atributos adicionales al elemento span principal', () => {
    render(<Spinner data-testid="custom-spinner" title="Esperando datos" />);
    const spinnerElement = screen.getByTestId('custom-spinner');
    expect(spinnerElement).toBeInTheDocument();
    expect(spinnerElement).toHaveAttribute('title', 'Esperando datos');
    // Asegurar que sigue siendo el elemento con rol status
    expect(screen.getByRole('status', { name: defaultAriaLabel })).toBe(spinnerElement);
  });
}); 