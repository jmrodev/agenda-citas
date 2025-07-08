import { render, screen } from '@testing-library/react';
import ModalContainer from './ModalContainer';

test('renderiza el contenedor del modal', () => {
  render(<ModalContainer isOpen={true} onClose={() => {}}>Contenido del modal</ModalContainer>);
  expect(screen.getByText('Contenido del modal')).toBeInTheDocument();
}); 