import { render, screen } from '@testing-library/react';
import QuickAction from './QuickAction';

test('renderiza la acción rápida', () => {
  render(<QuickAction icon="add" label="Agregar" onClick={() => {}} />);
  expect(screen.getByText('Agregar')).toBeInTheDocument();
}); 