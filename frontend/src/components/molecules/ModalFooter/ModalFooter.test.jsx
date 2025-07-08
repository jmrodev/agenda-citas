import { render, screen } from '@testing-library/react';
import ModalFooter from './ModalFooter';

test('renderiza el pie del modal', () => {
  render(<ModalFooter>Botones del modal</ModalFooter>);
  expect(screen.getByText('Botones del modal')).toBeInTheDocument();
}); 