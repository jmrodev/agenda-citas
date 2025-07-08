import { render, screen } from '@testing-library/react';
import DoctorPatientsList from './DoctorPatientsList';

test('renderiza la lista de pacientes del doctor', () => {
  render(<DoctorPatientsList patients={[]} />);
  expect(screen.getByText(/pacientes/i)).toBeInTheDocument();
}); 