import { render, screen } from '@testing-library/react';
import StatCard from './StatCard';

test('renderiza la tarjeta de estadísticas', () => {
  render(<StatCard title="Total" value="100" />);
  expect(screen.getByText('Total')).toBeInTheDocument();
  expect(screen.getByText('100')).toBeInTheDocument();
}); 