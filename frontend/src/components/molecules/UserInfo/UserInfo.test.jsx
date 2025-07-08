import { render, screen } from '@testing-library/react';
import UserInfo from './UserInfo';

test('renderiza la información del usuario', () => {
  render(<UserInfo name="Juan Pérez" role="admin" />);
  expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
}); 