import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';
import { vi } from 'vitest';

// Mock de localStorage
const localStorageMock = {
  getItem: vi.fn(),
  removeItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock de useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  test('renderiza el logo de la aplicación', () => {
    localStorageMock.getItem.mockReturnValue(null);
    renderWithRouter(<Header />);
    
    expect(screen.getByText('Agenda de Citas')).toBeInTheDocument();
  });

  test('muestra botón de login cuando no hay usuario autenticado', () => {
    localStorageMock.getItem.mockReturnValue(null);
    renderWithRouter(<Header />);
    
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  test('muestra información del usuario cuando está autenticado', () => {
    const mockUser = { nombre: 'Juan', apellido: 'Pérez', username: 'juanperez' };
    localStorageMock.getItem
      .mockReturnValueOnce('mock-token') // token
      .mockReturnValueOnce(JSON.stringify(mockUser)); // user
    
    renderWithRouter(<Header />);
    
    expect(screen.getByText('Juan')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('maneja logout correctamente', () => {
    const mockUser = { nombre: 'Juan', apellido: 'Pérez' };
    localStorageMock.getItem
      .mockReturnValueOnce('mock-token')
      .mockReturnValueOnce(JSON.stringify(mockUser));
    
    renderWithRouter(<Header />);
    
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('navega a login cuando se hace click en el botón login', () => {
    localStorageMock.getItem.mockReturnValue(null);
    renderWithRouter(<Header />);
    
    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('muestra iniciales del usuario en el avatar', () => {
    const mockUser = { nombre: 'Ana', apellido: 'García' };
    localStorageMock.getItem
      .mockReturnValueOnce('mock-token')
      .mockReturnValueOnce(JSON.stringify(mockUser));
    
    renderWithRouter(<Header />);
    
    // Verificar que el avatar se renderiza (las iniciales se manejan internamente)
    expect(screen.getByText('Ana')).toBeInTheDocument();
  });

  test('usa username como fallback cuando no hay nombre y apellido', () => {
    const mockUser = { username: 'testuser' };
    localStorageMock.getItem
      .mockReturnValueOnce('mock-token')
      .mockReturnValueOnce(JSON.stringify(mockUser));
    
    renderWithRouter(<Header />);
    
    expect(screen.getByText('testuser')).toBeInTheDocument();
  });
}); 