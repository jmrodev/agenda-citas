import { render, screen } from '@testing-library/react';
import CardTitle from './CardTitle';

test('renderiza el título de la tarjeta', () => {
  render(<CardTitle>Título de la tarjeta</CardTitle>);
  expect(screen.getByText('Título de la tarjeta')).toBeInTheDocument();
}); 