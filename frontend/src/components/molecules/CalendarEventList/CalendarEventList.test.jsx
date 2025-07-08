import { render, screen } from '@testing-library/react';
import CalendarEventList from './CalendarEventList';

test('renderiza la lista de eventos del calendario', () => {
  render(<CalendarEventList events={[]} />);
  expect(screen.getByText(/eventos/i)).toBeInTheDocument();
}); 