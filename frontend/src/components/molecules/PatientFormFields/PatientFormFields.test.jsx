import { render, screen } from '@testing-library/react';
import PatientFormFields from './PatientFormFields';

test('renderiza los campos del formulario de paciente', () => {
  render(<PatientFormFields />);
  expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
}); 