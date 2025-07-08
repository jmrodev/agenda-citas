import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import QuickAction from './QuickAction';
import { vi } from 'vitest';

describe('QuickAction Component', () => {
  const mockOnClick = vi.fn();
  const testLabel = "Nueva Cita";
  // Usar un elemento simple como mock para el icono
  const testIcon = <span data-testid="icon-mock">➕</span>;

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  test('renderiza el icono, la etiqueta, y tiene type="button" y clases correctas', () => {
    render(<QuickAction icon={testIcon} label={testLabel} onClick={mockOnClick} />);

    // El nombre accesible del botón será la etiqueta.
    const buttonElement = screen.getByRole('button', { name: testLabel });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveAttribute('type', 'button');
    expect(buttonElement).toHaveClass('action');

    // Verificar icono
    const iconRendered = screen.getByTestId('icon-mock');
    expect(iconRendered).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-node-access
    expect(iconRendered.parentElement).toHaveClass('icon'); // Icono está en span.icon
    // eslint-disable-next-line testing-library/no-node-access
    expect(buttonElement.contains(iconRendered.parentElement)).toBe(true);


    // Verificar etiqueta
    const labelElement = screen.getByText(testLabel);
    expect(labelElement).toBeInTheDocument();
    expect(labelElement.tagName).toBe('SPAN');
    expect(labelElement).toHaveClass('label');
    // eslint-disable-next-line testing-library/no-node-access
    expect(buttonElement.contains(labelElement)).toBe(true);
  });

  test('llama a onClick cuando se hace click en el botón', () => {
    render(<QuickAction icon={testIcon} label={testLabel} onClick={mockOnClick} />);
    const buttonElement = screen.getByRole('button', { name: testLabel });
    fireEvent.click(buttonElement);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('renderiza correctamente si el icono no se proporciona', () => {
    render(<QuickAction label="Sin Icono" onClick={mockOnClick} />);
    const buttonElement = screen.getByRole('button', { name: "Sin Icono" });
    expect(buttonElement).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-container
    const { container } = render(<QuickAction label="Sin Icono" onClick={mockOnClick} />);
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.querySelector('span.icon')).not.toBeInTheDocument(); // No debería haber span.icon
    expect(screen.getByText("Sin Icono")).toBeInTheDocument(); // La etiqueta sí
  });

  // El componente QuickAction no acepta className, style ni ...rest props en su diseño actual.
  // Si se agregaran, se necesitarían tests para esas características.
}); 