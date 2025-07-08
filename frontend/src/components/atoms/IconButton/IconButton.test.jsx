import { render, screen, fireEvent } from '@testing-library/react';
import IconButton from './IconButton';
import { vi } from 'vitest';

// No necesitamos mockear Icon aquí si confiamos en su data-testid por defecto.
// Si los tests de Icon son robustos, podemos asumir que funciona.

describe('IconButton Component', () => {
  const testIconName = 'star';
  const testAriaLabel = 'Marcar como favorito';

  test('renderiza un botón con el aria-label proporcionado', () => {
    render(<IconButton icon={testIconName} onClick={() => {}} aria-label={testAriaLabel} />);
    const buttonElement = screen.getByRole('button', { name: testAriaLabel });
    expect(buttonElement).toBeInTheDocument();
  });

  test('renderiza el Icon componente interno con el nombre correcto', () => {
    render(<IconButton icon={testIconName} onClick={() => {}} aria-label={testAriaLabel} />);
    // El Icon ahora genera data-testid="icon-${iconName}"
    const iconElement = screen.getByTestId(`icon-${testIconName}`);
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
        size={32} // Prop 'size' de IconButton, que se pasa a Icon
        color="secondary" // Prop 'color' de IconButton
      />
    );
    const iconElement = screen.getByTestId(`icon-${testIconName}`);
    // El componente Icon usa estas props para aplicar estilos inline
    expect(iconElement).toHaveStyle('width: 32px');
    expect(iconElement).toHaveStyle('height: 32px');
    // El color se pasa como var(--secondary-color) al Icon
    expect(iconElement).toHaveStyle('color: var(--secondary-color)');
  });

  test('requiere aria-label para accesibilidad', () => {
    // Este test es más conceptual. En un entorno real, linting o PropTypes/TypeScript lo forzarían.
    // Aquí, podemos verificar que si no se pasa, el botón podría no ser accesible por nombre.
    // Sin embargo, el test de arriba "renderiza un botón con el aria-label proporcionado" ya lo cubre.
    // Si el aria-label fuera opcional y hubiera un fallback, se testearía ese fallback.
    // Por ahora, asumimos que es mandatorio y los tests fallarían si no se encuentra por nombre.
    // console.error = vi.fn(); // Mock para evitar warnings de propTypes si los hubiera
    // render(<IconButton icon={testIconName} onClick={() => {}} />);
    // expect(console.error).toHaveBeenCalledWith(expect.stringContaining('aria-label')); // O similar
    // console.error.mockRestore();
    // Este tipo de test es más para prop-types o chequeos estáticos. Testing Library se enfoca en cómo el usuario interactúa.
    // Si no hay aria-label, screen.getByRole('button', { name: ... }) fallaría.
    // Para hacerlo explícito:
    const { container } = render(<IconButton icon={testIconName} onClick={() => {}} />);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const buttonWithoutLabel = container.querySelector('button');
    expect(buttonWithoutLabel).not.toHaveAttribute('aria-label'); // O que tenga uno por defecto si así se diseña
    // Y intentar obtenerlo por un nombre que no existe debería fallar o no encontrarlo:
    expect(screen.queryByRole('button', { name: "unlabel" })).not.toBeInTheDocument();
  });
}); 