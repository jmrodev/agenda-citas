import { render, screen } from '@testing-library/react';
import Badge from './Badge';

describe('Badge Component', () => {
  const badgeText = 'Notificación';

  test('renderiza el texto (children) del badge', () => {
    render(<Badge>{badgeText}</Badge>);
    expect(screen.getByText(badgeText)).toBeInTheDocument();
  });

  test('aplica el color "primary" por defecto', () => {
    render(<Badge>{badgeText}</Badge>);
    const badgeElement = screen.getByText(badgeText);
    expect(badgeElement).toHaveClass('badge primary md'); // Asumiendo que 'badge', 'primary' y 'md' son clases
  });

  test('aplica un color específico, por ejemplo "secondary"', () => {
    render(<Badge color="secondary">{badgeText}</Badge>);
    const badgeElement = screen.getByText(badgeText);
    expect(badgeElement).toHaveClass('badge secondary md');
  });

  test('aplica un color no definido y no añade clase de color extra (o usa una por defecto si está configurado)', () => {
    render(<Badge color="unknownColor">{badgeText}</Badge>);
    const badgeElement = screen.getByText(badgeText);
    // El comportamiento exacto depende de cómo maneje el CSS los colores no definidos.
    // Si no hay clase para 'unknownColor', solo deberían estar 'badge' y la de tamaño.
    // Si hay un fallback en el componente o CSS, se testearía ese fallback.
    // En este caso, styles[color] || '' resultará en '' para unknownColor.
    expect(badgeElement).toHaveClass('badge md');
    expect(badgeElement).not.toHaveClass('unknownColor');
  });

  test('aplica el tamaño "md" por defecto', () => {
    render(<Badge>{badgeText}</Badge>);
    const badgeElement = screen.getByText(badgeText);
    expect(badgeElement).toHaveClass('md');
  });

  test('aplica un tamaño específico, por ejemplo "sm"', () => {
    render(<Badge size="sm">{badgeText}</Badge>);
    const badgeElement = screen.getByText(badgeText);
    expect(badgeElement).toHaveClass('badge primary sm');
  });

  test('aplica un tamaño no definido y no añade clase de tamaño extra (o usa una por defecto)', () => {
    render(<Badge size="unknownSize">{badgeText}</Badge>);
    const badgeElement = screen.getByText(badgeText);
    // Similar al color, styles[size] || '' resultará en ''.
    expect(badgeElement).toHaveClass('badge primary');
    expect(badgeElement).not.toHaveClass('unknownSize');
  });

  test('aplica clases CSS adicionales pasadas mediante className', () => {
    const customClass = 'mi-badge-personalizado';
    render(<Badge className={customClass}>{badgeText}</Badge>);
    const badgeElement = screen.getByText(badgeText);
    expect(badgeElement).toHaveClass('badge primary md', customClass);
  });

  test('pasa atributos adicionales al elemento span', () => {
    render(<Badge data-testid="custom-badge">{badgeText}</Badge>);
    expect(screen.getByTestId('custom-badge')).toBeInTheDocument();
    expect(screen.getByText(badgeText)).toBeInTheDocument(); // Asegurar que el contenido también se renderiza
  });

  test('renderiza correctamente sin hijos (children)', () => {
    // Esto podría o no ser un caso de uso válido dependiendo del diseño.
    // Si es válido, el componente no debería fallar.
    render(<Badge data-testid="empty-badge" />);
    const badgeElement = screen.getByTestId('empty-badge');
    expect(badgeElement).toBeInTheDocument();
    expect(badgeElement).toHaveTextContent('');
  });
}); 