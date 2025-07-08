import { render, screen } from '@testing-library/react';
import HelperText from './HelperText';

test('renderiza el texto de ayuda', () => {
  render(<HelperText>Texto de ayuda</HelperText>);
  expect(screen.getByText('Texto de ayuda')).toBeInTheDocument();
}); 