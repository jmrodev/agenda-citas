import { render, screen } from '@testing-library/react';
import IconButton from './IconButton';

test('renderiza el icono del botón', () => {
  render(<IconButton icon="close" onClick={() => {}} />);
  expect(screen.getByRole('button')).toBeInTheDocument();
}); 