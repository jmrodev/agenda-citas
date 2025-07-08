import { render, screen } from '@testing-library/react';
import Tooltip from './Tooltip';

test('renderiza el texto del tooltip', () => {
  render(<Tooltip text="Ayuda">?</Tooltip>);
  expect(screen.getByText('?')).toBeInTheDocument();
}); 