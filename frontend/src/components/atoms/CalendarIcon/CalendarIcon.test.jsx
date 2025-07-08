import { render, screen } from '@testing-library/react';
import CalendarIcon from './CalendarIcon';

test('renderiza el icono del calendario', () => {
  render(<CalendarIcon />);
  expect(screen.getByTestId('calendar-icon')).toBeInTheDocument();
}); 