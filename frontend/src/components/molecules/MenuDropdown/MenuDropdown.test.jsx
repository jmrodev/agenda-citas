import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import MenuDropdown from './MenuDropdown';

describe('MenuDropdown', () => {
  const mockOptions = [
    { label: 'Perfil', icon: '👤' },
    { label: 'Configuración', icon: '⚙️' },
    { label: 'Cerrar Sesión', icon: '🚪' },
  ];
  const mockOnOptionClick = vi.fn();

  let mockAnchorElement;

  beforeEach(() => {
    vi.clearAllMocks();
    // Create a mock DOM element for anchorRef before each test
    mockAnchorElement = document.createElement('button');
    // JSDOM doesn't implement layout properties like offsetLeft, offsetTop, offsetHeight.
    // We need to define them if the component relies on them for positioning.
    Object.defineProperty(mockAnchorElement, 'offsetLeft', { configurable: true, value: 10 });
    Object.defineProperty(mockAnchorElement, 'offsetTop', { configurable: true, value: 20 });
    Object.defineProperty(mockAnchorElement, 'offsetHeight', { configurable: true, value: 30 });
    // Append to body if needed for some getBoundingClientRect calculations, though not strictly for these props.
    // document.body.appendChild(mockAnchorElement);
  });

  // afterEach(() => {
  //   if (mockAnchorElement && mockAnchorElement.parentElement === document.body) {
  //     document.body.removeChild(mockAnchorElement);
  //   }
  // });

  test('no renderiza nada cuando open es false', () => {
    const { container } = render(
      <MenuDropdown
        options={mockOptions}
        open={false}
        anchorRef={mockAnchorElement}
        onOptionClick={mockOnOptionClick}
      />
    );
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    expect(container.firstChild).toBeNull();
  });

  test('renderiza las opciones cuando open es true', () => {
    render(
      <MenuDropdown
        options={mockOptions}
        open={true}
        anchorRef={mockAnchorElement}
        onOptionClick={mockOnOptionClick}
      />
    );

    expect(screen.getByText('Perfil')).toBeInTheDocument();
    expect(screen.getByText('Configuración')).toBeInTheDocument();
    expect(screen.getByText('Cerrar Sesión')).toBeInTheDocument();
    expect(screen.getByText('👤')).toBeInTheDocument(); // Icon for Perfil
  });

  test('llama a onOptionClick con el índice correcto cuando se hace click en una opción', () => {
    render(
      <MenuDropdown
        options={mockOptions}
        open={true}
        anchorRef={mockAnchorElement}
        onOptionClick={mockOnOptionClick}
      />
    );

    fireEvent.click(screen.getByText('Configuración'));
    expect(mockOnOptionClick).toHaveBeenCalledWith(1); // 'Configuración' is at index 1
  });

  test('renderiza correctamente sin opciones pero el contenedor está presente', () => {
    render(
      <MenuDropdown
        options={[]}
        open={true}
        anchorRef={mockAnchorElement}
        onOptionClick={mockOnOptionClick}
      />
    );
    // The dropdown div itself should render (it has a data-testid by default now)
    expect(screen.getByTestId('menu-dropdown')).toBeInTheDocument();
    expect(screen.queryByText('Perfil')).not.toBeInTheDocument();
  });
}); 