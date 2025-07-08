import { render, screen } from '@testing-library/react';
import Avatar from './Avatar';

test('renderiza la imagen de avatar con alt', () => {
  render(<Avatar src="/avatar.png" alt="Usuario" />);
  expect(screen.getByAltText('Usuario')).toBeInTheDocument();
}); 