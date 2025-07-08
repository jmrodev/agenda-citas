import { render, screen } from '@testing-library/react';
import SearchBar from './SearchBar';

test('renderiza la barra de búsqueda', () => {
  render(<SearchBar onSearch={() => {}} placeholder="Buscar..." />);
  expect(screen.getByPlaceholderText('Buscar...')).toBeInTheDocument();
}); 