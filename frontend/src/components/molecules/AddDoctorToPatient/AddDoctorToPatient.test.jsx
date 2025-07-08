import { render, screen } from '@testing-library/react';
import AddDoctorToPatient from './AddDoctorToPatient';

test('renderiza el componente para agregar doctor al paciente', () => {
  render(<AddDoctorToPatient onAdd={() => {}} />);
  expect(screen.getByText(/agregar doctor/i)).toBeInTheDocument();
}); 