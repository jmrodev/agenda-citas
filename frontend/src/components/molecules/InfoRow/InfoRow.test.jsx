import { render, screen } from '@testing-library/react';
import InfoRow from './InfoRow';

test('renderiza la fila de información', () => {
  render(<InfoRow label="Email" value="test@example.com" />);
  expect(screen.getByText('Email')).toBeInTheDocument();
  expect(screen.getByText('test@example.com')).toBeInTheDocument();
}); 