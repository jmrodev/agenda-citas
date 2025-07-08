import { render, screen } from '@testing-library/react';
import FileInput from './FileInput';

test('renderiza el input de archivo', () => {
  render(<FileInput onChange={() => {}} />);
  const fileInput = screen.getByRole('button');
  expect(fileInput).toBeInTheDocument();
}); 