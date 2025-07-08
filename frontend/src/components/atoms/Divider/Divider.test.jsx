import { render, screen } from '@testing-library/react';
import Divider from './Divider';

describe('Divider Component', () => {
  test('renderiza un span con rol "separator"', () => {
    render(<Divider />);
    const dividerElement = screen.getByRole('separator');
    expect(dividerElement).toBeInTheDocument();
    expect(dividerElement.tagName).toBe('SPAN');
  });

  test('aplica orientación "horizontal", tamaño "md" y color "default" por defecto', () => {
    render(<Divider />);
    const dividerElement = screen.getByRole('separator');
    expect(dividerElement).toHaveClass('divider horizontal md default');
    expect(dividerElement).toHaveAttribute('aria-orientation', 'horizontal');
  });

  test('aplica orientación "vertical" correctamente', () => {
    render(<Divider orientation="vertical" />);
    const dividerElement = screen.getByRole('separator');
    expect(dividerElement).toHaveClass('divider vertical md default');
    expect(dividerElement).toHaveAttribute('aria-orientation', 'vertical');
  });

  test('aplica un tamaño específico, por ejemplo "sm"', () => {
    render(<Divider size="sm" />);
    const dividerElement = screen.getByRole('separator');
    expect(dividerElement).toHaveClass('divider horizontal sm default');
  });

  test('aplica un color específico, por ejemplo "light"', () => {
    render(<Divider color="light" />);
    const dividerElement = screen.getByRole('separator');
    expect(dividerElement).toHaveClass('divider horizontal md light');
  });

  test('maneja props de orientación, tamaño o color no definidas en estilos sin añadir clases extra no deseadas', () => {
    render(<Divider orientation="diagonal" size="xl" color="transparent" />);
    const dividerElement = screen.getByRole('separator');
    // Las clases base y las que sí existen deben estar, las otras no.
    // styles[orientation] || '' se convierte en '', etc.
    expect(dividerElement).toHaveClass('divider');
    expect(dividerElement).not.toHaveClass('diagonal');
    expect(dividerElement).not.toHaveClass('xl');
    expect(dividerElement).not.toHaveClass('transparent');
    // aria-orientation tomará el valor "diagonal" aunque no haya clase CSS para ello
    expect(dividerElement).toHaveAttribute('aria-orientation', 'diagonal');
  });

  test('aplica clases CSS adicionales pasadas mediante className', () => {
    const customClass = 'mi-divisor-personalizado';
    render(<Divider className={customClass} />);
    const dividerElement = screen.getByRole('separator');
    expect(dividerElement).toHaveClass('divider horizontal md default', customClass);
  });

  test('pasa atributos adicionales al elemento span', () => {
    render(<Divider data-testid="custom-divider" title="Sección divisoria" />);
    const dividerElement = screen.getByTestId('custom-divider');
    expect(dividerElement).toBeInTheDocument();
    expect(dividerElement).toHaveAttribute('title', 'Sección divisoria');
    expect(screen.getByRole('separator')).toBe(dividerElement);
  });
}); 