import { render, screen } from '@testing-library/react';
import Link from './Link';

describe('Link Component', () => {
  const linkText = 'Ir a la Página';
  const testHref = '/ruta/prueba';

  test('renderiza el texto (children) y el atributo href', () => {
    render(<Link href={testHref}>{linkText}</Link>);
    const linkElement = screen.getByRole('link', { name: linkText });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', testHref);
  });

  test('usa "#" como href por defecto si no se proporciona', () => {
    render(<Link>{linkText}</Link>);
    const linkElement = screen.getByRole('link', { name: linkText });
    expect(linkElement).toHaveAttribute('href', '#');
  });

  test('aplica target="_blank" y rel="noopener noreferrer" correctamente', () => {
    render(<Link href={testHref} target="_blank">{linkText}</Link>);
    const linkElement = screen.getByRole('link', { name: linkText });
    expect(linkElement).toHaveAttribute('target', '_blank');
    expect(linkElement).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('aplica rel proporcionado incluso con target="_blank"', () => {
    const customRel = "nofollow";
    render(<Link href={testHref} target="_blank" rel={customRel}>{linkText}</Link>);
    const linkElement = screen.getByRole('link', { name: linkText });
    expect(linkElement).toHaveAttribute('rel', customRel);
  });

  test('no aplica rel por defecto si target no es "_blank"', () => {
    render(<Link href={testHref} target="_self">{linkText}</Link>);
    const linkElement = screen.getByRole('link', { name: linkText });
    expect(linkElement).not.toHaveAttribute('rel');
  });

  test('aplica el color "primary" y la clase "underline" por defecto', () => {
    render(<Link href={testHref}>{linkText}</Link>);
    const linkElement = screen.getByRole('link', { name: linkText });
    // Asumiendo que 'link', 'primary', 'underline' son clases de CSS Modules
    expect(linkElement).toHaveClass('link primary underline');
  });

  test('aplica un color específico, por ejemplo "secondary"', () => {
    render(<Link href={testHref} color="secondary">{linkText}</Link>);
    const linkElement = screen.getByRole('link', { name: linkText });
    expect(linkElement).toHaveClass('link secondary underline');
  });

  test('no aplica la clase "underline" cuando underline es false', () => {
    render(<Link href={testHref} underline={false}>{linkText}</Link>);
    const linkElement = screen.getByRole('link', { name: linkText });
    expect(linkElement).toHaveClass('link primary noUnderline');
    expect(linkElement).not.toHaveClass('underline');
  });

  test('aplica clases CSS adicionales pasadas mediante className', () => {
    const customClass = 'mi-enlace-personalizado';
    render(<Link href={testHref} className={customClass}>{linkText}</Link>);
    const linkElement = screen.getByRole('link', { name: linkText });
    expect(linkElement).toHaveClass('link primary underline', customClass);
  });

  test('pasa atributos adicionales al elemento a', () => {
    render(
      <Link href={testHref} data-testid="custom-link" download="archivo.pdf">
        {linkText}
      </Link>
    );
    const linkElement = screen.getByTestId('custom-link');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('download', 'archivo.pdf');
    expect(screen.getByRole('link', { name: linkText })).toBe(linkElement);
  });

  test('renderiza correctamente sin hijos (children) si es un caso válido (ej. link de icono)', () => {
    // Para que sea accesible, necesitaría un aria-label
    render(<Link href={testHref} aria-label="Enlace de icono" data-testid="icon-link" />);
    const linkElement = screen.getByTestId('icon-link');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveTextContent('');
    expect(linkElement).toHaveAttribute('aria-label', 'Enlace de icono');
  });
}); 