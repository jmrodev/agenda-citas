import { render, screen } from '@testing-library/react';
import Title from './Title';

describe('Title Component', () => {
  const titleText = 'Encabezado Principal';

  test('renderiza el children como contenido del título', () => {
    render(<Title>{titleText}</Title>);
    // Los headings son accesibles por rol 'heading' y su nombre es el contenido.
    expect(screen.getByRole('heading', { name: titleText })).toBeInTheDocument();
  });

  test('renderiza como un <h1> por defecto (level={1})', () => {
    render(<Title>{titleText}</Title>);
    const headingElement = screen.getByRole('heading', { name: titleText, level: 1 });
    expect(headingElement.tagName).toBe('H1');
  });

  test('renderiza con el nivel de heading especificado (ej. <h2>)', () => {
    render(<Title level={2}>{titleText}</Title>);
    const headingElement = screen.getByRole('heading', { name: titleText, level: 2 });
    expect(headingElement.tagName).toBe('H2');
  });

  test('renderiza con el nivel de heading especificado (ej. <h6>)', () => {
    render(<Title level={6}>{titleText}</Title>);
    const headingElement = screen.getByRole('heading', { name: titleText, level: 6 });
    expect(headingElement.tagName).toBe('H6');
  });

  test('aplica la clase base "title" y la clase específica del nivel (ej. "h1")', () => {
    render(<Title>{titleText}</Title>); // level 1 por defecto
    const headingElement = screen.getByRole('heading', { name: titleText, level: 1 });
    expect(headingElement).toHaveClass('title h1');
  });

  test('aplica la clase específica del nivel para h3', () => {
    render(<Title level={3}>{titleText}</Title>);
    const headingElement = screen.getByRole('heading', { name: titleText, level: 3 });
    expect(headingElement).toHaveClass('title h3');
  });

  test('maneja niveles de heading fuera del rango 1-6 (el componente creará el tag, ej. <h7>, el navegador lo tratará)', () => {
    // HTML estándar solo define h1-h6. Un <h7> es un elemento no estándar.
    // El componente lo creará, pero no tendrá semántica de heading para los navegadores/AT.
    // Testing library podría no encontrarlo por rol 'heading' si el nivel es inválido.
    // Vamos a verificar el tagName en este caso.
    const { container } = render(<Title level={7}>{titleText}</Title>);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const customHeadingElement = container.querySelector('h7');
    expect(customHeadingElement).toBeInTheDocument();
    expect(customHeadingElement).toHaveTextContent(titleText);
    // La clase h7 se aplicará si existe en CSS Modules.
    expect(customHeadingElement).toHaveClass('title h7');
  });


  test('aplica clases CSS adicionales pasadas mediante className', () => {
    const customClass = 'mi-titulo-personalizado';
    render(<Title className={customClass}>{titleText}</Title>);
    const headingElement = screen.getByRole('heading', { name: titleText, level: 1 });
    expect(headingElement).toHaveClass('title h1', customClass);
  });

  test('pasa atributos adicionales al elemento heading', () => {
    render(<Title data-testid="custom-title-element" id="main-title">{titleText}</Title>);
    const headingElement = screen.getByTestId('custom-title-element');
    expect(headingElement).toBeInTheDocument();
    expect(headingElement).toHaveAttribute('id', 'main-title');
    expect(screen.getByRole('heading', { name: titleText, level: 1 })).toBe(headingElement);
  });

  test('renderiza correctamente sin hijos (children) si es un caso válido', () => {
    // Un título sin texto es raro, pero el componente no debería fallar.
    // Necesitaría un aria-label para ser accesible.
    render(<Title level={2} data-testid="empty-title" aria-label="Título vacío" />);
    const headingElement = screen.getByTestId('empty-title');
    expect(headingElement).toBeInTheDocument();
    expect(headingElement).toHaveTextContent('');
    expect(headingElement).toHaveAttribute('aria-label', 'Título vacío');
  });
}); 