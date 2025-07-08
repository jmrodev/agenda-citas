import { render, screen } from '@testing-library/react';
import Label from './Label';

test('renderiza el texto y el atributo htmlFor', () => {
  render(<Label htmlFor="campo">Nombre</Label>);
  const label = screen.getByText('Nombre');
  expect(label).toBeInTheDocument();
  expect(label).toHaveAttribute('for', 'campo');
}); 