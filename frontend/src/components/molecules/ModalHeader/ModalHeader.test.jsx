import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ModalHeader from './ModalHeader';
import { vi } from 'vitest';

// Mockear el átomo CloseIcon
vi.mock('../../atoms/CloseIcon/CloseIcon', () => ({
  default: vi.fn(({ onClick }) => (
    <button data-testid="mock-close-icon" onClick={onClick}>
      Close
    </button>
  )),
}));

describe('ModalHeader Component', () => {
  const mockOnClose = vi.fn();
  const testTitle = "Título de Prueba del Modal";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renderiza el título dentro de un h2 con clase "title" y el CloseIcon', () => {
    const { container } = render(<ModalHeader title={testTitle} onClose={mockOnClose} />);

    // Verificar título
    const titleElement = screen.getByRole('heading', { name: testTitle, level: 2 });
    expect(titleElement).toBeInTheDocument();
    expect(titleElement.tagName).toBe('H2');
    expect(titleElement).toHaveClass('title');

    // Verificar CloseIcon (mock)
    const CloseIconMock = require('../../atoms/CloseIcon/CloseIcon').default;
    expect(CloseIconMock).toHaveBeenCalledTimes(1);
    expect(CloseIconMock).toHaveBeenCalledWith(expect.objectContaining({ onClick: mockOnClose }), {});
    expect(screen.getByTestId('mock-close-icon')).toBeInTheDocument();

    // Verificar contenedor principal
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const headerDiv = container.firstChild;
    expect(headerDiv).toHaveClass('header');
  });

  test('llama a onClose cuando se hace click en el CloseIcon (mock)', () => {
    render(<ModalHeader title={testTitle} onClose={mockOnClose} />);
    const closeButton = screen.getByTestId('mock-close-icon');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('renderiza correctamente si title es una cadena vacía', () => {
    render(<ModalHeader title="" onClose={mockOnClose} />);
    // El h2 se renderizará pero estará vacío.
    // screen.getByRole('heading', {level: 2}) podría necesitar un name si no es vacío.
    // Podemos buscarlo por su tag y clase.
    // eslint-disable-next-line testing-library/no-container
    const { container } = render(<ModalHeader title="" onClose={mockOnClose} />);
    // eslint-disable-next-line testing-library/no-node-access
    const titleElement = container.querySelector('h2.title');
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveTextContent('');
  });

  // El componente actual no acepta className, style, ni ...rest en su div principal.
  // Si se añadiera esa funcionalidad, se necesitarían tests.
}); 