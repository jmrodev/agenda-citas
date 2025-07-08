import { render, screen } from '@testing-library/react';
import Chip from './Chip';

test('renderiza el texto del chip', () => {
  render(<Chip>Activo</Chip>);
  expect(screen.getByText('Activo')).toBeInTheDocument();
}); 