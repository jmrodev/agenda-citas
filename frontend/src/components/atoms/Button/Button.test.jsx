import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';
import { vi } from 'vitest';

describe('Button Component', () => {
  const buttonText = 'Click Me';

  test('renderiza el texto (children) del botón', () => {
    render(<Button>{buttonText}</Button>);
    expect(screen.getByRole('button', { name: buttonText })).toBeInTheDocument();
  });

  test('llama a la función onClick cuando se hace click', () => {
    const mockOnClick = vi.fn();
    render(<Button onClick={mockOnClick}>{buttonText}</Button>);
    fireEvent.click(screen.getByRole('button', { name: buttonText }));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('no llama a onClick cuando está deshabilitado', () => {
    const mockOnClick = vi.fn();
    render(<Button onClick={mockOnClick} disabled>{buttonText}</Button>);
    fireEvent.click(screen.getByRole('button', { name: buttonText }));
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  test('no llama a onClick cuando está en estado de carga (loading)', () => {
    const mockOnClick = vi.fn();
    render(<Button onClick={mockOnClick} loading>{buttonText}</Button>);
    // El texto no es visible cuando loading es true, el botón mostrará un loader
    const buttonElement = screen.getByRole('button');
    fireEvent.click(buttonElement);
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  test('tiene el tipo "button" por defecto', () => {
    render(<Button>{buttonText}</Button>);
    expect(screen.getByRole('button', { name: buttonText })).toHaveAttribute('type', 'button');
  });

  test('acepta otros tipos, como "submit"', () => {
    render(<Button type="submit">{buttonText}</Button>);
    expect(screen.getByRole('button', { name: buttonText })).toHaveAttribute('type', 'submit');
  });

  test('aplica la variante "primary" y tamaño "md" por defecto', () => {
    render(<Button>{buttonText}</Button>);
    const buttonElement = screen.getByRole('button', { name: buttonText });
    expect(buttonElement).toHaveClass('button primary md');
  });

  test('aplica una variante específica, por ejemplo "secondary"', () => {
    render(<Button variant="secondary">{buttonText}</Button>);
    const buttonElement = screen.getByRole('button', { name: buttonText });
    expect(buttonElement).toHaveClass('button secondary md');
  });

  test('aplica un tamaño específico, por ejemplo "lg"', () => {
    render(<Button size="lg">{buttonText}</Button>);
    const buttonElement = screen.getByRole('button', { name: buttonText });
    expect(buttonElement).toHaveClass('button primary lg');
  });

  test('está deshabilitado cuando la prop "disabled" es true', () => {
    render(<Button disabled>{buttonText}</Button>);
    expect(screen.getByRole('button', { name: buttonText })).toBeDisabled();
  });

  test('está deshabilitado cuando la prop "loading" es true', () => {
    render(<Button loading>Cargando</Button>); // El texto "Cargando" no se mostrará
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeDisabled();
  });

  test('muestra un loader y oculta el children cuando "loading" es true', () => {
    render(<Button loading>{buttonText}</Button>);
    const buttonElement = screen.getByRole('button');
    // Verificar que el loader está presente (por su clase CSS)
    expect(buttonElement.querySelector('.loader')).toBeInTheDocument();
    // Verificar que el texto del children no está directamente en el botón
    expect(screen.queryByText(buttonText)).not.toBeInTheDocument();
    expect(buttonElement).toHaveAttribute('aria-busy', 'true');
  });

  test('aplica clases CSS adicionales pasadas mediante className', () => {
    const customClass = 'mi-boton-personalizado';
    render(<Button className={customClass}>{buttonText}</Button>);
    expect(screen.getByRole('button', { name: buttonText })).toHaveClass('button primary md', customClass);
  });

  test('pasa atributos adicionales al elemento button', () => {
    render(<Button data-testid="custom-button">{buttonText}</Button>);
    expect(screen.getByTestId('custom-button')).toBeInTheDocument();
  });

  test('aplica aria-label correctamente', () => {
    const label = "Guardar cambios";
    render(<Button aria-label={label}>{buttonText}</Button>);
    // Si el botón tiene contenido visible (children), el aria-label puede no ser la forma principal de accederlo
    // pero debería estar presente.
    expect(screen.getByRole('button', { name: buttonText })).toHaveAttribute('aria-label', label);
  });

  test('renderiza sin children si no se proporcionan (y no está loading)', () => {
    render(<Button aria-label="Acción sin texto" />);
    const buttonElement = screen.getByRole('button', { name: "Acción sin texto" });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveTextContent('');
  });
});
