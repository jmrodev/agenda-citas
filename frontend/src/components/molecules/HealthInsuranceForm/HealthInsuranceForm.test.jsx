import { render, screen } from '@testing-library/react';
import HealthInsuranceForm from './HealthInsuranceForm';

test('renderiza el formulario de obra social', () => {
  render(<HealthInsuranceForm onSubmit={() => {}} />);
  expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
}); 