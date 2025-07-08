import { render, screen } from '@testing-library/react';
import FormGroup from './FormGroup';

test('renderiza el grupo de formulario', () => {
  render(<FormGroup>Campos del formulario</FormGroup>);
  expect(screen.getByText('Campos del formulario')).toBeInTheDocument();
}); 