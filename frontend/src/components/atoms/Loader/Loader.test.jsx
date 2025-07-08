import { render, screen } from '@testing-library/react';
import Loader from './Loader';

test('renderiza el texto de carga', () => {
  render(<Loader text="Cargando..." />);
  expect(screen.getByText('Cargando...')).toBeInTheDocument();
}); 