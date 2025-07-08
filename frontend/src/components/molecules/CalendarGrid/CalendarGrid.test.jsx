import { render, screen } from '@testing-library/react';
import CalendarGrid from './CalendarGrid';

test('renderiza la cuadrícula del calendario', () => {
  render(<CalendarGrid days={[]} onDayClick={() => {}} />);
  expect(screen.getByTestId('calendar-grid')).toBeInTheDocument();
}); 