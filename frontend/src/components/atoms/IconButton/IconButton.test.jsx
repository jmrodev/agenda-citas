import { render, screen, fireEvent } from '@testing-library/react';
import IconButton from './IconButton';
import { vi } from 'vitest';

// No necesitamos mockear Icon aquí si confiamos en su data-testid por defecto.
// Si los tests de Icon son robustos, podemos asumir que funciona.

describe('IconButton Component', () => {
  const testIconName = 'star'; // Assuming 'star' is a valid icon name in Icon.jsx
  const testAriaLabel = 'Marcar como favorito';

  // Helper to check for default aria-label if a specific one isn't provided.
  const defaultAriaLabel = `${testIconName} icon`;

  test('renderiza un botón con el aria-label proporcionado', () => {
    render(<IconButton icon={testIconName} onClick={() => {}} aria-label={testAriaLabel} />);
    const buttonElement = screen.getByRole('button', { name: testAriaLabel });
    expect(buttonElement).toBeInTheDocument();
  });

  test('renderiza con un aria-label por defecto si no se proporciona uno específico', () => {
    render(<IconButton icon={testIconName} onClick={() => {}} />);
    const buttonElement = screen.getByRole('button', { name: defaultAriaLabel });
    expect(buttonElement).toBeInTheDocument();
  });


  test('renderiza el Icon componente interno con el nombre correcto', () => {
    render(<IconButton icon={testIconName} onClick={() => {}} aria-label={testAriaLabel} />);
    const iconElement = screen.getByTestId(`icon-${testIconName}`); // Icon component adds data-testid
    expect(iconElement).toBeInTheDocument();
    // Asegurarse que el icono está dentro del botón
    const buttonElement = screen.getByRole('button', { name: testAriaLabel });
    // eslint-disable-next-line testing-library/no-node-access
    expect(buttonElement.contains(iconElement)).toBe(true);
  });

  test('llama a la función onClick cuando se hace click', () => {
    const mockOnClick = vi.fn();
    render(<IconButton icon={testIconName} onClick={mockOnClick} aria-label={testAriaLabel} />);
    fireEvent.click(screen.getByRole('button', { name: testAriaLabel }));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('no llama a onClick cuando está deshabilitado', () => {
    const mockOnClick = vi.fn();
    render(<IconButton icon={testIconName} onClick={mockOnClick} aria-label={testAriaLabel} disabled />);
    fireEvent.click(screen.getByRole('button', { name: testAriaLabel }));
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  test('está deshabilitado cuando la prop "disabled" es true', () => {
    render(<IconButton icon={testIconName} onClick={() => {}} aria-label={testAriaLabel} disabled />);
    expect(screen.getByRole('button', { name: testAriaLabel })).toBeDisabled();
  });

  test('aplica la clase base "iconButton"', () => {
    render(<IconButton icon={testIconName} onClick={() => {}} aria-label={testAriaLabel} />);
    expect(screen.getByRole('button', { name: testAriaLabel })).toHaveClass('iconButton');
  });

  test('aplica clases CSS adicionales pasadas mediante className', () => {
    const customClass = 'mi-boton-icono-personalizado';
    render(
      <IconButton
        icon={testIconName}
        onClick={() => {}}
        aria-label={testAriaLabel}
        className={customClass}
      />
    );
    const buttonElement = screen.getByRole('button', { name: testAriaLabel });
    expect(buttonElement).toHaveClass('iconButton', customClass);
  });

  test('pasa atributos adicionales al elemento button', () => {
    render(
      <IconButton
        icon={testIconName}
        onClick={() => {}}
        aria-label={testAriaLabel}
        data-custom="valor-extra"
        id="btn-icono-1"
      />
    );
    const buttonElement = screen.getByRole('button', { name: testAriaLabel });
    expect(buttonElement).toHaveAttribute('data-custom', 'valor-extra');
    expect(buttonElement).toHaveAttribute('id', 'btn-icono-1');
  });

  test('Icon interno recibe props de size y color correctas', () => {
    render(
      <IconButton
        icon={testIconName}
        onClick={() => {}}
        aria-label={testAriaLabel}
        iconSize={32} // Updated prop name
        iconColor="var(--secondary-color)" // Updated prop to take actual color value
      />
    );
    const iconElement = screen.getByTestId(`icon-${testIconName}`);
    expect(iconElement).toHaveStyle('width: 32px');
    expect(iconElement).toHaveStyle('height: 32px');
    expect(iconElement).toHaveStyle('color: var(--secondary-color)');
  });

  // The test for default aria-label now covers part of the old 'requiere aria-label' test.
  // Explicitly testing that a meaningful label is recommended or enforced by other means (linting/TS)
  // is good, but for RTL, we test the outcome (e.g., button is accessible by its label).
}); 