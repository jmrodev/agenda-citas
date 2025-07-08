import { render } from '@testing-library/react';
import Backdrop from './Backdrop';

test('renderiza el backdrop con la clase correspondiente', () => {
  const { container } = render(<Backdrop open={true} />);
  expect(container.firstChild).toHaveClass('backdrop');
}); 