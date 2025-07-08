import { render, screen, fireEvent } from '@testing-library/react';
import Switch from './Switch';

test('cambia de estado al hacer click', () => {
  const handleChange = vi.fn();
  render(<Switch checked={false} onChange={handleChange} />);
  const checkbox = screen.getByRole('checkbox');
  expect(checkbox).not.toBeChecked();
  fireEvent.click(checkbox);
  expect(handleChange).toHaveBeenCalled();
}); 