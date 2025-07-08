import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SideMenu from './SideMenu';
import { vi } from 'vitest';

// Mockear el átomo SideMenuButton
vi.mock('../../atoms/SideMenuButton/SideMenuButton', () => ({
  default: vi.fn(({ label, icon, onClick, active, isCollapsed }) => (
    <button
      onClick={onClick}
      data-active={active}
      data-collapsed={isCollapsed}
      data-testid={`sidemenubutton-${label}`}
    >
      {icon && <span data-testid={`icon-${label}`}>{icon}</span>}
      {label}
    </button>
  )),
}));

describe('SideMenu Component', () => {
  const mockOnMenuClick = vi.fn();
  const mockOnToggleCollapse = vi.fn();
  const mockItems = [
    { label: 'Dashboard', icon: '📊' },
    { label: 'Pacientes', icon: '👥' },
    { label: 'Agenda', icon: '📅' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renderiza el contenedor nav con clase "sideMenu" y el botón de toggle', () => {
    const { container } = render(
      <SideMenu items={mockItems} activeIndex={0} onMenuClick={mockOnMenuClick} isCollapsed={false} onToggleCollapse={mockOnToggleCollapse} />
    );
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const navElement = container.firstChild;
    expect(navElement.tagName).toBe('NAV');
    expect(navElement).toHaveClass('sideMenu');
    expect(navElement).not.toHaveClass('collapsed');

    const toggleButton = screen.getByRole('button', { name: 'Colapsar menú' });
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveClass('collapseButton');
    // eslint-disable-next-line testing-library/no-node-access
    expect(toggleButton.querySelector('.collapseIcon')).toHaveTextContent('◀');
  });

  test('renderiza un SideMenuButton para cada item con props correctas', () => {
    render(
      <SideMenu items={mockItems} activeIndex={1} onMenuClick={mockOnMenuClick} isCollapsed={false} onToggleCollapse={mockOnToggleCollapse} />
    );
    const SideMenuButtonMock = require('../../atoms/SideMenuButton/SideMenuButton').default;
    expect(SideMenuButtonMock).toHaveBeenCalledTimes(mockItems.length);

    mockItems.forEach((item, index) => {
      expect(SideMenuButtonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          label: item.label,
          icon: item.icon,
          active: index === 1, // activeIndex es 1
          isCollapsed: false,
          onClick: expect.any(Function),
        }),
        {}
      );
      expect(screen.getByTestId(`sidemenubutton-${item.label}`)).toBeInTheDocument();
    });
  });

  test('llama a onMenuClick con el índice correcto al hacer click en un SideMenuButton', () => {
    render(
      <SideMenu items={mockItems} activeIndex={0} onMenuClick={mockOnMenuClick} isCollapsed={false} onToggleCollapse={mockOnToggleCollapse} />
    );
    const pacientesButton = screen.getByTestId('sidemenubutton-Pacientes');
    fireEvent.click(pacientesButton);
    expect(mockOnMenuClick).toHaveBeenCalledTimes(1);
    expect(mockOnMenuClick).toHaveBeenCalledWith(1); // Índice de "Pacientes"
  });

  test('botón de toggle llama a onToggleCollapse y cambia aria-label y clase cuando isCollapsed cambia', () => {
    const { rerender } = render(
      <SideMenu items={mockItems} activeIndex={0} onMenuClick={mockOnMenuClick} isCollapsed={false} onToggleCollapse={mockOnToggleCollapse} />
    );

    let toggleButton = screen.getByRole('button', { name: 'Colapsar menú' });
    fireEvent.click(toggleButton);
    expect(mockOnToggleCollapse).toHaveBeenCalledTimes(1);

    // Re-render con isCollapsed = true
    rerender(
      <SideMenu items={mockItems} activeIndex={0} onMenuClick={mockOnMenuClick} isCollapsed={true} onToggleCollapse={mockOnToggleCollapse} />
    );
    toggleButton = screen.getByRole('button', { name: 'Expandir menú' }); // aria-label cambia
    expect(toggleButton).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const navElement = screen.getByRole('navigation');
    expect(navElement).toHaveClass('sideMenu collapsed'); // Clase 'collapsed' añadida al nav

    // Verificar que la prop isCollapsed se pasa a los SideMenuButtons
    const SideMenuButtonMock = require('../../atoms/SideMenuButton/SideMenuButton').default;
    mockItems.forEach((item) => {
      expect(SideMenuButtonMock).toHaveBeenCalledWith(expect.objectContaining({ label: item.label, isCollapsed: true }), {});
    });
  });

  test('renderiza correctamente si items está vacío (solo el botón de toggle)', () => {
    render(
      <SideMenu items={[]} activeIndex={0} onMenuClick={mockOnMenuClick} isCollapsed={false} onToggleCollapse={mockOnToggleCollapse} />
    );
    expect(require('../../atoms/SideMenuButton/SideMenuButton').default).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Colapsar menú' })).toBeInTheDocument();
  });

  test('verifica la estructura de clases del botón de toggle', () => {
     render(
      <SideMenu items={[]} activeIndex={0} onMenuClick={mockOnMenuClick} isCollapsed={false} onToggleCollapse={mockOnToggleCollapse} />
    );
    const toggleButtonContainer = screen.getByRole('button', { name: 'Colapsar menú' }).parentElement;
    expect(toggleButtonContainer).toHaveClass('toggleButton');
  });
}); 