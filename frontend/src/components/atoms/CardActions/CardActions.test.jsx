import { render, screen } from '@testing-library/react';
import CardActions from './CardActions';

test('renderiza las acciones de la tarjeta', () => {
  render(<CardActions>Acciones de la tarjeta</CardActions>);
  expect(screen.getByText('Acciones de la tarjeta')).toBeInTheDocument();
}); 