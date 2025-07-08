import { render, screen } from '@testing-library/react';
import CardBase from './CardBase';

describe('CardBase Component', () => {
  const cardContentText = 'Este es el contenido de la tarjeta base.';

  test('renderiza el contenido (children) de la tarjeta', () => {
    render(<CardBase>{cardContentText}</CardBase>);
    expect(screen.getByText(cardContentText)).toBeInTheDocument();
  });

  test('renderiza como un elemento article', () => {
    render(<CardBase data-testid="card-base-article">{cardContentText}</CardBase>);
    // Los elementos article tienen un rol implícito 'article'.
    const cardElement = screen.getByRole('article');
    expect(cardElement).toBeInTheDocument();
    // También podemos verificar el tagName si es necesario, aunque el rol es más semántico.
    expect(screen.getByTestId('card-base-article').tagName).toBe('ARTICLE');
  });

  test('aplica la clase base "cardBase"', () => {
    render(<CardBase data-testid="card-base-class">{cardContentText}</CardBase>);
    const cardElement = screen.getByTestId('card-base-class');
    expect(cardElement).toHaveClass('cardBase');
  });

  test('aplica clases CSS adicionales pasadas mediante className', () => {
    const customClass = 'mi-tarjeta-personalizada';
    render(<CardBase className={customClass} data-testid="card-base-custom-class">{cardContentText}</CardBase>);
    const cardElement = screen.getByTestId('card-base-custom-class');
    expect(cardElement).toHaveClass('cardBase', customClass);
  });

  test('aplica estilos en línea pasados mediante la prop style', () => {
    const inlineStyle = { backgroundColor: 'blue', color: 'white' };
    render(<CardBase style={inlineStyle} data-testid="card-base-style">{cardContentText}</CardBase>);
    const cardElement = screen.getByTestId('card-base-style');
    expect(cardElement).toHaveStyle('background-color: blue');
    expect(cardElement).toHaveStyle('color: white');
  });

  test('pasa atributos adicionales al elemento article', () => {
    render(<CardBase title="Título de la Tarjeta" data-testid="card-base-attrs">{cardContentText}</CardBase>);
    const cardElement = screen.getByTestId('card-base-attrs');
    expect(cardElement).toBeInTheDocument();
    expect(cardElement).toHaveAttribute('title', 'Título de la Tarjeta');
  });

  test('renderiza correctamente sin hijos (children) si es un caso válido', () => {
    render(<CardBase data-testid="empty-card-base" />);
    const cardElement = screen.getByTestId('empty-card-base');
    expect(cardElement).toBeInTheDocument();
    expect(cardElement).toHaveTextContent('');
  });
}); 