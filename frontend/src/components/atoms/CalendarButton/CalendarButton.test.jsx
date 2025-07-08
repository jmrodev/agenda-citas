import { render, screen } from '@testing-library/react';
import CalendarButton from './CalendarButton';

test('renderiza el botón del calendario', () => {
  render(<CalendarButton onClick={() => {}}>Hoy</CalendarButton>);
  expect(screen.getByText('Hoy')).toBeInTheDocument();
}); 