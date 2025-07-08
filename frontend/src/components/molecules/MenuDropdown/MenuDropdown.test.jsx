import { render, screen } from '@testing-library/react';
import MenuDropdown from './MenuDropdown';

test('renderiza el menú desplegable', () => {
  render(<MenuDropdown label="Menú" items={[]} />);
  expect(screen.getByText('Menú')).toBeInTheDocument();
}); 