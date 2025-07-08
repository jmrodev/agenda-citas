import { render, screen } from '@testing-library/react';
import Icon from './Icon';

test('renderiza el icono con el nombre correcto', () => {
  render(<Icon name="check" />);
  expect(screen.getByTestId('icon')).toBeInTheDocument();
}); 