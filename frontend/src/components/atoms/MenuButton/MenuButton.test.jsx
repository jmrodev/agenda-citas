import { render, screen } from '@testing-library/react';
import MenuButton from './MenuButton';

test('renderiza el texto del botón de menú', () => {
  render(<MenuButton>Menú</MenuButton>);
  expect(screen.getByText('Menú')).toBeInTheDocument();
}); 