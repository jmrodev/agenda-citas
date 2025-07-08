import { render, screen } from '@testing-library/react';
import CardBase from './CardBase';

test('renderiza el contenido de la tarjeta', () => {
  render(<CardBase>Contenido de la tarjeta</CardBase>);
  expect(screen.getByText('Contenido de la tarjeta')).toBeInTheDocument();
}); 