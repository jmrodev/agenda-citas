import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from './LoginForm';
import { vi } from 'vitest';

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

describe('LoginForm', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renderiza el formulario de login', () => {
    renderWithRouter(<LoginForm onSubmit={mockOnSubmit} />);
    
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
    expect(screen.getByLabelText('Usuario *')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña *')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Iniciar Sesión' })).toBeInTheDocument();
  });

  test('maneja cambios en los campos del formulario', () => {
    renderWithRouter(<LoginForm onSubmit={mockOnSubmit} />);
    
    const usernameInput = screen.getByLabelText('Usuario *');
    const passwordInput = screen.getByLabelText('Contraseña *');
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpass' } });
    
    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('testpass');
  });

  test('llama onSubmit con los datos correctos', async () => {
    mockOnSubmit.mockResolvedValue();
    renderWithRouter(<LoginForm onSubmit={mockOnSubmit} />);
    
    const usernameInput = screen.getByLabelText('Usuario *');
    const passwordInput = screen.getByLabelText('Contraseña *');
    const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' });
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpass' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'testpass'
      });
    });
  });

  test('deshabilita el botón cuando los campos están vacíos', () => {
    renderWithRouter(<LoginForm onSubmit={mockOnSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' });
    expect(submitButton).toBeDisabled();
  });

  test('habilita el botón cuando ambos campos están llenos', () => {
    renderWithRouter(<LoginForm onSubmit={mockOnSubmit} />);
    
    const usernameInput = screen.getByLabelText('Usuario *');
    const passwordInput = screen.getByLabelText('Contraseña *');
    const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' });
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpass' } });
    
    expect(submitButton).not.toBeDisabled();
  });

  test('muestra estado de loading durante el envío', async () => {
    mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    renderWithRouter(<LoginForm onSubmit={mockOnSubmit} />);
    
    const usernameInput = screen.getByLabelText('Usuario *');
    const passwordInput = screen.getByLabelText('Contraseña *');
    const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' });
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpass' } });
    fireEvent.click(submitButton);
    
    expect(screen.getByText('Iniciando sesión...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  test('muestra error cuando onSubmit falla', async () => {
    const errorMessage = 'Credenciales inválidas';
    mockOnSubmit.mockRejectedValue(new Error(errorMessage));
    renderWithRouter(<LoginForm onSubmit={mockOnSubmit} />);
    
    const usernameInput = screen.getByLabelText('Usuario *');
    const passwordInput = screen.getByLabelText('Contraseña *');
    const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' });
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpass' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  test('muestra serverError cuando se proporciona', () => {
    const serverError = 'Error del servidor';
    renderWithRouter(<LoginForm onSubmit={mockOnSubmit} serverError={serverError} />);
    
    expect(screen.getByText(serverError)).toBeInTheDocument();
  });

  test('muestra estado de loading cuando isLoading es true', () => {
    renderWithRouter(<LoginForm onSubmit={mockOnSubmit} isLoading={true} />);
    
    expect(screen.getByText('Iniciando sesión...')).toBeInTheDocument();
  });

  test('deshabilita el botón cuando isLoading es true', () => {
    renderWithRouter(<LoginForm onSubmit={mockOnSubmit} isLoading={true} />);
    
    const submitButton = screen.getByRole('button', { name: 'Iniciando sesión...' });
    expect(submitButton).toBeDisabled();
  });

  test('previene envío múltiple durante el proceso', async () => {
    mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    renderWithRouter(<LoginForm onSubmit={mockOnSubmit} />);
    
    const usernameInput = screen.getByLabelText('Usuario *');
    const passwordInput = screen.getByLabelText('Contraseña *');
    const submitButton = screen.getByRole('button', { name: 'Iniciar Sesión' });
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpass' } });
    
    // Hacer click múltiples veces
    fireEvent.click(submitButton);
    fireEvent.click(submitButton);
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });
  });
}); 