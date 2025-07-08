import { render, screen } from '@testing-library/react';
import Avatar from './Avatar';

describe('Avatar Component', () => {
  const testImageSrc = '/test-avatar.png';
  const testAltText = 'Avatar de Usuario';

  test('renderiza la imagen de avatar con el texto alternativo proporcionado', () => {
    render(<Avatar src={testImageSrc} alt={testAltText} />);
    const imgElement = screen.getByAltText(testAltText);
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', testImageSrc);
  });

  test('renderiza las iniciales cuando no se proporciona src', () => {
    render(<Avatar initials="JD" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  test('renderiza "?" como iniciales por defecto si no se proporciona src ni initials', () => {
    render(<Avatar />);
    expect(screen.getByText('?')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  test('aplica el tamaño "sm" correctamente', () => {
    render(<Avatar src={testImageSrc} alt={testAltText} size="sm" />);
    const avatarElement = screen.getByAltText(testAltText).closest('span');
    expect(avatarElement).toHaveStyle('--avatar-size: 32px');
  });

  test('aplica el tamaño "md" correctamente (por defecto)', () => {
    render(<Avatar src={testImageSrc} alt={testAltText} />);
    const avatarElement = screen.getByAltText(testAltText).closest('span');
    expect(avatarElement).toHaveStyle('--avatar-size: 40px');
  });

  test('aplica el tamaño "lg" correctamente', () => {
    render(<Avatar src={testImageSrc} alt={testAltText} size="lg" />);
    const avatarElement = screen.getByAltText(testAltText).closest('span');
    expect(avatarElement).toHaveStyle('--avatar-size: 56px');
  });

  test('aplica un tamaño numérico personalizado correctamente', () => {
    render(<Avatar src={testImageSrc} alt={testAltText} size={48} />);
    const avatarElement = screen.getByAltText(testAltText).closest('span');
    expect(avatarElement).toHaveStyle('--avatar-size: 48px');
  });

  test('aplica clases CSS adicionales pasadas mediante className', () => {
    const customClass = 'mi-avatar-personalizado';
    render(<Avatar src={testImageSrc} alt={testAltText} className={customClass} />);
    const avatarElement = screen.getByAltText(testAltText).closest('span');
    expect(avatarElement).toHaveClass('avatar', customClass); // 'avatar' es la clase base del módulo CSS
  });

  test('pasa atributos adicionales al elemento span principal', () => {
    render(<Avatar src={testImageSrc} alt={testAltText} data-testid="avatar-span" />);
    expect(screen.getByTestId('avatar-span')).toBeInTheDocument();
  });

  test('renderiza la imagen incluso si el alt text está vacío', () => {
    render(<Avatar src={testImageSrc} alt="" />);
    const imgElement = screen.getByRole('img'); // Busca por rol si el alt está vacío
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', testImageSrc);
  });
}); 