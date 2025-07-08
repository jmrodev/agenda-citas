import { render } from '@testing-library/react';
import Divider from './Divider';

test('renderiza el divider', () => {
  const { container } = render(<Divider />);
  expect(container.firstChild).toBeInTheDocument();
}); 