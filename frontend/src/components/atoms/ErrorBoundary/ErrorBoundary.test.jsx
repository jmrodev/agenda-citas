import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

test('renderiza el fallback cuando hay un error', () => {
  const ThrowError = () => {
    throw new Error('Error de prueba');
  };

  render(
    <ErrorBoundary fallback={<div>Error capturado</div>}>
      <ThrowError />
    </ErrorBoundary>
  );

  expect(screen.getByText('Error capturado')).toBeInTheDocument();
}); 