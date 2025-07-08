import { render, screen } from '@testing-library/react';
import CardTitle from './CardTitle';

describe('CardTitle Component', () => {
  const titleText = 'Este es el Título Principal de la Tarjeta';

  test('renderiza el texto (children) del título', () => {
    render(<CardTitle>{titleText}</CardTitle>);
    // Se busca por el rol 'heading' y el nombre accesible dado por el texto.
    // Se asume que h3 tiene un nivel de heading implícito si no se especifica aria-level.
    expect(screen.getByRole('heading', { name: titleText })).toBeInTheDocument();
  });

  test('renderiza como un elemento h3', () => {
    render(<CardTitle>{titleText}</CardTitle>);
    const titleElement = screen.getByRole('heading', { name: titleText });
    expect(titleElement.tagName).toBe('H3');
  });

  test('aplica la clase base "cardTitle"', () => {
    render(<CardTitle>{titleText}</CardTitle>);
    const titleElement = screen.getByRole('heading', { name: titleText });
    expect(titleElement).toHaveClass('cardTitle');
  });

  test('aplica clases CSS adicionales pasadas mediante className', () => {
    const customClass = 'mi-titulo-personalizado';
    render(<CardTitle className={customClass}>{titleText}</CardTitle>);
    const titleElement = screen.getByRole('heading', { name: titleText });
    expect(titleElement).toHaveClass('cardTitle', customClass);
  });

  test('pasa atributos adicionales al elemento h3', () => {
    render(<CardTitle id="titulo-principal-tarjeta" data-testid="custom-title">{titleText}</CardTitle>);
    const titleElement = screen.getByTestId('custom-title');
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveAttribute('id', 'titulo-principal-tarjeta');
    // Asegurar que es el mismo elemento de heading
    expect(screen.getByRole('heading', { name: titleText })).toBe(titleElement);
  });

  test('renderiza correctamente sin hijos (children) si es un caso válido', () => {
    // Esto podría o no ser un caso de uso válido. Si no se espera, el test es innecesario
    // o debería tener un aria-label.
    render(<CardTitle data-testid="empty-title" aria-label="Título vacío" />);
    const titleElement = screen.getByTestId('empty-title');
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveTextContent('');
    expect(titleElement).toHaveAttribute('aria-label', 'Título vacío');
  });
}); 