import React from 'react';
import { render, screen } from '@testing-library/react';
import ListItem from './ListItem';
import { vi } from 'vitest';

// Mockear los átomos
vi.mock('../../atoms/Avatar/Avatar', () => ({
  default: vi.fn(({ src, alt, size }) => <img src={src} alt={alt} data-size={size} data-testid="mock-avatar" />),
}));
vi.mock('../../atoms/Badge/Badge', () => ({
  default: vi.fn(({ children, className }) => <span className={className} data-testid="mock-badge">{children}</span>),
}));
vi.mock('../../atoms/Chip/Chip', () => ({
  default: vi.fn(({ children, className }) => <span className={className} data-testid="mock-chip">{children}</span>),
}));


describe('ListItem Component', () => {
  const primaryText = "Elemento Principal";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renderiza texto primario con clases correctas', () => {
    render(<ListItem primary={primaryText} />);
    const primaryElement = screen.getByText(primaryText);
    expect(primaryElement).toBeInTheDocument();
    expect(primaryElement).toHaveClass('primary');
    // eslint-disable-next-line testing-library/no-node-access
    expect(primaryElement.closest('div')).toHaveClass('texts');
    // eslint-disable-next-line testing-library/no-node-access
    expect(primaryElement.closest('div[class*="listItem"]')).toHaveClass('listItem');
  });

  test('renderiza texto primario y secundario con clases correctas', () => {
    const secondaryText = "Subtítulo detallado";
    render(<ListItem primary={primaryText} secondary={secondaryText} />);
    expect(screen.getByText(primaryText)).toBeInTheDocument();
    const secondaryElement = screen.getByText(secondaryText);
    expect(secondaryElement).toBeInTheDocument();
    expect(secondaryElement).toHaveClass('secondary');
  });

  test('no renderiza texto secundario si no se proporciona o es vacío', () => {
    const { rerender } = render(<ListItem primary={primaryText} secondary="" />);
    // eslint-disable-next-line testing-library/no-container
    expect(render(<ListItem primary={primaryText} secondary="" />).container.querySelector('.secondary')).not.toBeInTheDocument();

    rerender(<ListItem primary={primaryText} />);
    // eslint-disable-next-line testing-library/no-container
    expect(render(<ListItem primary={primaryText} />).container.querySelector('.secondary')).not.toBeInTheDocument();
  });

  test('renderiza Avatar cuando avatarSrc se proporciona, con props correctas', () => {
    const avatarSrc = "avatar.jpg";
    render(<ListItem primary={primaryText} avatarSrc={avatarSrc} />);

    const avatarMock = require('../../atoms/Avatar/Avatar').default;
    expect(avatarMock).toHaveBeenCalledTimes(1);
    expect(avatarMock).toHaveBeenCalledWith(expect.objectContaining({ src: avatarSrc, alt: primaryText, size: 'sm' }), {});

    expect(screen.getByTestId('mock-avatar')).toBeInTheDocument();
  });

  test('renderiza icono cuando se proporciona (y no avatarSrc)', () => {
    const iconElement = <span data-testid="list-item-icon-content">⭐</span>;
    render(<ListItem primary="Favorito" icon={iconElement} />);

    const renderedIcon = screen.getByTestId('list-item-icon-content');
    expect(renderedIcon).toBeInTheDocument();
    // El icono está envuelto en un span con clase 'icon'
    expect(renderedIcon.parentElement).toHaveClass('icon');
    expect(require('../../atoms/Avatar/Avatar').default).not.toHaveBeenCalled();
  });

  test('prioritiza Avatar sobre icono si ambos se proporcionan', () => {
    const avatarSrc = "avatar.jpg";
    const iconElement = <span data-testid="list-item-icon-content">⭐</span>;
    render(<ListItem primary={primaryText} avatarSrc={avatarSrc} icon={iconElement} />);

    expect(screen.getByTestId('mock-avatar')).toBeInTheDocument(); // Avatar se renderiza
    expect(screen.queryByTestId('list-item-icon-content')).not.toBeInTheDocument(); // Icono no
    expect(require('../../atoms/Avatar/Avatar').default).toHaveBeenCalledTimes(1);
  });


  test('renderiza Badge cuando se proporciona, con clase correcta', () => {
    const badgeText = "Nuevo";
    render(<ListItem primary="Item con extras" badge={badgeText} />);

    const badgeMock = require('../../atoms/Badge/Badge').default;
    expect(badgeMock).toHaveBeenCalledTimes(1);
    expect(badgeMock).toHaveBeenCalledWith(expect.objectContaining({ children: badgeText, className: 'badge' }), {});

    expect(screen.getByTestId('mock-badge')).toHaveTextContent(badgeText);
  });

  test('renderiza Chip cuando se proporciona, con clase correcta', () => {
    const chipText = "Activo";
    render(<ListItem primary="Item con extras" chip={chipText} />);

    const chipMock = require('../../atoms/Chip/Chip').default;
    expect(chipMock).toHaveBeenCalledTimes(1);
    expect(chipMock).toHaveBeenCalledWith(expect.objectContaining({ children: chipText, className: 'chip' }), {});

    expect(screen.getByTestId('mock-chip')).toHaveTextContent(chipText);
  });

  test('no renderiza Badge ni Chip si no se proporcionan o son vacíos', () => {
    render(<ListItem primary={primaryText} badge="" chip={null} />);
    expect(require('../../atoms/Badge/Badge').default).not.toHaveBeenCalled();
    expect(require('../../atoms/Chip/Chip').default).not.toHaveBeenCalled();
  });

  test('renderiza actions cuando se proporcionan, dentro de un div con clase "actions"', () => {
    const actionsElement = <button>Acción Test</button>;
    render(<ListItem primary="Item con Acción" actions={actionsElement} />);

    const actionButton = screen.getByRole('button', { name: 'Acción Test' });
    expect(actionButton).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-node-access
    expect(actionButton.parentElement).toHaveClass('actions');
  });

  test('no renderiza el div de actions si no se proporcionan actions', () => {
     // eslint-disable-next-line testing-library/no-container
    const { container } = render(<ListItem primary={primaryText} />);
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.querySelector('.actions')).not.toBeInTheDocument();
  });

  test('aplica className, style y otras props al div principal listItem', () => {
    render(
      <ListItem
        primary="Estilizado"
        className="custom-list-item"
        style={{ border: '1px solid red' }}
        data-testid="styled-list-item"
        id="li-1"
      />
    );
    const listItemElement = screen.getByTestId('styled-list-item');
    expect(listItemElement).toHaveClass('listItem custom-list-item');
    expect(listItemElement).toHaveStyle({ border: '1px solid red' });
    expect(listItemElement).toHaveAttribute('id', 'li-1');
  });
}); 