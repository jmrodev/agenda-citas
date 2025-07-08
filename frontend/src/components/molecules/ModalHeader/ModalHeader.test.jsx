import { render, screen } from '@testing-library/react';
import ModalHeader from './ModalHeader';

test('renderiza el encabezado del modal', () => {
  render(<ModalHeader title="Título del Modal" onClose={() => {}} />);
  expect(screen.getByText('Título del Modal')).toBeInTheDocument();
}); 