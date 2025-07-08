import { render, screen } from '@testing-library/react';
import AppointmentListItem from './AppointmentListItem';

test('renderiza el elemento de lista de cita', () => {
  render(<AppointmentListItem appointment={{ patient: 'Juan', date: '2024-01-01' }} />);
  expect(screen.getByText('Juan')).toBeInTheDocument();
}); 