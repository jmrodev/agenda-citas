import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';
import { vi } from 'vitest';

// Componente simple que lanza un error
const ProblemChild = ({ shouldThrow = false }) => {
  if (shouldThrow) {
    throw new Error('Test Error');
  }
  return <div>Contenido normal</div>;
};

describe('ErrorBoundary Component', () => {
  let originalConsoleError;
  let originalWindowLocation;

  beforeEach(() => {
    // Mock console.error para evitar logs durante los tests de error
    originalConsoleError = console.error;
    console.error = vi.fn();

    // Mock window.location
    originalWindowLocation = window.location;
    delete window.location;
    window.location = {
      ...originalWindowLocation, // Preservar otras propiedades si las hubiera
      reload: vi.fn(),
      assign: vi.fn(), // para window.location.href = '/'
      href: ''
    };
  });

  afterEach(() => {
    // Restaurar mocks
    console.error = originalConsoleError;
    window.location = originalWindowLocation;
    vi.restoreAllMocks();
  });

  test('renderiza children cuando no hay error', () => {
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );
    expect(screen.getByText('Contenido normal')).toBeInTheDocument();
  });

  test('renderiza el fallback UI por defecto cuando un hijo lanza un error', () => {
    render(
      <ErrorBoundary>
        <ProblemChild shouldThrow />
      </ErrorBoundary>
    );

    expect(screen.getByText('Algo salió mal')).toBeInTheDocument();
    expect(screen.getByText(/Ha ocurrido un error inesperado/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Intentar de nuevo' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ir al inicio' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Recargar página' })).toBeInTheDocument();
  });

  test('renderiza un fallback personalizado cuando se proporciona y un hijo lanza un error', () => {
    const fallbackMessage = 'Oops, error personalizado!';
    render(
      <ErrorBoundary fallback={<div>{fallbackMessage}</div>}>
        <ProblemChild shouldThrow />
      </ErrorBoundary>
    );
    expect(screen.getByText(fallbackMessage)).toBeInTheDocument();
    // No debería mostrar el fallback por defecto
    expect(screen.queryByText('Algo salió mal')).not.toBeInTheDocument();
  });

  test('el botón "Intentar de nuevo" resetea el error y renderiza children', () => {
    render(
      <ErrorBoundary>
        <ProblemChild shouldThrow />
      </ErrorBoundary>
    );
    // Inicialmente muestra error
    expect(screen.getByText('Algo salió mal')).toBeInTheDocument();

    // Simular que el ProblemChild ya no lanza error después del reintento
    // Esto es difícil de hacer directamente sin re-renderizar con props diferentes.
    // Lo que podemos testear es que handleRetry se llama y el estado hasError cambia.
    // Para un test más completo, necesitaríamos una forma de que ProblemChild se comporte diferente.

    // Por ahora, nos enfocamos en que handleRetry se llama y limpia el estado.
    // El componente ErrorBoundary se re-renderizará y si el hijo ya no falla, lo mostrará.
    // Para simular esto, re-renderizamos con un hijo que no falle después del clic.

    const { rerender } = render(
      <ErrorBoundary>
        <ProblemChild shouldThrow />
      </ErrorBoundary>
    );
    expect(screen.getByText('Algo salió mal')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Intentar de nuevo' }));

    // Re-renderizar con el hijo ya no problemático
    rerender(
      <ErrorBoundary>
        <ProblemChild shouldThrow={false} />
      </ErrorBoundary>
    );
    expect(screen.getByText('Contenido normal')).toBeInTheDocument();
    expect(screen.queryByText('Algo salió mal')).not.toBeInTheDocument();
  });

  test('el botón "Ir al inicio" navega a la raíz', () => {
    render(
      <ErrorBoundary>
        <ProblemChild shouldThrow />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Ir al inicio' }));
    expect(window.location.href).toBe('/');
  });

  test('el botón "Recargar página" llama a window.location.reload', () => {
    render(
      <ErrorBoundary>
        <ProblemChild shouldThrow />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Recargar página' }));
    expect(window.location.reload).toHaveBeenCalledTimes(1);
  });

  // Testear los detalles del error en desarrollo podría ser así:
  test('muestra detalles del error en modo desarrollo (NODE_ENV=development)', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development'; // Mockear NODE_ENV

    render(
      <ErrorBoundary>
        <ProblemChild shouldThrow />
      </ErrorBoundary>
    );
    expect(screen.getByText('Algo salió mal')).toBeInTheDocument();
    const detailsElement = screen.getByText('Detalles del error (solo desarrollo)');
    expect(detailsElement).toBeInTheDocument();

    // Abrir los detalles para verificar el contenido
    fireEvent.click(detailsElement);
    expect(screen.getByText(/Test Error/)).toBeInTheDocument(); // El mensaje del error

    process.env.NODE_ENV = originalNodeEnv; // Restaurar NODE_ENV
  });

  test('NO muestra detalles del error si NODE_ENV no es "development"', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    render(
      <ErrorBoundary>
        <ProblemChild shouldThrow />
      </ErrorBoundary>
    );
    expect(screen.getByText('Algo salió mal')).toBeInTheDocument();
    expect(screen.queryByText('Detalles del error (solo desarrollo)')).not.toBeInTheDocument();

    process.env.NODE_ENV = originalNodeEnv;
  });
}); 