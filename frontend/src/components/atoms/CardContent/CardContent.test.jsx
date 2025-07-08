import { render, screen } from '@testing-library/react';
import CardContent from './CardContent';

describe('CardContent Component', () => {
  const contentText = 'Este es el cuerpo principal de la tarjeta.';

  test('renderiza el contenido (children) del componente', () => {
    render(<CardContent>{contentText}</CardContent>);
    expect(screen.getByText(contentText)).toBeInTheDocument();
  });

  test('renderiza como un elemento section', () => {
    render(<CardContent data-testid="card-content-section">{contentText}</CardContent>);
    // Los elementos section no tienen un rol implícito estándar a menos que tengan un nombre accesible.
    // Podemos buscar por testid y luego verificar el tagName.
    const contentElement = screen.getByTestId('card-content-section');
    expect(contentElement.tagName).toBe('SECTION');
  });

  test('aplica la clase base "cardContent"', () => {
    render(<CardContent data-testid="card-content-class">{contentText}</CardContent>);
    const contentElement = screen.getByTestId('card-content-class');
    expect(contentElement).toHaveClass('cardContent');
  });

  test('aplica clases CSS adicionales pasadas mediante className', () => {
    const customClass = 'mi-contenido-personalizado';
    render(<CardContent className={customClass} data-testid="card-content-custom-class">{contentText}</CardContent>);
    const contentElement = screen.getByTestId('card-content-custom-class');
    expect(contentElement).toHaveClass('cardContent', customClass);
  });

  test('pasa atributos adicionales al elemento section', () => {
    render(<CardContent title="Cuerpo de la tarjeta" data-testid="card-content-attrs">{contentText}</CardContent>);
    const contentElement = screen.getByTestId('card-content-attrs');
    expect(contentElement).toBeInTheDocument();
    expect(contentElement).toHaveAttribute('title', 'Cuerpo de la tarjeta');
  });

  test('renderiza correctamente sin hijos (children) si es un caso válido', () => {
    render(<CardContent data-testid="empty-card-content" />);
    const contentElement = screen.getByTestId('empty-card-content');
    expect(contentElement).toBeInTheDocument();
    expect(contentElement).toHaveTextContent('');
  });
}); 