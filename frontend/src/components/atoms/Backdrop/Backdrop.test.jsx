import { render } from '@testing-library/react';
import Backdrop from './Backdrop';

test('renderiza el backdrop con la clase correspondiente', () => {
  const { container } = render(<Backdrop open={true} />);
  // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
  expect(container.firstChild).toHaveClass(expect.stringContaining('backdrop'));
}); 