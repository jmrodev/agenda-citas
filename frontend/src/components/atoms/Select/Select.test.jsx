import { render, screen } from '@testing-library/react';
import Select from './Select';

test('renderiza las opciones del select', () => {
  const options = [
    { value: '1', label: 'Opción 1' },
    { value: '2', label: 'Opción 2' }
  ];
  render(<Select options={options} value="" onChange={() => {}} />);
  expect(screen.getByRole('combobox')).toBeInTheDocument();
}); 