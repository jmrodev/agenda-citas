import { render, screen } from '@testing-library/react';
import CardHeader from './CardHeader';

test('renderiza el encabezado de la tarjeta', () => {
  render(<CardHeader title="Título de la tarjeta" />);
  expect(screen.getByText('Título de la tarjeta')).toBeInTheDocument();
}); 