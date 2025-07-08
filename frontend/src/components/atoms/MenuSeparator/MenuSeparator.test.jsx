import { render } from '@testing-library/react';
import MenuSeparator from './MenuSeparator';

test('renderiza el separador del menú', () => {
  const { container } = render(<MenuSeparator />);
  expect(container.firstChild).toBeInTheDocument();
}); 