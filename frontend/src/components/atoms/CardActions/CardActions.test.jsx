import { render, screen } from '@testing-library/react';
import CardActions from './CardActions';

describe('CardActions Component', () => {
  const actionsText = 'Botón Aceptar';

  test('renderiza el contenido (children) de las acciones', () => {
    render(<CardActions><button>{actionsText}</button></CardActions>);
    expect(screen.getByRole('button', { name: actionsText })).toBeInTheDocument();
  });

  test('renderiza como un elemento footer', () => {
    render(<CardActions data-testid="card-actions-footer">{actionsText}</CardActions>);
    // Los elementos footer no tienen un rol implícito estándar a menos que tengan un nombre accesible.
    // Podemos buscar por testid y luego verificar el tagName.
    const actionsElement = screen.getByTestId('card-actions-footer');
    expect(actionsElement.tagName).toBe('FOOTER');
  });

  test('aplica la clase base "cardActions"', () => {
    render(<CardActions data-testid="card-actions-class">{actionsText}</CardActions>);
    const actionsElement = screen.getByTestId('card-actions-class');
    expect(actionsElement).toHaveClass('cardActions');
  });

  test('aplica clases CSS adicionales pasadas mediante className', () => {
    const customClass = 'mis-acciones-personalizadas';
    render(<CardActions className={customClass} data-testid="card-actions-custom-class">{actionsText}</CardActions>);
    const actionsElement = screen.getByTestId('card-actions-custom-class');
    expect(actionsElement).toHaveClass('cardActions', customClass);
  });

  test('pasa atributos adicionales al elemento footer', () => {
    render(<CardActions title="Acciones disponibles" data-testid="card-actions-attrs">{actionsText}</CardActions>);
    const actionsElement = screen.getByTestId('card-actions-attrs');
    expect(actionsElement).toBeInTheDocument();
    expect(actionsElement).toHaveAttribute('title', 'Acciones disponibles');
  });

  test('renderiza correctamente sin hijos (children) si es un caso válido', () => {
    render(<CardActions data-testid="empty-card-actions" />);
    const actionsElement = screen.getByTestId('empty-card-actions');
    expect(actionsElement).toBeInTheDocument();
    expect(actionsElement).toHaveTextContent('');
  });
}); 