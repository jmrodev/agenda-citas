import { render, screen } from '@testing-library/react';
import Link from './Link';

test('renderiza el enlace con el texto correcto', () => {
  render(<Link href="/dashboard">Dashboard</Link>);
  const link = screen.getByText('Dashboard');
  expect(link).toBeInTheDocument();
  expect(link).toHaveAttribute('href', '/dashboard');
}); 