import { render, screen } from '@testing-library/react';
import Button from './Button';

test('renderiza el texto correctamente', () => {
  render(<Button>Guardar</Button>);
  expect(screen.getByText('Guardar')).toBeInTheDocument();
});
