import { render, screen, fireEvent } from '@testing-library/react';
import SideMenuWrapper from './SideMenu';

// Mock del componente SideMenu de molecules
jest.mock('../../molecules/SideMenu/SideMenu', () => {
  return function MockSideMenu({ items, activeIndex, onMenuClick, isCollapsed, onToggleCollapse }) {
    return (
      <div data-testid="side-menu" data-collapsed={isCollapsed}>
        <button onClick={onToggleCollapse} data-testid="toggle-button">
          {isCollapsed ? 'Expandir' : 'Colapsar'}
        </button>
        <div data-testid="menu-items">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => onMenuClick(index)}
              data-testid={`menu-item-${index}`}
              data-active={index === activeIndex}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    );
  };
});

describe('SideMenuWrapper', () => {
  const mockMenuItems = [
    { label: 'Dashboard', icon: 'dashboard' },
    { label: 'Pacientes', icon: 'patients' },
    { label: 'Citas', icon: 'appointments' },
    { label: 'Configuración', icon: 'settings' }
  ];
  const mockOnMenuSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza el menú lateral con elementos', () => {
    render(<SideMenuWrapper menuItems={mockMenuItems} onMenuSelect={mockOnMenuSelect} />);
    
    expect(screen.getByTestId('side-menu')).toBeInTheDocument();
    expect(screen.getByTestId('toggle-button')).toBeInTheDocument();
    
    // Verificar que se renderizan todos los elementos del menú
    mockMenuItems.forEach((item, index) => {
      expect(screen.getByTestId(`menu-item-${index}`)).toHaveTextContent(item.label);
    });
  });

  test('inicia con el primer elemento activo por defecto', () => {
    render(<SideMenuWrapper menuItems={mockMenuItems} onMenuSelect={mockOnMenuSelect} />);
    
    const firstMenuItem = screen.getByTestId('menu-item-0');
    expect(firstMenuItem.getAttribute('data-active')).toBe('true');
  });

  test('cambia el elemento activo al hacer click', () => {
    render(<SideMenuWrapper menuItems={mockMenuItems} onMenuSelect={mockOnMenuSelect} />);
    
    const secondMenuItem = screen.getByTestId('menu-item-1');
    fireEvent.click(secondMenuItem);
    
    expect(secondMenuItem.getAttribute('data-active')).toBe('true');
    expect(mockOnMenuSelect).toHaveBeenCalledWith(1);
  });

  test('llama onMenuSelect cuando se selecciona un elemento', () => {
    render(<SideMenuWrapper menuItems={mockMenuItems} onMenuSelect={mockOnMenuSelect} />);
    
    const thirdMenuItem = screen.getByTestId('menu-item-2');
    fireEvent.click(thirdMenuItem);
    
    expect(mockOnMenuSelect).toHaveBeenCalledWith(2);
  });

  test('inicia expandido por defecto', () => {
    render(<SideMenuWrapper menuItems={mockMenuItems} onMenuSelect={mockOnMenuSelect} />);
    
    const sideMenu = screen.getByTestId('side-menu');
    expect(sideMenu.getAttribute('data-collapsed')).toBe('false');
    expect(screen.getByText('Colapsar')).toBeInTheDocument();
  });

  test('alterna entre expandido y colapsado', () => {
    render(<SideMenuWrapper menuItems={mockMenuItems} onMenuSelect={mockOnMenuSelect} />);
    
    const toggleButton = screen.getByTestId('toggle-button');
    const sideMenu = screen.getByTestId('side-menu');
    
    // Inicialmente expandido
    expect(sideMenu.getAttribute('data-collapsed')).toBe('false');
    expect(screen.getByText('Colapsar')).toBeInTheDocument();
    
    // Hacer click para colapsar
    fireEvent.click(toggleButton);
    expect(sideMenu.getAttribute('data-collapsed')).toBe('true');
    expect(screen.getByText('Expandir')).toBeInTheDocument();
    
    // Hacer click para expandir
    fireEvent.click(toggleButton);
    expect(sideMenu.getAttribute('data-collapsed')).toBe('false');
    expect(screen.getByText('Colapsar')).toBeInTheDocument();
  });

  test('funciona sin onMenuSelect', () => {
    render(<SideMenuWrapper menuItems={mockMenuItems} />);
    
    const secondMenuItem = screen.getByTestId('menu-item-1');
    fireEvent.click(secondMenuItem);
    
    // No debería fallar, solo cambiar el estado interno
    expect(secondMenuItem.getAttribute('data-active')).toBe('true');
  });

  test('maneja array vacío de elementos del menú', () => {
    render(<SideMenuWrapper menuItems={[]} onMenuSelect={mockOnMenuSelect} />);
    
    expect(screen.getByTestId('side-menu')).toBeInTheDocument();
    expect(screen.getByTestId('toggle-button')).toBeInTheDocument();
    
    // No debería haber elementos del menú
    const menuItems = screen.queryAllByTestId(/^menu-item-/);
    expect(menuItems).toHaveLength(0);
  });

  test('mantiene el estado activo al alternar colapso', () => {
    render(<SideMenuWrapper menuItems={mockMenuItems} onMenuSelect={mockOnMenuSelect} />);
    
    // Seleccionar el segundo elemento
    const secondMenuItem = screen.getByTestId('menu-item-1');
    fireEvent.click(secondMenuItem);
    expect(secondMenuItem.getAttribute('data-active')).toBe('true');
    
    // Colapsar el menú
    const toggleButton = screen.getByTestId('toggle-button');
    fireEvent.click(toggleButton);
    
    // El elemento activo debería mantenerse
    expect(secondMenuItem.getAttribute('data-active')).toBe('true');
  });

  test('pasa las props correctas al componente SideMenu', () => {
    render(<SideMenuWrapper menuItems={mockMenuItems} onMenuSelect={mockOnMenuSelect} />);
    
    // Verificar que el componente mock recibe las props correctas
    const sideMenu = screen.getByTestId('side-menu');
    expect(sideMenu).toBeInTheDocument();
    
    // Verificar que los elementos del menú están presentes
    mockMenuItems.forEach((item, index) => {
      const menuItem = screen.getByTestId(`menu-item-${index}`);
      expect(menuItem).toHaveTextContent(item.label);
    });
  });
}); 