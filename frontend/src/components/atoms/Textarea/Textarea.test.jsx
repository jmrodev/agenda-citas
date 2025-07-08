import { render, screen, fireEvent } from '@testing-library/react';
import Textarea from './Textarea';

test('cambia el valor al escribir', () => {
  render(<Textarea value="" onChange={() => {}} placeholder="Descripción" />);
  const textarea = screen.getByPlaceholderText('Descripción');
  fireEvent.change(textarea, { target: { value: 'Texto de prueba' } });
  expect(textarea.value).toBe('Texto de prueba');
}); 