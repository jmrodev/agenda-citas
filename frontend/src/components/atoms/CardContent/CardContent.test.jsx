import { render, screen } from '@testing-library/react';
import CardContent from './CardContent';

test('renderiza el contenido de la tarjeta', () => {
  render(<CardContent>Contenido de la tarjeta</CardContent>);
  expect(screen.getByText('Contenido de la tarjeta')).toBeInTheDocument();
}); 