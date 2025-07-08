import { render, screen } from '@testing-library/react';
import FormField from './FormField';

test('renderiza el campo de formulario con label', () => {
  render(<FormField label="Nombre" name="nombre" />);
  expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
}); 