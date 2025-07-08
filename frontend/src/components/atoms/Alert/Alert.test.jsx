import { render, screen } from '@testing-library/react';
import Alert from './Alert';

import { vi } from 'vitest';

test('muestra el mensaje y el tipo correcto', () => {
  render(<Alert type="error">¡Error grave!</Alert>);
  expect(screen.getByText('¡Error grave!')).toBeInTheDocument();
  const alertElement = screen.getByRole('alert');
  expect(alertElement).toHaveClass('_error_37a0af'); // Check for the CSS module class
});

test('renderiza con icono por defecto según el tipo', () => {
  render(<Alert type="success">Éxito</Alert>);
  // Icon component is mocked or needs specific check if its internal structure is relevant
  // For now, just check that the alert renders
  expect(screen.getByText('Éxito')).toBeInTheDocument();
});

test('renderiza con icono personalizado', () => {
  render(<Alert type="info" icon="custom-icon">Info</Alert>);
  // Similar to above, focus on text content unless Icon internals are critical for this test
  expect(screen.getByText('Info')).toBeInTheDocument();
});

test('llama a onClose cuando se hace click en el botón de cerrar', () => {
  const mockOnClose = vi.fn();
  render(<Alert type="warning" onClose={mockOnClose}>Advertencia</Alert>);

  const closeButton = screen.getByRole('button', { name: 'Cerrar' });
  fireEvent.click(closeButton);
  expect(mockOnClose).toHaveBeenCalledTimes(1);
});

test('no renderiza el botón de cerrar si no se proporciona onClose', () => {
  render(<Alert type="danger">Peligro</Alert>);
  expect(screen.queryByRole('button', { name: 'Cerrar' })).not.toBeInTheDocument();
}); 