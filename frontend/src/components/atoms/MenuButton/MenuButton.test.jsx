import React from 'react'; // Necesario para React.createRef
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import MenuButton from './MenuButton';

describe('MenuButton Component', () => {
  const testLabel = "Menú Principal";

  test('renderiza la etiqueta del botón de menú y tiene type="button"', () => {
    render(<MenuButton label={testLabel} />);
    const buttonElement = screen.getByRole('button', { name: testLabel });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveAttribute('type', 'button');

    // Verificar que el texto está dentro del span con clase 'label'
    const labelSpan = screen.getByText(testLabel);
    expect(labelSpan).toHaveClass('label');
    // eslint-disable-next-line testing-library/no-node-access
    expect(buttonElement.contains(labelSpan)).toBe(true);
  });

  test('aplica la clase base "menuButton"', () => {
    render(<MenuButton label={testLabel} />);
    const buttonElement = screen.getByRole('button', { name: testLabel });
    expect(buttonElement).toHaveClass('menuButton');
  });

  test('renderiza el icono cuando se proporciona y tiene la clase "icon"', () => {
    // Usamos un simple span como mock del icono para el test
    const iconMock = <span data-testid="mock-icon-span">ICON</span>;
    render(<MenuButton label="Menú con Icono" icon={iconMock} />);

    const iconElement = screen.getByTestId('mock-icon-span');
    expect(iconElement).toBeInTheDocument();
    // El icono está envuelto en un span con clase 'icon' por el componente MenuButton
    expect(iconElement.parentElement).toHaveClass('icon');
  });

  test('no renderiza el span del icono si no se proporciona icono', () => {
    render(<MenuButton label={testLabel} />);
    const buttonElement = screen.getByRole('button', { name: testLabel });
    // eslint-disable-next-line testing-library/no-node-access
    const iconSpan = buttonElement.querySelector('span.icon');
    expect(iconSpan).not.toBeInTheDocument();
  });

  test('llama a onClick cuando se hace click', () => {
    const mockOnClick = vi.fn();
    render(<MenuButton label="Clickable Menú" onClick={mockOnClick} />);
    // El nombre accesible del botón es el label.
    fireEvent.click(screen.getByRole('button', { name: "Clickable Menú" }));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('aplica la clase "active" cuando active es true y no la aplica si es false o undefined', () => {
    const { rerender } = render(<MenuButton label="Active Menú" active={true} />);
    const buttonElement = screen.getByRole('button', { name: 'Active Menú' });
    expect(buttonElement).toHaveClass('menuButton active');

    rerender(<MenuButton label="Active Menú" active={false} />);
    expect(buttonElement).not.toHaveClass('active');
    expect(buttonElement).toHaveClass('menuButton'); // Solo la clase base

    rerender(<MenuButton label="Active Menú" />); // active es undefined
    expect(buttonElement).not.toHaveClass('active');
    expect(buttonElement).toHaveClass('menuButton');
  });

  test('ref se reenvía correctamente al elemento button', () => {
    const ref = React.createRef();
    render(<MenuButton label="Ref Menú" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    // El contenido del botón incluye el span del label
    expect(ref.current.textContent).toBe('Ref Menú');
  });
}); 