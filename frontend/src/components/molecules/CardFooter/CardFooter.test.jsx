import { render, screen } from '@testing-library/react';
import CardFooter from './CardFooter';

test('renderiza el pie de la tarjeta', () => {
  render(<CardFooter>Acciones de la tarjeta</CardFooter>);
  expect(screen.getByText('Acciones de la tarjeta')).toBeInTheDocument();
}); 