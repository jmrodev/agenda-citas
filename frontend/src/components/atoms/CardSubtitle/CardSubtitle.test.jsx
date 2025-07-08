import { render, screen } from '@testing-library/react';
import CardSubtitle from './CardSubtitle';

test('renderiza el subtítulo de la tarjeta', () => {
  render(<CardSubtitle>Subtítulo de la tarjeta</CardSubtitle>);
  expect(screen.getByText('Subtítulo de la tarjeta')).toBeInTheDocument();
}); 