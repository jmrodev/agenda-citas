import { render, screen } from '@testing-library/react';
import HealthInsuranceDeleteModal from './HealthInsuranceDeleteModal';

test('renderiza el modal de eliminación de obra social', () => {
  render(<HealthInsuranceDeleteModal isOpen={true} onClose={() => {}} onConfirm={() => {}} />);
  expect(screen.getByText(/eliminar/i)).toBeInTheDocument();
}); 