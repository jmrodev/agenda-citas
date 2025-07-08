import { render, screen } from '@testing-library/react';
import CloseIcon from './CloseIcon';

test('renderiza el icono de cerrar', () => {
  render(<CloseIcon onClick={() => {}} />);
  expect(screen.getByRole('button')).toBeInTheDocument();
}); 