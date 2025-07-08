import { render, screen } from '@testing-library/react';
import SideMenuButton from './SideMenuButton';

test('renderiza el texto del botón del menú lateral', () => {
  render(<SideMenuButton>Dashboard</SideMenuButton>);
  expect(screen.getByText('Dashboard')).toBeInTheDocument();
}); 