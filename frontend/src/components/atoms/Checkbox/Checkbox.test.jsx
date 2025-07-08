import { render, screen, fireEvent } from '@testing-library/react';
import Checkbox from './Checkbox';

test('cambia de estado al hacer click', () => {
  const handleChange = vi.fn();
  render(<Checkbox checked={false} onChange={handleChange} />);
  const checkbox = screen.getByRole('checkbox');
  expect(checkbox).not.toBeChecked();
  fireEvent.click(checkbox);
  expect(handleChange).toHaveBeenCalled();
}); 