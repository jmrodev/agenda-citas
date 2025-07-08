import { render } from '@testing-library/react';
import Spinner from './Spinner';

test('renderiza el spinner', () => {
  const { container } = render(<Spinner size={32} color="primary" />);
  expect(container.firstChild).toBeInTheDocument();
}); 