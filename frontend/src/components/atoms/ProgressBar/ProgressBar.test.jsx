import { render, screen } from '@testing-library/react';
import ProgressBar from './ProgressBar';

test('renderiza el valor de progreso', () => {
  render(<ProgressBar value={50} max={100} />);
  expect(screen.getByRole('progressbar')).toBeInTheDocument();
}); 