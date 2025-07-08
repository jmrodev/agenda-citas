import { render, screen } from '@testing-library/react';
import CalendarWeekdays from './CalendarWeekdays';

test('renderiza los días de la semana del calendario', () => {
  render(<CalendarWeekdays />);
  expect(screen.getByText(/lun/i)).toBeInTheDocument();
}); 