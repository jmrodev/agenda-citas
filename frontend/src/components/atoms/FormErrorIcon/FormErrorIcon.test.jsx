import { render, screen } from '@testing-library/react';
import FormErrorIcon from './FormErrorIcon';

test('renderiza el icono de error', () => {
  render(<FormErrorIcon />);
  expect(screen.getByTestId('error-icon')).toBeInTheDocument();
}); 