import { render, screen, fireEvent } from '@testing-library/react';
import Input from './Input';

test('cambia el valor al escribir', () => {
  render(<Input value="" onChange={() => {}} placeholder="Nombre" />);
  const input = screen.getByPlaceholderText('Nombre');
  fireEvent.change(input, { target: { value: 'Juan' } });
  expect(input.value).toBe('Juan');
}); 