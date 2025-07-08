import { render, screen } from '@testing-library/react';
import PatientReferencesList from './PatientReferencesList';

test('renderiza la lista de referencias del paciente', () => {
  render(<PatientReferencesList references={[]} />);
  expect(screen.getByText(/referencias/i)).toBeInTheDocument();
}); 