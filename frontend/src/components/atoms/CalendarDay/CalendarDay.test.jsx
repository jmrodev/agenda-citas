import { render, screen } from '@testing-library/react';
import CalendarDay from './CalendarDay';

test('renderiza el día del calendario', () => {
  render(<CalendarDay day={15} onClick={() => {}} />);
  expect(screen.getByText('15')).toBeInTheDocument();
}); 