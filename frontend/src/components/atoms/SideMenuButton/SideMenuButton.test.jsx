import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import SideMenuButton from './SideMenuButton';

describe('SideMenuButton Component', () => {
  const testLabel = "Dashboard";

  test('renderiza la etiqueta, tiene type="button" y clases base', () => {
    render(<SideMenuButton label={testLabel} />);
    // El nombre accesible del botón es el label.
    const buttonElement = screen.getByRole('button', { name: testLabel });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveAttribute('type', 'button');
    expect(buttonElement).toHaveClass('sideMenuButton'); // Clase base del botón

    const labelSpan = screen.getByText(testLabel);
    expect(labelSpan).toBeInTheDocument();
    expect(labelSpan).toHaveClass('label'); // Clase del span del label
    // eslint-disable-next-line testing-library/no-node-access
    expect(buttonElement.contains(labelSpan)).toBe(true);
  });

  test('renderiza el icono cuando se proporciona y tiene la clase "icon"', () => {
    const iconMock = <span data-testid="mock-icon">⭐</span>;
    render(<SideMenuButton label={testLabel} icon={iconMock} />);

    const iconElement = screen.getByTestId('mock-icon');
    expect(iconElement).toBeInTheDocument();
    // El icono está envuelto en un span con clase 'icon'
    expect(iconElement.parentElement).toHaveClass('icon');
  });

  test('no renderiza el span del icono si no se proporciona icono', () => {
    render(<SideMenuButton label={testLabel} />);
    const buttonElement = screen.getByRole('button', { name: testLabel });
    // eslint-disable-next-line testing-library/no-node-access
    const iconSpan = buttonElement.querySelector('span.icon');
    expect(iconSpan).not.toBeInTheDocument();
  });

  test('llama a onClick cuando se hace click', () => {
    const mockOnClick = vi.fn();
    render(<SideMenuButton label="Click Me" onClick={mockOnClick} />);
    fireEvent.click(screen.getByRole('button', { name: 'Click Me' }));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('aplica la clase "active" cuando active es true y no la aplica si es false/undefined', () => {
    const { rerender } = render(<SideMenuButton label="Test Active" active={true} />);
    const buttonElement = screen.getByRole('button', { name: 'Test Active' });
    expect(buttonElement).toHaveClass('sideMenuButton active');

    rerender(<SideMenuButton label="Test Active" active={false} />);
    expect(buttonElement).toHaveClass('sideMenuButton');
    expect(buttonElement).not.toHaveClass('active');

    rerender(<SideMenuButton label="Test Active" />); // active undefined
    expect(buttonElement).toHaveClass('sideMenuButton');
    expect(buttonElement).not.toHaveClass('active');
  });

  test('aplica la clase "collapsed" y el atributo title cuando isCollapsed es true', () => {
    render(<SideMenuButton label={testLabel} isCollapsed={true} />);
    // Cuando está colapsado, el texto del label no es el nombre accesible principal, el title sí.
    // O podemos buscar solo por 'button' si el contenido es solo icono.
    // En este caso, el label sigue ahí pero podría estar oculto visualmente.
    // El title se establece al valor del label.
    const buttonElement = screen.getByRole('button', { name: testLabel });
    expect(buttonElement).toHaveClass('sideMenuButton collapsed');
    expect(buttonElement).toHaveAttribute('title', testLabel);
  });

  test('no aplica la clase "collapsed" y el title es vacío cuando isCollapsed es false o undefined', () => {
    const { rerender } = render(<SideMenuButton label={testLabel} isCollapsed={false} />);
    const buttonElement = screen.getByRole('button', { name: testLabel });
    expect(buttonElement).toHaveClass('sideMenuButton');
    expect(buttonElement).not.toHaveClass('collapsed');
    expect(buttonElement).toHaveAttribute('title', '');

    rerender(<SideMenuButton label={testLabel} />); // isCollapsed undefined
    expect(buttonElement).toHaveClass('sideMenuButton');
    expect(buttonElement).not.toHaveClass('collapsed');
    expect(buttonElement).toHaveAttribute('title', '');
  });

  // Este componente no acepta ref, className adicionales, o ...rest props actualmente.
  // Si se añadieran, se necesitarían tests para ellos.
}); 