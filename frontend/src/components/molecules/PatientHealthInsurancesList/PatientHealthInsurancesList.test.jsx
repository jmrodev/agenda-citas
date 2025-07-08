import { render, screen } from '@testing-library/react';
import PatientHealthInsurancesList from './PatientHealthInsurancesList';

test('renderiza la lista de obras sociales del paciente', () => {
  render(<PatientHealthInsurancesList healthInsurances={[]} />);
  expect(screen.getByText(/obras sociales/i)).toBeInTheDocument();
}); 