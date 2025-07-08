import React from 'react';
import { render, screen } from '@testing-library/react';
import CardHeader from './CardHeader';
import { vi } from 'vitest';

// Mockear los átomos
vi.mock('../../atoms/CardImage/CardImage', () => ({
  default: vi.fn(({ src, alt, className }) => <img src={src} alt={alt} className={className} data-testid="mock-cardimage" />),
}));
vi.mock('../../atoms/CardTitle/CardTitle', () => ({
  default: vi.fn(({ children, className }) => <h3 className={className} data-testid="mock-cardtitle">{children}</h3>),
}));
vi.mock('../../atoms/CardSubtitle/CardSubtitle', () => ({
  default: vi.fn(({ children, className }) => <h4 className={className} data-testid="mock-cardsubtitle">{children}</h4>),
}));
vi.mock('../../atoms/Badge/Badge', () => ({
  default: vi.fn(({ children, className }) => <span className={className} data-testid="mock-badge">{children}</span>),
}));

describe('CardHeader Component', () => {
  const defaultTitle = "Título Principal";

  beforeEach(() => {
    // Limpiar mocks antes de cada test
    require('../../atoms/CardImage/CardImage').default.mockClear();
    require('../../atoms/CardTitle/CardTitle').default.mockClear();
    require('../../atoms/CardSubtitle/CardSubtitle').default.mockClear();
    require('../../atoms/Badge/Badge').default.mockClear();
  });

  test('renderiza CardTitle con el título proporcionado y clases correctas', () => {
    render(<CardHeader title={defaultTitle} />);

    const cardTitleMock = require('../../atoms/CardTitle/CardTitle').default;
    expect(cardTitleMock).toHaveBeenCalledTimes(1);
    expect(cardTitleMock).toHaveBeenCalledWith(expect.objectContaining({ children: defaultTitle, className: 'title' }), {});

    expect(screen.getByTestId('mock-cardtitle')).toBeInTheDocument();
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

  test('renderiza CardSubtitle cuando subtitle se proporciona', () => {
    const subtitleText = "Un subtítulo interesante";
    render(<CardHeader title={defaultTitle} subtitle={subtitleText} />);

    const cardSubtitleMock = require('../../atoms/CardSubtitle/CardSubtitle').default;
    expect(cardSubtitleMock).toHaveBeenCalledTimes(1);
    expect(cardSubtitleMock).toHaveBeenCalledWith(expect.objectContaining({ children: subtitleText, className: 'subtitle' }), {});

    expect(screen.getByTestId('mock-cardsubtitle')).toBeInTheDocument();
    expect(screen.getByText(subtitleText)).toBeInTheDocument();
  });

  test('no renderiza CardSubtitle si subtitle no se proporciona o es vacío', () => {
    const { rerender } = render(<CardHeader title={defaultTitle} subtitle="" />);
    expect(require('../../atoms/CardSubtitle/CardSubtitle').default).not.toHaveBeenCalled();
    expect(screen.queryByTestId('mock-cardsubtitle')).not.toBeInTheDocument();

    rerender(<CardHeader title={defaultTitle} />); // subtitle es undefined
    expect(require('../../atoms/CardSubtitle/CardSubtitle').default).not.toHaveBeenCalled();
    expect(screen.queryByTestId('mock-cardsubtitle')).not.toBeInTheDocument();
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