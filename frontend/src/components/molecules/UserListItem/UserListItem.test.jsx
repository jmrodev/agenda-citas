import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserListItem from './UserListItem';
import { vi } from 'vitest';

// Mockear el átomo Button
vi.mock('../../atoms/Button/Button', () => ({
  default: vi.fn(({ children, onClick, variant, size }) => (
    <button
      onClick={onClick}
      data-variant={variant}
      data-size={size}
      data-testid={`mock-button-${children.toString().toLowerCase().replace(/\s+/g, '-')}`}
    >
      {children}
    </button>
  )),
}));

describe('UserListItem Component', () => {
  const mockOnClickItem = vi.fn();
  const mockAction1OnClick = vi.fn();
  const mockAction2OnClick = vi.fn();

  const baseUser = {
    first_name: 'Pedro',
    last_name: 'Pascal',
    email: 'pedro@example.com',
    phone: '555-0101',
    subtitle: 'Actor Principal',
    shift: 'Mañana',
    avatar: '/pedro.jpg',
  };

  const mockActions = [
    { label: 'Editar', onClick: mockAction1OnClick, variant: 'primary' },
    { label: 'Eliminar', onClick: mockAction2OnClick }, // variant secondary por defecto
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renderiza todos los datos del usuario y clases principales', () => {
    const { container } = render(<UserListItem user={baseUser} onClick={mockOnClickItem} />);

    // Contenedor principal
    const itemDiv = screen.getByRole('button'); // El div principal tiene role="button"
    expect(itemDiv).toHaveClass('item');
    expect(itemDiv).toHaveAttribute('tabindex', '0');

    // Avatar
    const avatarImg = screen.getByRole('img', { name: `${baseUser.first_name} ${baseUser.last_name}` });
    expect(avatarImg).toBeInTheDocument();
    expect(avatarImg).toHaveAttribute('src', baseUser.avatar);
    expect(avatarImg).toHaveClass('avatar');

    // Info
    // eslint-disable-next-line testing-library/no-node-access
    const infoDiv = container.querySelector('.info');
    expect(infoDiv).toBeInTheDocument();

    // Nombre
    const nameElement = screen.getByText(`${baseUser.first_name} ${baseUser.last_name}`);
    expect(nameElement).toBeInTheDocument();
    expect(nameElement).toHaveClass('name');

    // Subtítulos (email, phone, subtitle prop, shift)
    expect(screen.getByText(baseUser.subtitle)).toBeInTheDocument();
    expect(screen.getByText(baseUser.email)).toBeInTheDocument();
    expect(screen.getByText(baseUser.phone)).toBeInTheDocument();
    expect(screen.getByText(`Turno: ${baseUser.shift}`)).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-node-access
    infoDiv.querySelectorAll('.subtitle').forEach(sub => expect(sub).toBeInTheDocument());
  });

  describe('Renderizado de Nombre con Fallbacks', () => {
    test('usa user.name si está disponible', () => {
      render(<UserListItem user={{ name: 'Nombre Completo Test' }} />);
      expect(screen.getByText('Nombre Completo Test')).toBeInTheDocument();
    });
    test('usa user.full_name si name no está y full_name sí', () => {
      render(<UserListItem user={{ full_name: 'Full Name Test' }} />);
      expect(screen.getByText('Full Name Test')).toBeInTheDocument();
    });
    test('construye con first_name y last_name si name y full_name no están', () => {
      render(<UserListItem user={{ first_name: 'Pedro', last_name: 'Pascal' }} />);
      expect(screen.getByText('Pedro Pascal')).toBeInTheDocument();
    });
     test('usa solo first_name si last_name no está', () => {
      render(<UserListItem user={{ first_name: 'SoloNombre' }} />);
      expect(screen.getByText('SoloNombre')).toBeInTheDocument();
    });
    test('usa "Sin nombre" si ninguna prop de nombre está disponible', () => {
      render(<UserListItem user={{}} />);
      expect(screen.getByText('Sin nombre')).toBeInTheDocument();
    });
  });

  describe('Renderizado de Avatar con Fallbacks', () => {
    test('usa user.avatar si está disponible', () => {
      render(<UserListItem user={{ name:'Test', avatar: '/test.png' }} />);
      expect(screen.getByRole('img')).toHaveAttribute('src', '/test.png');
    });
    test('usa user.profile_image si avatar no está y profile_image sí', () => {
      render(<UserListItem user={{ name:'Test', profile_image: '/profile.jpg' }} />);
      expect(screen.getByRole('img')).toHaveAttribute('src', '/profile.jpg');
    });
    test('usa "/default-avatar.png" si ni avatar ni profile_image están', () => {
      render(<UserListItem user={{ name:'Test' }} />);
      expect(screen.getByRole('img')).toHaveAttribute('src', '/default-avatar.png');
    });
     test('usa el nombre como alt para el avatar', () => {
      render(<UserListItem user={{ name: 'Alt Test User', avatar: '/test.png' }} />);
      expect(screen.getByRole('img')).toHaveAttribute('alt', 'Alt Test User');
    });
  });

  test('renderiza acciones (botones mockeados) cuando se proporcionan', () => {
    render(<UserListItem user={baseUser} actions={mockActions} onClick={mockOnClickItem} />);

    const ButtonMock = require('../../atoms/Button/Button').default;
    expect(ButtonMock).toHaveBeenCalledTimes(mockActions.length);

    mockActions.forEach(action => {
      const buttonElement = screen.getByTestId(`mock-button-${action.label.toLowerCase().replace(/\s+/g, '-')}`);
      expect(buttonElement).toBeInTheDocument();
      expect(buttonElement).toHaveTextContent(action.label);
      expect(buttonElement).toHaveAttribute('data-variant', action.variant || 'secondary');
      expect(buttonElement).toHaveAttribute('data-size', 'small');
    });
    // eslint-disable-next-line testing-library/no-container
    const { container } = render(<UserListItem user={baseUser} actions={mockActions} />);
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.querySelector('.actions')).toBeInTheDocument();
  });

  test('no renderiza el div de acciones si no se proporcionan actions o está vacío', () => {
    const { rerender, container: c1 } = render(<UserListItem user={baseUser} actions={[]} />);
    // eslint-disable-next-line testing-library/no-node-access
    expect(c1.querySelector('.actions')).not.toBeInTheDocument();

    const { container: c2 } = rerender(<UserListItem user={baseUser} />); // actions es undefined
    // eslint-disable-next-line testing-library/no-node-access
    expect(c2.querySelector('.actions')).not.toBeInTheDocument();
  });

  test('llama a onClick del item cuando se hace click en el div principal', () => {
    render(<UserListItem user={baseUser} onClick={mockOnClickItem} />);
    const itemDiv = screen.getByRole('button'); // El div principal
    fireEvent.click(itemDiv);
    expect(mockOnClickItem).toHaveBeenCalledTimes(1);
  });

  test('llama a action.onClick (y no al onClick del item) cuando se hace click en un botón de acción', () => {
    render(<UserListItem user={baseUser} actions={mockActions} onClick={mockOnClickItem} />);

    const editarButton = screen.getByTestId('mock-button-editar');
    fireEvent.click(editarButton);

    expect(mockAction1OnClick).toHaveBeenCalledTimes(1);
    expect(mockOnClickItem).not.toHaveBeenCalled(); // No debería propagarse al item
  });
}); 