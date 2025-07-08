import { render, screen } from '@testing-library/react';
import Title from './Title';

test('renderiza el título con el nivel correcto', () => {
  render(<Title level={2}>Título</Title>);
  const heading = screen.getByText('Título');
  expect(heading).toBeInTheDocument();
  expect(heading.tagName).toMatch(/H2/i);
}); 