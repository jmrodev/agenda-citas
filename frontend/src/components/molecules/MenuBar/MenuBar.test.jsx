import { render, screen } from '@testing-library/react';
import MenuBar from './MenuBar';

test('renderiza la barra de menú', () => {
  render(<MenuBar>Elementos del menú</MenuBar>);
  expect(screen.getByText('Elementos del menú')).toBeInTheDocument();
}); 