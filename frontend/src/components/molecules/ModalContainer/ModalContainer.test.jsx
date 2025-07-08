import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ModalContainer from './ModalContainer';
import { vi } from 'vitest';

// Mockear el átomo Backdrop
vi.mock('../../atoms/Backdrop/Backdrop', () => ({
  // El mock simula que Backdrop llama a su propio onClick cuando se hace clic en él,
  // y renderiza sus children.
  default: vi.fn(({ children, onClick }) => (
    <div data-testid="mock-backdrop" onClick={onClick}>
      {children}
    </div>
  )),
}));

describe('ModalContainer Component', () => {
  const mockOnClose = vi.fn();
  const childrenText = "Contenido Interno del Modal";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renderiza Backdrop y el div modal con children y clases correctas', () => {
    render(<ModalContainer onClose={mockOnClose}>{childrenText}</ModalContainer>);

    const BackdropMock = require('../../atoms/Backdrop/Backdrop').default;
    expect(BackdropMock).toHaveBeenCalledTimes(1);
    // Verificar que la prop onClick de Backdrop es la función onClose de ModalContainer
    expect(BackdropMock.mock.calls[0][0].onClick).toBe(mockOnClose);

    // Verificar que el Backdrop (mock) está en el DOM
    const backdropElement = screen.getByTestId('mock-backdrop');
    expect(backdropElement).toBeInTheDocument();

    // Verificar el div.modal interno
    const modalDiv = screen.getByText(childrenText).parentElement; // El children está dentro del div.modal
    expect(modalDiv).toHaveClass('modal');
    // eslint-disable-next-line testing-library/no-node-access
    expect(backdropElement.contains(modalDiv)).toBe(true); // El div.modal está dentro del Backdrop
  });

  test('llama a onClose cuando se hace click en el Backdrop (mock)', () => {
    render(<ModalContainer onClose={mockOnClose}>{childrenText}</ModalContainer>);
    const backdropElement = screen.getByTestId('mock-backdrop');
    fireEvent.click(backdropElement);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('NO llama a onClose cuando se hace click dentro del div.modal (contenido)', () => {
    render(<ModalContainer onClose={mockOnClose}>{childrenText}</ModalContainer>);

    // El contenido (childrenText) está dentro del div.modal
    const contentElement = screen.getByText(childrenText);
    fireEvent.click(contentElement); // Hacer click en el contenido

    // mockOnClose no debería haber sido llamado porque el click en div.modal tiene stopPropagation
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test('renderiza children correctamente', () => {
    const complexChildren = (
      <>
        <h2 data-testid="modal-title">Título del Modal</h2>
        <p>Este es un párrafo.</p>
        <button>Un Botón</button>
      </>
    );
    render(<ModalContainer onClose={mockOnClose}>{complexChildren}</ModalContainer>);
    expect(screen.getByTestId('modal-title')).toBeInTheDocument();
    expect(screen.getByText('Este es un párrafo.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Un Botón' })).toBeInTheDocument();
  });

  // El componente ModalContainer no acepta directamente props como className, style, o ...rest
  // en su elemento raíz (que es el Backdrop). Si se necesitaran, deberían pasarse al Backdrop
  // o al div.modal interno, y el componente ModalContainer debería ser modificado para aceptarlas y pasarlas.
}); 