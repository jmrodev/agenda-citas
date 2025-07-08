import { render, screen } from '@testing-library/react';
import UserListItem from './UserListItem';

test('renderiza el elemento de lista de usuario', () => {
  render(<UserListItem user={{ name: 'Juan', email: 'juan@test.com' }} />);
  expect(screen.getByText('Juan')).toBeInTheDocument();
}); 