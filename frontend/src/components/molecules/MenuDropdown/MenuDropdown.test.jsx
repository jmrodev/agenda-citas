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

    // Verificar clases y estructura de una opción
    const perfilButton = screen.getByRole('button', { name: 'Perfil' });
    expect(perfilButton).toHaveClass('dropdownItem');
    expect(perfilButton).toHaveAttribute('type', 'button');
    // eslint-disable-next-line testing-library/no-node-access
    expect(perfilButton.querySelector('.icon')).toHaveTextContent('👤');
    // eslint-disable-next-line testing-library/no-node-access
    expect(perfilButton.querySelector('.label')).toHaveTextContent('Perfil');

    // Verificar clase del contenedor principal
    expect(screen.getByTestId('menu-dropdown')).toHaveClass('dropdown');
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

  test('aplica estilos de posicionamiento basados en anchorRef', () => {
    // anchorRef mockeado en beforeEach con offsetLeft: 10, offsetTop: 20, offsetHeight: 30
    render(
      <MenuDropdown
        options={mockOptions}
        open={true}
        anchorRef={mockAnchorElement}
        onOptionClick={mockOnOptionClick}
      />
    );
    const dropdownElement = screen.getByTestId('menu-dropdown');
    expect(dropdownElement).toHaveStyle('left: 10px');
    expect(dropdownElement).toHaveStyle('top: 50px'); // offsetTop (20) + offsetHeight (30)
  });

  test('maneja anchorRef nulo o sin propiedades de offset (no debería fallar, pero el estilo podría ser 0 o NaN)', () => {
    // Si anchorRef es null o no tiene las propiedades, offsetLeft/Top/Height serán undefined.
    // undefined + undefined = NaN. left: NaNpx no es un estilo válido y no se aplicará o será ignorado.
    // El componente debería ser robusto a esto.
    const { rerender } = render(
      <MenuDropdown options={mockOptions} open={true} anchorRef={null} onOptionClick={mockOnOptionClick} />
    );
    let dropdownElement = screen.getByTestId('menu-dropdown');
    // JSDOM puede no aplicar estilos si el valor es NaNpx. O puede aplicar 'left: NaNpx'.
    // Verificamos que no tiene un estilo 'left' explícito con un número, o que es '0px' o 'auto' si es el caso.
    // La forma más segura es verificar que no tiene un estilo problemático o que el componente no falla.
    // En este caso, style={{left: undefined}} no aplicará el estilo 'left'.
    expect(dropdownElement.style.left).toBe(''); // No se aplica estilo 'left' si anchorRef es null
    expect(dropdownElement.style.top).toBe('');  // No se aplica estilo 'top'

    const incompleteAnchorRef = document.createElement('div'); // No tiene offset* props
    rerender(
       <MenuDropdown options={mockOptions} open={true} anchorRef={incompleteAnchorRef} onOptionClick={mockOnOptionClick} />
    );
    dropdownElement = screen.getByTestId('menu-dropdown');
    expect(dropdownElement.style.left).toBe('');
    expect(dropdownElement.style.top).toBe('');
  });
}); 