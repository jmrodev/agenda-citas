import { render, screen } from '@testing-library/react';
import DateRangeSelector from './DateRangeSelector';

test('renderiza el selector de rango de fechas', () => {
  render(<DateRangeSelector onRangeChange={() => {}} initialRange="thisMonth" />);
  expect(screen.getByRole('combobox')).toBeInTheDocument();
}); 