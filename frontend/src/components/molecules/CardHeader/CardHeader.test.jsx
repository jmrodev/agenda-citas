import React from 'react';
import { render, screen } from '@testing-library/react';
import CardHeader from './CardHeader';
import { vi } from 'vitest';

// Mockear los átomos
vi.mock('../../atoms/CardImage/CardImage', () => ({
  default: vi.fn(({ src, alt, className }) => <img src={src} alt={alt} className={className} data-testid="mock-cardimage" />),
}));
// Mock Text atom instead of CardTitle and CardSubtitle
vi.mock('../../atoms/Text/Text', () => ({
  // Mocking the Text component to check its props
  default: vi.fn(({ as, size, weight, color, className, children }) => (
    React.createElement(as || 'p', {
      'data-testid': `mock-text-${as || 'p'}`,
      'data-size': size,
      'data-weight': weight,
      'data-color': color,
      className
    }, children)
  )),
}));
vi.mock('../../atoms/Badge/Badge', () => ({
  default: vi.fn(({ children, className }) => <span className={className} data-testid="mock-badge">{children}</span>),
}));

describe('CardHeader Component', () => {
  const defaultTitle = "Título Principal";
  let TextMock;

  beforeEach(() => {
    // Limpiar mocks antes de cada test
    vi.clearAllMocks(); // Clear all mocks
    TextMock = require('../../atoms/Text/Text').default;
  });

  test('renderiza Text como título con las props y clases correctas', () => {
    render(<CardHeader title={defaultTitle} />);

    expect(TextMock).toHaveBeenCalledWith(
      expect.objectContaining({
        as: "h3",
        size: "lg",
        weight: "bold",
        children: defaultTitle,
        className: 'title'
      }),
      {}
    );
    // Check for the rendered output via testId added in mock
    expect(screen.getByTestId('mock-text-h3')).toBeInTheDocument();
    expect(screen.getByText(defaultTitle)).toBeInTheDocument();
  });

  test('renderiza CardImage cuando imageSrc se proporciona', () => {
    const imgSrc = "/path/to/image.jpg";
    const imgAlt = "Descripción de imagen";
    render(<CardHeader title={defaultTitle} imageSrc={imgSrc} imageAlt={imgAlt} />);

    const cardImageMock = require('../../atoms/CardImage/CardImage').default;
    expect(cardImageMock).toHaveBeenCalledTimes(1);
    expect(cardImageMock).toHaveBeenCalledWith(expect.objectContaining({ src: imgSrc, alt: imgAlt, className: 'image' }), {});

    const imgElement = screen.getByTestId('mock-cardimage');
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', imgSrc);
    expect(imgElement).toHaveAttribute('alt', imgAlt);
  });

  test('no renderiza CardImage si imageSrc no se proporciona', () => {
    render(<CardHeader title={defaultTitle} />);
    expect(require('../../atoms/CardImage/CardImage').default).not.toHaveBeenCalled();
    expect(screen.queryByTestId('mock-cardimage')).not.toBeInTheDocument();
  });

  test('renderiza Text como subtítulo cuando subtitle se proporciona', () => {
    const subtitleText = "Un subtítulo interesante";
    render(<CardHeader title={defaultTitle} subtitle={subtitleText} />);

    // TextMock should be called twice: once for title, once for subtitle
    expect(TextMock).toHaveBeenCalledTimes(2);
    expect(TextMock).toHaveBeenCalledWith(
      expect.objectContaining({
        as: "h4",
        size: "md",
        weight: "medium",
        color: "secondary",
        children: subtitleText,
        className: 'subtitle'
      }),
      {}
    );
    expect(screen.getByTestId('mock-text-h4')).toBeInTheDocument(); // From mock
    expect(screen.getByText(subtitleText)).toBeInTheDocument();
  });

  test('no renderiza Text como subtítulo si subtitle no se proporciona o es vacío', () => {
    const { rerender } = render(<CardHeader title={defaultTitle} subtitle="" />);
    // TextMock called once for title, not for subtitle
    expect(TextMock).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId('mock-text-h4')).not.toBeInTheDocument();

    TextMock.mockClear(); // Clear mock before rerender
    rerender(<CardHeader title={defaultTitle} />); // subtitle es undefined
    expect(TextMock).toHaveBeenCalledTimes(1); // Called for title
    expect(screen.queryByTestId('mock-text-h4')).not.toBeInTheDocument();
  });

  test('renderiza Badge cuando badge se proporciona', () => {
    const badgeText = "Nuevo";
    render(<CardHeader title={defaultTitle} badge={badgeText} />);

    const badgeMock = require('../../atoms/Badge/Badge').default;
    expect(badgeMock).toHaveBeenCalledTimes(1);
    expect(badgeMock).toHaveBeenCalledWith(expect.objectContaining({ children: badgeText, className: 'badge' }), {});

    expect(screen.getByTestId('mock-badge')).toBeInTheDocument();
    expect(screen.getByText(badgeText)).toBeInTheDocument();
  });

  test('no renderiza Badge si badge no se proporciona o es vacío', () => {
    const { rerender } = render(<CardHeader title={defaultTitle} badge="" />);
    expect(require('../../atoms/Badge/Badge').default).not.toHaveBeenCalled();
    expect(screen.queryByTestId('mock-badge')).not.toBeInTheDocument();

    rerender(<CardHeader title={defaultTitle} />); // badge es undefined
    expect(require('../../atoms/Badge/Badge').default).not.toHaveBeenCalled();
    expect(screen.queryByTestId('mock-badge')).not.toBeInTheDocument();
  });

  test('renderiza el icono cuando se proporciona', () => {
    const iconElement = <span data-testid="mock-icon-content">⭐</span>;
    render(<CardHeader title={defaultTitle} icon={iconElement} />);

    const renderedIcon = screen.getByTestId('mock-icon-content');
    expect(renderedIcon).toBeInTheDocument();
    // El icono está envuelto en un span con clase 'icon'
    expect(renderedIcon.parentElement).toHaveClass('icon');
  });

  test('no renderiza el span del icono si no se proporciona icono', () => {
    render(<CardHeader title={defaultTitle} />);
    // eslint-disable-next-line testing-library/no-container
    const { container } = render(<CardHeader title={defaultTitle} />);
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.querySelector('span.icon')).not.toBeInTheDocument();
  });

  test('aplica className, style y otras props al div contenedor principal', () => {
    const customClass = "mi-encabezado-tarjeta";
    const customStyle = { backgroundColor: 'lightgray' };
    const { container } = render(
      <CardHeader
        title={defaultTitle}
        className={customClass}
        style={customStyle}
        data-header-id="header-card-main"
      />
    );
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass('cardHeader', customClass);
    expect(mainContainer).toHaveStyle('background-color: lightgray;');
    expect(mainContainer).toHaveAttribute('data-header-id', 'header-card-main');
  });

  test('estructura de clases CSS internas (headerContent, titleRow)', () => {
    const { container } = render(<CardHeader title={defaultTitle} />);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    expect(container.querySelector('.headerContent')).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    expect(container.querySelector('.titleRow')).toBeInTheDocument();
  });
}); 