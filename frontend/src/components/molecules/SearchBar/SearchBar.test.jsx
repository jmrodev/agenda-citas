import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from './SearchBar';
import { vi } from 'vitest';

// Mockear los átomos
vi.mock('../../atoms/Input/Input', () => ({
  default: vi.fn((props) => <input data-testid="mock-input" {...props} />),
}));
vi.mock('../../atoms/IconButton/IconButton', () => ({
  default: vi.fn(({ children, onClick, className, 'aria-label': ariaLabel }) => (
    <button data-testid={`mock-iconbutton-${ariaLabel?.replace(/\s+/g, '-').toLowerCase()}`} onClick={onClick} className={className} aria-label={ariaLabel}>
      {children}
    </button>
  )),
}));
vi.mock('../../atoms/Icon/Icon', () => ({
  default: vi.fn(({ name, size }) => <span data-testid={`mock-icon-${name}`} data-size={size}>{name}-icon</span>),
}));


describe('SearchBar Component', () => {
  const mockOnChange = vi.fn();
  const mockOnClear = vi.fn();
  const defaultPlaceholder = 'Buscar...';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renderiza Input, Icono de búsqueda y clases correctas', () => {
    render(<SearchBar value="" onChange={mockOnChange} placeholder={defaultPlaceholder} />);

    // Input
    const InputMock = require('../../atoms/Input/Input').default;
    expect(InputMock).toHaveBeenCalledTimes(1);
    expect(InputMock).toHaveBeenCalledWith(expect.objectContaining({
      type: 'search',
      value: "",
      onChange: mockOnChange,
      placeholder: defaultPlaceholder,
      className: 'input'
    }), {});
    expect(screen.getByTestId('mock-input')).toBeInTheDocument();

    // IconButton de búsqueda
    const IconButtonMock = require('../../atoms/IconButton/IconButton').default;
    expect(IconButtonMock).toHaveBeenCalledWith(
      expect.objectContaining({ 'aria-label': 'Buscar', className: 'iconBtn' }),
      {}
    );
    expect(screen.getByTestId('mock-iconbutton-buscar')).toBeInTheDocument();

    // Icon de búsqueda dentro del IconButton
    const IconMock = require('../../atoms/Icon/Icon').default;
    expect(IconMock).toHaveBeenCalledWith(expect.objectContaining({ name: 'search', size: 18 }), {});
    expect(screen.getByTestId('mock-icon-search')).toBeInTheDocument();

    // Contenedor principal
    // eslint-disable-next-line testing-library/no-container
    const { container } = render(<SearchBar value="" onChange={mockOnChange} />);
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.firstChild).toHaveClass('searchBar');
  });

  test('no muestra el botón de limpiar si value está vacío', () => {
    render(<SearchBar value="" onChange={mockOnChange} onClear={mockOnClear} />);
    expect(screen.queryByTestId('mock-iconbutton-limpiar')).not.toBeInTheDocument();
  });

  test('no muestra el botón de limpiar si onClear no se proporciona', () => {
    render(<SearchBar value="texto" onChange={mockOnChange} onClear={undefined} />);
    expect(screen.queryByTestId('mock-iconbutton-limpiar')).not.toBeInTheDocument();
  });

  test('muestra el botón de limpiar cuando hay value y onClear, y llama a onClear al hacer click', () => {
    render(<SearchBar value="texto de búsqueda" onChange={mockOnChange} onClear={mockOnClear} />);

    const IconButtonMock = require('../../atoms/IconButton/IconButton').default;
    // Debería haber dos IconButtons: Buscar y Limpiar
    expect(IconButtonMock).toHaveBeenCalledTimes(2);

    const clearButton = screen.getByTestId('mock-iconbutton-limpiar');
    expect(clearButton).toBeInTheDocument();
    expect(clearButton).toHaveClass('clearBtn');

    // Icon de limpiar dentro del IconButton
    const IconMock = require('../../atoms/Icon/Icon').default;
    // La segunda llamada a IconMock debería ser para el icono 'close'
    expect(IconMock).toHaveBeenLastCalledWith(expect.objectContaining({ name: 'close', size: 18 }), {});
    expect(screen.getByTestId('mock-icon-close')).toBeInTheDocument();

    fireEvent.click(clearButton);
    expect(mockOnClear).toHaveBeenCalledTimes(1);
  });

  test('Input recibe y muestra el valor correcto', () => {
    const testValue = "Búsqueda específica";
    render(<SearchBar value={testValue} onChange={mockOnChange} />);
    const inputElement = screen.getByTestId('mock-input');
    expect(inputElement).toHaveValue(testValue);
  });

  test('Input llama a onChange al cambiar su valor', () => {
    render(<SearchBar value="" onChange={mockOnChange} />);
    const inputElement = screen.getByTestId('mock-input');
    const mockEvent = { target: { value: 'nuevo' } };

    // El mock de Input recibe la prop onChange de SearchBar directamente
    const InputMock = require('../../atoms/Input/Input').default;
    const passedOnChange = InputMock.mock.calls[0][0].onChange;
    passedOnChange(mockEvent); // Simular la llamada a onChange desde el Input

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(mockEvent);
  });

  test('aplica className, style y otras props al div contenedor principal', () => {
    const customClass = "mi-barra-busqueda";
    const customStyle = { marginTop: '10px' };
    const { container } = render(
      <SearchBar
        value=""
        onChange={mockOnChange}
        className={customClass}
        style={customStyle}
        data-searchbar-id="search-1"
      />
    );
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass('searchBar', customClass);
    expect(mainContainer).toHaveStyle('margin-top: 10px;');
    expect(mainContainer).toHaveAttribute('data-searchbar-id', 'search-1');
  });
}); 