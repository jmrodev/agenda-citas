import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import MenuButton from './MenuButton';

describe('MenuButton', () => {
  test('renderiza la etiqueta del botón de menú', () => {
    render(<MenuButton label="Menú Principal" />);
    expect(screen.getByText('Menú Principal')).toBeInTheDocument();
  });

  test('renderiza el icono cuando se proporciona', () => {
    const iconElement = <span data-testid="menu-icon">☰</span>;
    render(<MenuButton label="Menú" icon={iconElement} />);
    expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
  });

  test('llama a onClick cuando se hace click', () => {
    const mockOnClick = vi.fn();
    render(<MenuButton label="Clickable Menú" onClick={mockOnClick} />);
    fireEvent.click(screen.getByText('Clickable Menú'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('aplica la clase active cuando active es true', () => {
    render(<MenuButton label="Active Menú" active={true} />);
    // The button itself should have the active class or a class containing 'active'
    const buttonElement = screen.getByRole('button', { name: 'Active Menú' });
    expect(buttonElement).toHaveClass(expect.stringContaining('active'));
  });

  test('ref se reenvía correctamente', () => {
    const ref = React.createRef();
    render(<MenuButton label="Ref Menú" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toHaveTextContent('Ref Menú');
  });
}); 