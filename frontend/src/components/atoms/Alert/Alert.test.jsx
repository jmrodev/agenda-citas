import { render, screen } from '@testing-library/react';
import Alert from './Alert';

test('muestra el mensaje y el tipo correcto', () => {
  render(<Alert type="error" message="¡Error grave!" />);
  expect(screen.getByText('¡Error grave!')).toBeInTheDocument();
  expect(screen.getByRole('alert')).toHaveClass('error');
}); 