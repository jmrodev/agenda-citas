import { render, screen } from '@testing-library/react';
import StatusIndicator from './StatusIndicator';

test('renderiza el indicador de estado', () => {
  render(<StatusIndicator status="active" />);
  expect(screen.getByTestId('status-indicator')).toBeInTheDocument();
}); 