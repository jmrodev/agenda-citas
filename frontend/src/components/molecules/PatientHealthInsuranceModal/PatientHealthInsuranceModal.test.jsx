import { render, screen } from '@testing-library/react';
import PatientHealthInsuranceModal from './PatientHealthInsuranceModal';

test('renderiza el modal de obra social del paciente', () => {
  render(<PatientHealthInsuranceModal isOpen={true} onClose={() => {}} />);
  expect(screen.getByText(/obra social/i)).toBeInTheDocument();
}); 