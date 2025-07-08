import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MenuBar from './MenuBar';
import { vi } from 'vitest';

// Mockear los átomos
vi.mock('../../atoms/MenuButton/MenuButton', () => ({
  default: vi.fn(({ label, icon, onClick, active }) => (
    <button onClick={onClick} data-active={active} data-testid={`menubutton-${label}`}>
      {icon && <span data-testid={`icon-${label}`}>{icon}</span>}
      {label}
    </button>
  )),
}));
vi.mock('../../atoms/MenuSeparator/MenuSeparator', () => ({
  default: vi.fn(() => <hr data-testid="mock-menuseparator" />),
}));

describe('MenuBar Component', () => {
  const mockOnMenuClick = vi.fn();
  const mockItems = [
    { label: 'Inicio', icon: '🏠', extra: <span data-testid="extra-inicio">Info</span> },
    { label: 'Perfil', icon: '👤' },
    { label: 'Ajustes' }, // Sin icono ni extra
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renderiza un MenuButton para cada item y MenuSeparators entre ellos', () => {
    render(<MenuBar items={mockItems} activeIndex={0} onMenuClick={mockOnMenuClick} />);

    const MenuButtonMock = require('../../atoms/MenuButton/MenuButton').default;
    const MenuSeparatorMock = require('../../atoms/MenuSeparator/MenuSeparator').default;

    expect(MenuButtonMock).toHaveBeenCalledTimes(mockItems.length);
    // Se espera un separador menos que el número de items
    expect(MenuSeparatorMock).toHaveBeenCalledTimes(mockItems.length - 1);

    mockItems.forEach((item, index) => {
      expect(MenuButtonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          label: item.label,
          icon: item.icon,
          active: index === 0, // activeIndex es 0
          onClick: expect.any(Function),
        }),
        {}
      );
      // Verificar que el botón se renderizó (usando el label como parte del testid en el mock)
      expect(screen.getByTestId(`menubutton-${item.label}`)).toBeInTheDocument();
      if(item.icon){
        expect(screen.getByTestId(`icon-${item.label}`)).toBeInTheDocument();
      }
      if(item.extra){
        expect(screen.getByTestId(`extra-${item.label}`)).toBeInTheDocument();
      }
    });
  });

  test('llama a onMenuClick con el índice correcto al hacer click en un MenuButton', () => {
    render(<MenuBar items={mockItems} activeIndex={0} onMenuClick={mockOnMenuClick} />);

    // Simular click en el segundo botón ("Perfil")
    const perfilButton = screen.getByTestId('menubutton-Perfil');
    fireEvent.click(perfilButton);

    expect(mockOnMenuClick).toHaveBeenCalledTimes(1);
    expect(mockOnMenuClick).toHaveBeenCalledWith(1); // Índice de "Perfil" es 1
  });

  test('marca el MenuButton correcto como activo según activeIndex', () => {
    const activeIdx = 1; // "Perfil" activo
    render(<MenuBar items={mockItems} activeIndex={activeIdx} onMenuClick={mockOnMenuClick} />);

    const MenuButtonMock = require('../../atoms/MenuButton/MenuButton').default;
    expect(MenuButtonMock.mock.calls[0][0].active).toBe(false); // Inicio
    expect(MenuButtonMock.mock.calls[1][0].active).toBe(true);  // Perfil
    expect(MenuButtonMock.mock.calls[2][0].active).toBe(false); // Ajustes

    expect(screen.getByTestId('menubutton-Inicio')).toHaveAttribute('data-active', 'false');
    expect(screen.getByTestId('menubutton-Perfil')).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('menubutton-Ajustes')).toHaveAttribute('data-active', 'false');
  });

  test('renderiza correctamente si items está vacío', () => {
    const { container } = render(<MenuBar items={[]} activeIndex={0} onMenuClick={mockOnMenuClick} />);
    expect(require('../../atoms/MenuButton/MenuButton').default).not.toHaveBeenCalled();
    expect(require('../../atoms/MenuSeparator/MenuSeparator').default).not.toHaveBeenCalled();
    // El <nav> principal debe estar vacío
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    expect(container.querySelector('nav').children.length).toBe(0);
  });

  test('no renderiza separador después del último item', () => {
    render(<MenuBar items={[mockItems[0]]} activeIndex={0} onMenuClick={mockOnMenuClick} />); // Solo un item
    expect(require('../../atoms/MenuButton/MenuButton').default).toHaveBeenCalledTimes(1);
    expect(require('../../atoms/MenuSeparator/MenuSeparator').default).not.toHaveBeenCalled();
  });

  test('el contenedor principal <nav> tiene la clase "menuBar"', () => {
    const { container } = render(<MenuBar items={mockItems} activeIndex={0} onMenuClick={mockOnMenuClick} />);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    expect(container.firstChild.tagName).toBe('NAV');
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    expect(container.firstChild).toHaveClass('menuBar');
  });
}); 