import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import SideMenuButton from './SideMenuButton';

describe('SideMenuButton', () => {
  test('renderiza la etiqueta del botón del menú lateral', () => {
    render(<SideMenuButton label="Dashboard" />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  test('renderiza el icono cuando se proporciona', () => {
    // Asumimos que el icono es un string o un elemento simple para el test
    const iconElement = <span data-testid="icon-test">⭐</span>;
    render(<SideMenuButton label="Dashboard" icon={iconElement} />);
    expect(screen.getByTestId('icon-test')).toBeInTheDocument();
  });

  test('llama a onClick cuando se hace click', () => {
    const mockOnClick = vi.fn();
    render(<SideMenuButton label="Click Me" onClick={mockOnClick} />);
    fireEvent.click(screen.getByText('Click Me'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('aplica la clase active cuando active es true', () => {
    render(<SideMenuButton label="Active Button" active={true} />);
    // We check the class on the button itself. The exact class name depends on CSS modules.
    // We expect it to contain 'active'.
    expect(screen.getByRole('button', { name: 'Active Button' })).toHaveClass(expect.stringContaining('active'));
  });

  test('aplica la clase collapsed y el título cuando isCollapsed es true', () => {
    render(<SideMenuButton label="Collapsed" isCollapsed={true} />);
    const button = screen.getByRole('button'); // Title might make name resolution tricky
    expect(button).toHaveClass(expect.stringContaining('collapsed'));
    expect(button).toHaveAttribute('title', 'Collapsed');
  });

  test('no tiene el título cuando isCollapsed es false', () => {
    render(<SideMenuButton label="Not Collapsed" isCollapsed={false} />);
    const button = screen.getByRole('button', { name: 'Not Collapsed' });
    expect(button).not.toHaveAttribute('title', 'Not Collapsed');
    // Or more strictly, title should be empty or not present if not collapsed
    expect(button.getAttribute('title')).toBe('');
  });
}); 