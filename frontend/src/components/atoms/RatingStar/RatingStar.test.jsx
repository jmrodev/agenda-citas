import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import RatingStar from './RatingStar';

describe('RatingStar Component', () => {
  const defaultAriaLabel = 'Estrella';

  test('renderiza un botón con type="button", tabIndex="0" y aria-label por defecto', () => {
    render(<RatingStar />);
    const starButton = screen.getByRole('button', { name: defaultAriaLabel });
    expect(starButton).toBeInTheDocument();
    expect(starButton).toHaveAttribute('type', 'button');
    expect(starButton).toHaveAttribute('tabindex', '0');
    expect(starButton).toHaveClass('starButton'); // Clase base del botón
  });

  test('renderiza una estrella con aria-label personalizado', () => {
    const customAriaLabel = "Calificación 1 de 5";
    render(<RatingStar aria-label={customAriaLabel} />);
    expect(screen.getByRole('button', { name: customAriaLabel })).toBeInTheDocument();
  });

  test('el SVG interno tiene la clase "star"', () => {
    const { container } = render(<RatingStar />);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const svgElement = container.querySelector('svg');
    expect(svgElement).toHaveClass('star');
  });

  test('renderiza la estrella vacía (fill="none") por defecto', () => {
    const { container } = render(<RatingStar />);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const svgElement = container.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveAttribute('fill', 'none');
    expect(svgElement).toHaveAttribute('stroke', 'var(--warning-color, #ffb300)'); // Stroke color por defecto
  });

  test('renderiza la estrella llena (fill="var(--warning-color, #ffb300)") cuando filled es true', () => {
    const { container } = render(<RatingStar filled={true} />);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const svgElement = container.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
    expect(svgElement).toHaveAttribute('fill', 'var(--warning-color, #ffb300)');
  });

  test('llama a onClick cuando se hace click', () => {
    const mockOnClick = vi.fn();
    render(<RatingStar onClick={mockOnClick} />);
    const starButton = screen.getByRole('button', { name: defaultAriaLabel });
    fireEvent.click(starButton);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('aplica el tamaño (size) y color (para estilo) correctos al SVG', () => {
    const testSize = 32;
    const testColorProp = 'primary'; // Esta prop 'color' afecta el estilo CSS 'color' del SVG
    const { container } = render(<RatingStar size={testSize} color={testColorProp} />);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const svgElement = container.querySelector('svg');
    expect(svgElement).toHaveAttribute('width', testSize.toString());
    expect(svgElement).toHaveAttribute('height', testSize.toString());
    // La prop 'color' del componente se usa para el estilo 'color' del SVG
    expect(svgElement).toHaveStyle(`color: var(--${testColorProp}-color)`);
  });

  test('aplica clases CSS adicionales al botón', () => {
    const customClass = 'mi-estrella-personalizada';
    render(<RatingStar className={customClass} />);
    const starButton = screen.getByRole('button', { name: defaultAriaLabel });
    expect(starButton).toHaveClass('starButton', customClass);
  });

  test('pasa atributos adicionales al elemento button', () => {
    render(<RatingStar data-value="1" data-testid="estrella-1" />);
    const starButton = screen.getByTestId('estrella-1');
    expect(starButton).toBeInTheDocument();
    expect(starButton).toHaveAttribute('data-value', '1');
  });
}); 