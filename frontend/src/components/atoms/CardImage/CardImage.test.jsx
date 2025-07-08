import { render, screen } from '@testing-library/react';
import CardImage from './CardImage';

test('renderiza la imagen de la tarjeta', () => {
  render(<CardImage src="/imagen.jpg" alt="Imagen de la tarjeta" />);
  const img = screen.getByAltText('Imagen de la tarjeta');
  expect(img).toBeInTheDocument();
  expect(img).toHaveAttribute('src', '/imagen.jpg');
}); 