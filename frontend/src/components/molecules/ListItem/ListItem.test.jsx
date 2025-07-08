import { render, screen } from '@testing-library/react';
import ListItem from './ListItem';

test('renderiza el elemento de lista', () => {
  render(<ListItem>Elemento de la lista</ListItem>);
  expect(screen.getByText('Elemento de la lista')).toBeInTheDocument();
}); 