import { render, screen } from '@testing-library/react';
import RouteErrorBoundary from './RouteErrorBoundary';

test('renderiza el fallback cuando hay un error de ruta', () => {
  const ThrowError = () => {
    throw new Error('Error de ruta');
  };

  render(
    <RouteErrorBoundary>
      <ThrowError />
    </RouteErrorBoundary>
  );

  expect(screen.getByText(/error/i)).toBeInTheDocument();
}); 