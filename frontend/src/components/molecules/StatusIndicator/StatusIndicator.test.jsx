import { render, screen } from '@testing-library/react';
import StatusIndicator from './StatusIndicator';

describe('StatusIndicator', () => {
  test('renderiza el indicador de estado con el texto y testid correctos', () => {
    const statusText = "Activo";
    render(<StatusIndicator status={statusText} data-testid="status-indicator-test" />);

    const indicatorElement = screen.getByTestId('status-indicator-test');
    expect(indicatorElement).toBeInTheDocument();
    // The text is inside a span, check if the container has it or query the span directly
    expect(indicatorElement).toHaveTextContent(statusText);

    // More specific check for the status text itself
    expect(screen.getByText(statusText)).toBeInTheDocument();
  });

  test('renderiza el icono cuando se proporciona', () => {
    const statusText = "Pendiente";
    const iconElement = <span data-testid="status-icon">⏳</span>;
    render(<StatusIndicator status={statusText} icon={iconElement} data-testid="indicator-with-icon"/>);

    const indicator = screen.getByTestId('indicator-with-icon');
    expect(screen.getByTestId('status-icon')).toBeInTheDocument();
    expect(indicator).toHaveTextContent(statusText);
  });

  test('renderiza el chip cuando se proporciona', () => {
    const statusText = "Completado";
    const chipText = "OK";
    render(<StatusIndicator status={statusText} chip={chipText} data-testid="indicator-with-chip"/>);

    const indicator = screen.getByTestId('indicator-with-chip');
    // Chip component renders its children, so we can find chipText
    // This assumes the Chip component renders its children directly or within an identifiable way.
    expect(indicator).toHaveTextContent(chipText);
    expect(indicator).toHaveTextContent(statusText);
    // More robust: query for chip text specifically if Chip structure is known
    expect(screen.getByText(chipText)).toBeInTheDocument();
  });

  test('aplica clases y estilos personalizados', () => {
    const statusText = "Neutral";
    render(
      <StatusIndicator
        status={statusText}
        className="custom-class"
        style={{ opacity: 0.8 }}
        data-testid="custom-indicator"
      />
    );
    const indicatorElement = screen.getByTestId('custom-indicator');
    expect(indicatorElement).toHaveClass('custom-class');
    expect(indicatorElement).toHaveStyle({ opacity: '0.8' });
    expect(indicatorElement).toHaveTextContent(statusText);
  });
}); 