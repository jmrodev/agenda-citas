import { render, screen } from '@testing-library/react';
import CalendarWeekday from './CalendarWeekday';

test('renderiza el día de la semana', () => {
  render(<CalendarWeekday>Lun</CalendarWeekday>);
  expect(screen.getByText('Lun')).toBeInTheDocument();
}); 