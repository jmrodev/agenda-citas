import { render, screen } from '@testing-library/react';
import Text from './Text';

test('renderiza el texto correctamente', () => {
  render(<Text>Hola mundo</Text>);
  expect(screen.getByText('Hola mundo')).toBeInTheDocument();
}); 