import { render, screen } from '@testing-library/react';
import CalendarDayInfo from './CalendarDayInfo';

test('renderiza la información del día del calendario', () => {
  render(<CalendarDayInfo date="2024-01-01" appointments={[]} />);
  expect(screen.getByText(/2024-01-01/i)).toBeInTheDocument();
}); 