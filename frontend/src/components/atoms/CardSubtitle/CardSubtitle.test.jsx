import { render, screen } from '@testing-library/react';
import CardSubtitle from './CardSubtitle';

describe('CardSubtitle Component', () => {
  const subtitleText = 'Este es un subtítulo para la tarjeta.';

  test('renderiza el texto (children) del subtítulo', () => {
    render(<CardSubtitle>{subtitleText}</CardSubtitle>);
    // Se busca por el rol 'heading' y el nombre accesible dado por el texto.
    // Se asume que h4 tiene un nivel de heading implícito si no se especifica aria-level.
    expect(screen.getByRole('heading', { name: subtitleText })).toBeInTheDocument();
  });

  test('renderiza como un elemento h4', () => {
    render(<CardSubtitle>{subtitleText}</CardSubtitle>);
    const subtitleElement = screen.getByRole('heading', { name: subtitleText });
    expect(subtitleElement.tagName).toBe('H4');
  });

  test('aplica la clase base "cardSubtitle"', () => {
    render(<CardSubtitle>{subtitleText}</CardSubtitle>);
    const subtitleElement = screen.getByRole('heading', { name: subtitleText });
    expect(subtitleElement).toHaveClass('cardSubtitle');
  });

  test('aplica clases CSS adicionales pasadas mediante className', () => {
    const customClass = 'mi-subtitulo-personalizado';
    render(<CardSubtitle className={customClass}>{subtitleText}</CardSubtitle>);
    const subtitleElement = screen.getByRole('heading', { name: subtitleText });
    expect(subtitleElement).toHaveClass('cardSubtitle', customClass);
  });

  test('pasa atributos adicionales al elemento h4', () => {
    render(<CardSubtitle id="subtitulo-tarjeta" data-testid="custom-subtitle">{subtitleText}</CardSubtitle>);
    const subtitleElement = screen.getByTestId('custom-subtitle');
    expect(subtitleElement).toBeInTheDocument();
    expect(subtitleElement).toHaveAttribute('id', 'subtitulo-tarjeta');
    // Asegurar que es el mismo elemento de heading
    expect(screen.getByRole('heading', { name: subtitleText })).toBe(subtitleElement);
  });

  test('renderiza correctamente sin hijos (children) si es un caso válido', () => {
    // Esto podría o no ser un caso de uso válido. Si no se espera, el test es innecesario
    // o debería tener un aria-label.
    render(<CardSubtitle data-testid="empty-subtitle" aria-label="Subtítulo vacío" />);
    const subtitleElement = screen.getByTestId('empty-subtitle');
    expect(subtitleElement).toBeInTheDocument();
    expect(subtitleElement).toHaveTextContent('');
    expect(subtitleElement).toHaveAttribute('aria-label', 'Subtítulo vacío');
  });
}); 