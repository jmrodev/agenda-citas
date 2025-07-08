import { render, screen } from '@testing-library/react';
import CalendarHeader from './CalendarHeader';

test('renderiza el encabezado del calendario', () => {
  render(<CalendarHeader month="Enero" year={2024} onMonthChange={() => {}} />);
  expect(screen.getByText('Enero 2024')).toBeInTheDocument();
}); 