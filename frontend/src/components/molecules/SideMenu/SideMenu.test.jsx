import { render, screen } from '@testing-library/react';
import SideMenu from './SideMenu';

test('renderiza el menú lateral', () => {
  render(<SideMenu items={[]} />);
  expect(screen.getByRole('navigation')).toBeInTheDocument();
}); 