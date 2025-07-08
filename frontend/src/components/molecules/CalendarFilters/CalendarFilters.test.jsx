import { render, screen } from '@testing-library/react';
import CalendarFilters from './CalendarFilters';

test('renderiza los filtros del calendario', () => {
  render(<CalendarFilters onFilterChange={() => {}} />);
  expect(screen.getByText(/filtros/i)).toBeInTheDocument();
}); 