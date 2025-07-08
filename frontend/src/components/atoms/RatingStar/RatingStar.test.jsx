import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import RatingStar from './RatingStar';
// import styles from './RatingStar.module.css'; // Not strictly needed if not asserting specific module classes directly

describe('RatingStar', () => {
  test('renderiza una estrella (botón) con el aria-label por defecto', () => {
    render(<RatingStar />);
    const starButton = screen.getByRole('button', { name: 'Estrella' });
    expect(starButton).toBeInTheDocument();
  });

  test('renderiza una estrella con aria-label personalizado', () => {
    render(<RatingStar aria-label="Calificación 1 de 5" />);
    expect(screen.getByRole('button', { name: 'Calificación 1 de 5' })).toBeInTheDocument();
  });

  test('renderiza la estrella vacía por defecto (not filled)', () => {
    const { container } = render(<RatingStar />);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const svgElement = container.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveAttribute('fill', 'none');
  });

  test('renderiza la estrella llena cuando filled es true', () => {
    const { container } = render(<RatingStar filled={true} />);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const svgElement = container.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveAttribute('fill', 'var(--warning-color, #ffb300)');
  });

  test('llama a onClick cuando se hace click', () => {
    const mockOnClick = vi.fn();
    render(<RatingStar onClick={mockOnClick} />);
    const starButton = screen.getByRole('button', { name: 'Estrella' });
    fireEvent.click(starButton);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('aplica el tamaño (size) y color correctos al SVG', () => {
    const testSize = 32;
    const testColor = 'primary';
    const { container } = render(<RatingStar size={testSize} color={testColor} />);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const svgElement = container.querySelector('svg');
    expect(svgElement).toHaveAttribute('width', testSize.toString());
    expect(svgElement).toHaveAttribute('height', testSize.toString());
    expect(svgElement).toHaveStyle(`color: var(--${testColor}-color)`);
  });
}); 