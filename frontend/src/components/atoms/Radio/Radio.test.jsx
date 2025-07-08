import { render, screen, fireEvent } from '@testing-library/react';
import Radio from './Radio';

test('cambia de estado al hacer click', () => {
  const handleChange = vi.fn();
  render(<Radio checked={false} onChange={handleChange} value="opcion1" />);
  const radio = screen.getByRole('radio');
  expect(radio).not.toBeChecked();
  fireEvent.click(radio);
  expect(handleChange).toHaveBeenCalled();
}); 