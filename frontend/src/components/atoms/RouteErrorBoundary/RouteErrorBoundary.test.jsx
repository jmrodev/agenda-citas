import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RouteErrorBoundaryInternal, { default as RouteErrorBoundaryWrapper } from './RouteErrorBoundary'; // Importar la clase y el wrapper
import { vi } from 'vitest';

// Mock de useNavigate para RouteErrorBoundaryWrapper
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Componente simple que lanza un error
const ProblemChild = ({ shouldThrow = false }) => {
  if (shouldThrow) {
    throw new Error('Test Route Error');
  }
  return <div>Contenido de ruta normal</div>;
};

// Tests para la clase RouteErrorBoundary (interna)
describe('RouteErrorBoundary (Clase Interna)', () => {
  let originalConsoleError;
  let originalWindowLocation;
  let originalWindowHistory;
  const mockNavigateProp = vi.fn();

  beforeEach(() => {
    originalConsoleError = console.error;
    console.error = vi.fn(); // Silenciar errores esperados

    originalWindowLocation = window.location;
    delete window.location;
    window.location = { ...originalWindowLocation, assign: vi.fn(), href: '' };

    originalWindowHistory = window.history;
    delete window.history;
    window.history = { ...originalWindowHistory, back: vi.fn() };

    mockNavigateProp.mockClear();
  });

  afterEach(() => {
    console.error = originalConsoleError;
    window.location = originalWindowLocation;
    window.history = originalWindowHistory;
    vi.restoreAllMocks();
  });

  test('renderiza children cuando no hay error', () => {
    render(
      <RouteErrorBoundaryInternal navigate={mockNavigateProp}>
        <ProblemChild />
      </RouteErrorBoundaryInternal>
    );
    expect(screen.getByText('Contenido de ruta normal')).toBeInTheDocument();
  });

  test('renderiza el fallback UI por defecto cuando un hijo lanza un error', () => {
    render(
      <RouteErrorBoundaryInternal navigate={mockNavigateProp}>
        <ProblemChild shouldThrow />
      </RouteErrorBoundaryInternal>
    );
    expect(screen.getByText('Error en la página')).toBeInTheDocument();
    expect(screen.getByText(/Ha ocurrido un error al cargar esta página/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Intentar de nuevo' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Volver' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ir al inicio' })).toBeInTheDocument();
  });

  test('el botón "Intentar de nuevo" resetea el error y renderiza children', () => {
    const { rerender } = render(
      <RouteErrorBoundaryInternal navigate={mockNavigateProp}>
        <ProblemChild shouldThrow />
      </RouteErrorBoundaryInternal>
    );
    expect(screen.getByText('Error en la página')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Intentar de nuevo' }));

    rerender(
      <RouteErrorBoundaryInternal navigate={mockNavigateProp}>
        <ProblemChild shouldThrow={false} />
      </RouteErrorBoundaryInternal>
    );
    expect(screen.getByText('Contenido de ruta normal')).toBeInTheDocument();
    expect(screen.queryByText('Error en la página')).not.toBeInTheDocument();
  });

  test('botón "Volver" usa navigate(-1) si navigate prop existe', () => {
    render(
      <RouteErrorBoundaryInternal navigate={mockNavigateProp}>
        <ProblemChild shouldThrow />
      </RouteErrorBoundaryInternal>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Volver' }));
    expect(mockNavigateProp).toHaveBeenCalledWith(-1);
    expect(window.history.back).not.toHaveBeenCalled();
  });

  test('botón "Volver" usa window.history.back() si navigate prop NO existe', () => {
    render(
      <RouteErrorBoundaryInternal> {/* Sin prop navigate */}
        <ProblemChild shouldThrow />
      </RouteErrorBoundaryInternal>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Volver' }));
    expect(window.history.back).toHaveBeenCalledTimes(1);
    expect(mockNavigateProp).not.toHaveBeenCalled(); // Asegurar que el mock de la prop no fue llamado
  });

  test('botón "Ir al inicio" usa navigate("/") si navigate prop existe', () => {
    render(
      <RouteErrorBoundaryInternal navigate={mockNavigateProp}>
        <ProblemChild shouldThrow />
      </RouteErrorBoundaryInternal>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Ir al inicio' }));
    expect(mockNavigateProp).toHaveBeenCalledWith('/');
    expect(window.location.assign).not.toHaveBeenCalled();
  });

  test('botón "Ir al inicio" usa window.location.href si navigate prop NO existe', () => {
    render(
      <RouteErrorBoundaryInternal> {/* Sin prop navigate */}
        <ProblemChild shouldThrow />
      </RouteErrorBoundaryInternal>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Ir al inicio' }));
    expect(window.location.href).toBe('/');
    expect(mockNavigateProp).not.toHaveBeenCalled();
  });

  test('muestra detalles del error en modo desarrollo (NODE_ENV=development)', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(
      <RouteErrorBoundaryInternal navigate={mockNavigateProp}>
        <ProblemChild shouldThrow />
      </RouteErrorBoundaryInternal>
    );
    const detailsSummary = screen.getByText('Detalles del error (solo desarrollo)');
    expect(detailsSummary).toBeInTheDocument();
    fireEvent.click(detailsSummary); // Abrir los detalles
    expect(screen.getByText(/Test Route Error/)).toBeInTheDocument();

    process.env.NODE_ENV = originalNodeEnv;
  });
});

// Tests para RouteErrorBoundaryWrapper (exportación por defecto)
describe('RouteErrorBoundaryWrapper', () => {
   beforeEach(() => {
    console.error = vi.fn(); // Silenciar errores esperados
    mockNavigate.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('renderiza children y usa navigate de useNavigation hook', () => {
    render(
      <RouteErrorBoundaryWrapper>
        <ProblemChild shouldThrow />
      </RouteErrorBoundaryWrapper>
    );
    expect(screen.getByText('Error en la página')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Volver' }));
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
}); 