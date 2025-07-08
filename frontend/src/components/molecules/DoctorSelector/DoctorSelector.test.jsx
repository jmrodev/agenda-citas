import { render, screen } from '@testing-library/react';
import DoctorSelector from './DoctorSelector';

test('renderiza el selector de doctores', () => {
  render(<DoctorSelector doctors={[]} onSelect={() => {}} />);
  expect(screen.getByRole('combobox')).toBeInTheDocument();
}); 