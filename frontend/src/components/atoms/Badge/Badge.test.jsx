import { render, screen } from '@testing-library/react';
import Badge from './Badge';

test('renderiza el texto del badge', () => {
  render(<Badge>Nuevo</Badge>);
  expect(screen.getByText('Nuevo')).toBeInTheDocument();
}); 