import React from 'react';
import { render, screen } from '@testing-library/react';
import UserInfo from './UserInfo';
import { vi } from 'vitest';

// Mockear los átomos
vi.mock('../../atoms/Avatar/Avatar', () => ({
  default: vi.fn(({ src, alt, size }) => <img src={src} alt={alt} data-size={size} data-testid="mock-avatar" />),
}));
vi.mock('../../atoms/Text/Text', () => ({
  default: vi.fn(({ children, as, className }) => {
    const Component = as || 'span';
    return <Component data-testid="mock-text" className={className}>{children}</Component>;
  }),
}));
vi.mock('../../atoms/CardSubtitle/CardSubtitle', () => ({
  default: vi.fn(({ children, className }) => <h4 data-testid="mock-cardsubtitle" className={className}>{children}</h4>),
}));
vi.mock('../../atoms/Badge/Badge', () => ({
  default: vi.fn(({ children, className }) => <span data-testid="mock-badge" className={className}>{children}</span>),
}));

describe('UserInfo Component', () => {
  const testName = "Lucía Martín";
  const testAvatarSrc = "/avatars/lucia.png";
  const testSubtitle = "Desarrolladora Frontend";
  const testBadge = "Activa";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renderiza Avatar, nombre (Text), y clases base', () => {
    render(<UserInfo name={testName} avatarSrc={testAvatarSrc} />);

    // Avatar
    const AvatarMock = require('../../atoms/Avatar/Avatar').default;
    expect(AvatarMock).toHaveBeenCalledTimes(1);
    expect(AvatarMock).toHaveBeenCalledWith(expect.objectContaining({ src: testAvatarSrc, alt: testName, size: 'md' }), {});
    expect(screen.getByTestId('mock-avatar')).toBeInTheDocument();

    // Nombre (Text)
    const TextMock = require('../../atoms/Text/Text').default;
    expect(TextMock).toHaveBeenCalledTimes(1); // Solo el nombre, no subtítulo ni badge en este test
    expect(TextMock).toHaveBeenCalledWith(expect.objectContaining({ children: testName, as: 'span', className: 'name' }), {});
    expect(screen.getByTestId('mock-text')).toHaveTextContent(testName);

    // Clases de estructura
    // eslint-disable-next-line testing-library/no-container
    const { container } = render(<UserInfo name={testName} avatarSrc={testAvatarSrc} />);
    // eslint-disable-next-line testing-library/no-node-access
    const mainDiv = container.firstChild;
    expect(mainDiv).toHaveClass('userInfo');
    // eslint-disable-next-line testing-library/no-node-access
    expect(mainDiv.querySelector('.infoText')).toBeInTheDocument();
  });

  test('renderiza Avatar con alt=name incluso si avatarSrc no se proporciona', () => {
    render(<UserInfo name={testName} />); // avatarSrc es undefined
    const AvatarMock = require('../../atoms/Avatar/Avatar').default;
    expect(AvatarMock).toHaveBeenCalledWith(expect.objectContaining({ src: undefined, alt: testName, size: 'md' }), {});
  });

  test('renderiza CardSubtitle cuando subtitle se proporciona', () => {
    render(<UserInfo name={testName} subtitle={testSubtitle} />);
    const CardSubtitleMock = require('../../atoms/CardSubtitle/CardSubtitle').default;
    expect(CardSubtitleMock).toHaveBeenCalledTimes(1);
    expect(CardSubtitleMock).toHaveBeenCalledWith(expect.objectContaining({ children: testSubtitle, className: 'subtitle' }), {});
    expect(screen.getByTestId('mock-cardsubtitle')).toHaveTextContent(testSubtitle);
  });

  test('no renderiza CardSubtitle si subtitle no se proporciona o es vacío', () => {
    const { rerender } = render(<UserInfo name={testName} subtitle="" />);
    expect(require('../../atoms/CardSubtitle/CardSubtitle').default).not.toHaveBeenCalled();

    rerender(<UserInfo name={testName} />); // subtitle undefined
    expect(require('../../atoms/CardSubtitle/CardSubtitle').default).not.toHaveBeenCalled();
  });

  test('renderiza Badge cuando badge se proporciona', () => {
    render(<UserInfo name={testName} badge={testBadge} />);
    const BadgeMock = require('../../atoms/Badge/Badge').default;
    expect(BadgeMock).toHaveBeenCalledTimes(1);
    expect(BadgeMock).toHaveBeenCalledWith(expect.objectContaining({ children: testBadge, className: 'badge' }), {});
    expect(screen.getByTestId('mock-badge')).toHaveTextContent(testBadge);
  });

  test('no renderiza Badge si badge no se proporciona o es vacío', () => {
    const { rerender } = render(<UserInfo name={testName} badge="" />);
    expect(require('../../atoms/Badge/Badge').default).not.toHaveBeenCalled();

    rerender(<UserInfo name={testName} />); // badge undefined
    expect(require('../../atoms/Badge/Badge').default).not.toHaveBeenCalled();
  });

  test('renderiza todos los elementos opcionales cuando se proporcionan', () => {
    render(
      <UserInfo
        name={testName}
        avatarSrc={testAvatarSrc}
        subtitle={testSubtitle}
        badge={testBadge}
      />
    );
    expect(screen.getByTestId('mock-avatar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-text')).toHaveTextContent(testName); // El Text para el nombre
    expect(screen.getByTestId('mock-cardsubtitle')).toHaveTextContent(testSubtitle);
    expect(screen.getByTestId('mock-badge')).toHaveTextContent(testBadge);
  });

  test('aplica className, style y otras props al div contenedor principal', () => {
    const customClass = "mi-info-usuario";
    const customStyle = { backgroundColor: 'beige' };
    const { container } = render(
      <UserInfo
        name={testName}
        className={customClass}
        style={customStyle}
        data-user-id="user-007"
      />
    );
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const mainDiv = container.firstChild;
    expect(mainDiv).toHaveClass('userInfo', customClass);
    expect(mainDiv).toHaveStyle('background-color: beige;');
    expect(mainDiv).toHaveAttribute('data-user-id', 'user-007');
  });
}); 