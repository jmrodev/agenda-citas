import React from 'react';
import { render, screen } from '@testing-library/react';
import StatusIndicator from './StatusIndicator';
import { vi } from 'vitest';

// Mockear el átomo Chip
vi.mock('../../atoms/Chip/Chip', () => ({
  default: vi.fn(({ children, className }) => <span data-testid="mock-chip" className={className}>{children}</span>),
}));

describe('StatusIndicator Component', () => {
  const statusText = "Activo";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renderiza el texto de status con su clase y el contenedor principal con su clase', () => {
    render(<StatusIndicator status={statusText} data-testid="status-indicator-test" />);

    const indicatorElement = screen.getByTestId('status-indicator-test');
    expect(indicatorElement).toBeInTheDocument();
    expect(indicatorElement).toHaveClass('statusIndicator'); // Clase del div principal

    const statusSpan = screen.getByText(statusText);
    expect(statusSpan).toBeInTheDocument();
    expect(statusSpan.tagName).toBe('SPAN');
    expect(statusSpan).toHaveClass('status');
  });

  test('renderiza el icono dentro de un span.icon cuando se proporciona', () => {
    const iconNode = <span data-testid="status-icon-content">⏳</span>;
    render(<StatusIndicator status="Pendiente" icon={iconNode} />);

    const renderedIcon = screen.getByTestId('status-icon-content');
    expect(renderedIcon).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-node-access
    const iconWrapper = renderedIcon.parentElement;
    expect(iconWrapper).toHaveClass('icon');
  });

  test('no renderiza el span.icon si no se proporciona icono', () => {
    // eslint-disable-next-line testing-library/no-container
    const { container } = render(<StatusIndicator status={statusText} />);
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.querySelector('span.icon')).not.toBeInTheDocument();
  });

  test('renderiza Chip (mock) con su clase cuando se proporciona la prop chip', () => {
    const chipText = "OK";
    render(<StatusIndicator status="Completado" chip={chipText} />);

    const ChipMock = require('../../atoms/Chip/Chip').default;
    expect(ChipMock).toHaveBeenCalledTimes(1);
    expect(ChipMock).toHaveBeenCalledWith(expect.objectContaining({ children: chipText, className: 'chip' }), {});

    const mockChipElement = screen.getByTestId('mock-chip');
    expect(mockChipElement).toBeInTheDocument();
    expect(mockChipElement).toHaveTextContent(chipText);
    expect(mockChipElement).toHaveClass('chip'); // Clase aplicada por StatusIndicator al Chip
  });

  test('no renderiza Chip si la prop chip es vacía o no se proporciona', () => {
    const { rerender } = render(<StatusIndicator status={statusText} chip="" />);
    expect(require('../../atoms/Chip/Chip').default).not.toHaveBeenCalled();
    expect(screen.queryByTestId('mock-chip')).not.toBeInTheDocument();

    rerender(<StatusIndicator status={statusText} />); // chip undefined
    expect(require('../../atoms/Chip/Chip').default).not.toHaveBeenCalled();
    expect(screen.queryByTestId('mock-chip')).not.toBeInTheDocument();
  });

  test('renderiza correctamente si status es una cadena vacía o null', () => {
    const { rerender } = render(<StatusIndicator status="" />);
    expect(screen.getByTestId('status-indicator-test').querySelector('.status')).toHaveTextContent('');

    rerender(<StatusIndicator status={null} />);
    expect(screen.getByTestId('status-indicator-test').querySelector('.status')).toHaveTextContent('');
  });


  test('aplica className, style y otras props al div contenedor principal', () => {
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