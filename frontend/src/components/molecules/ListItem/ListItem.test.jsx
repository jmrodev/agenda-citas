import { render, screen } from '@testing-library/react';
import ListItem from './ListItem';

describe('ListItem', () => {
  test('renderiza el texto primario', () => {
    const primaryText = "Elemento Principal";
    render(<ListItem primary={primaryText} />);
    expect(screen.getByText(primaryText)).toBeInTheDocument();
  });

  test('renderiza texto primario y secundario', () => {
    const primaryText = "Título";
    const secondaryText = "Subtítulo detallado";
    render(<ListItem primary={primaryText} secondary={secondaryText} />);
    expect(screen.getByText(primaryText)).toBeInTheDocument();
    expect(screen.getByText(secondaryText)).toBeInTheDocument();
  });

  test('renderiza con avatar', () => {
    render(<ListItem primary="Usuario" avatarSrc="avatar.jpg" />);
    const avatarImg = screen.getByRole('img');
    expect(avatarImg).toHaveAttribute('src', 'avatar.jpg');
    expect(avatarImg).toHaveAttribute('alt', 'Usuario');
  });

  test('renderiza con icono', () => {
    const iconElement = <span data-testid="list-item-icon">⭐</span>;
    render(<ListItem primary="Favorito" icon={iconElement} />);
    expect(screen.getByTestId('list-item-icon')).toBeInTheDocument();
  });

  test('renderiza badge y chip', () => {
    const badgeText = "Nuevo";
    const chipText = "Activo";
    render(<ListItem primary="Item con extras" badge={badgeText} chip={chipText} />);
    expect(screen.getByText(badgeText)).toBeInTheDocument(); // Assumes Badge renders children
    expect(screen.getByText(chipText)).toBeInTheDocument();   // Assumes Chip renders children
  });

  test('renderiza acciones', () => {
    const actionsElement = <button>Acción</button>;
    render(<ListItem primary="Item con Acción" actions={actionsElement} />);
    expect(screen.getByRole('button', { name: 'Acción' })).toBeInTheDocument();
  });

  test('aplica clases y estilos personalizados', () => {
    render(
      <ListItem
        primary="Estilizado"
        className="custom-list-item"
        style={{ border: '1px solid red' }}
        data-testid="styled-list-item"
      />
    );
    const listItemElement = screen.getByTestId('styled-list-item');
    expect(listItemElement).toHaveClass('custom-list-item');
    expect(listItemElement).toHaveStyle({ border: '1px solid red' });
  });
}); 