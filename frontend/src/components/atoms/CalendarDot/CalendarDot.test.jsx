import { render } from '@testing-library/react';
import CalendarDot from './CalendarDot';

test('renderiza el punto del calendario', () => {
  const { container } = render(<CalendarDot color="red" />);
  expect(container.firstChild).toBeInTheDocument();
}); 