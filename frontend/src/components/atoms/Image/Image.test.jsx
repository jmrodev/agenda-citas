import { render, screen } from '@testing-library/react';
import Image from './Image';

test('renderiza la imagen con el alt correcto', () => {
  render(<Image src="/imagen.jpg" alt="Descripción" />);
  const img = screen.getByAltText('Descripción');
  expect(img).toBeInTheDocument();
  expect(img).toHaveAttribute('src', '/imagen.jpg');
}); 