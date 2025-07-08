import React from 'react';
import { render, screen } from '@testing-library/react';
import CardFooter from './CardFooter';
import { vi } from 'vitest';

// Mockear los átomos para verificar que se llaman con las props correctas
// y para controlar su salida en el test.
vi.mock('../../atoms/Chip/Chip', () => ({
  default: vi.fn(({ children, className }) => <div data-testid="mock-chip" className={className}>{children}</div>),
}));
vi.mock('../../atoms/ProgressBar/ProgressBar', () => ({
  default: vi.fn(({ value, className }) => <div data-testid="mock-progressbar" data-value={value} className={className}>Progress: {value}%</div>),
}));
vi.mock('../../atoms/CardActions/CardActions', () => ({
  default: vi.fn(({ children, className }) => <div data-testid="mock-cardactions" className={className}>{children}</div>),
}));


describe('CardFooter Component', () => {
  const childrenText = "Botón de Acción";

  beforeEach(() => {
    // Limpiar mocks antes de cada test
    require('../../atoms/Chip/Chip').default.mockClear();
    require('../../atoms/ProgressBar/ProgressBar').default.mockClear();
    require('../../atoms/CardActions/CardActions').default.mockClear();
  });

  test('renderiza CardActions con children y las clases correctas', () => {
    render(<CardFooter>{childrenText}</CardFooter>);

    const cardActionsMock = require('../../atoms/CardActions/CardActions').default;
    expect(cardActionsMock).toHaveBeenCalledTimes(1);
    expect(cardActionsMock).toHaveBeenCalledWith(expect.objectContaining({ children: childrenText, className: 'actions' }), {});

    expect(screen.getByTestId('mock-cardactions')).toBeInTheDocument();
    expect(screen.getByText(childrenText)).toBeInTheDocument(); // Children dentro del mock de CardActions
    expect(screen.getByTestId('mock-cardactions')).toHaveClass('actions');
  });

  test('renderiza Chip cuando se proporciona la prop chip', () => {
    const chipText = "Etiqueta Info";
    render(<CardFooter chip={chipText}>{childrenText}</CardFooter>);

    const chipMock = require('../../atoms/Chip/Chip').default;
    expect(chipMock).toHaveBeenCalledTimes(1);
    expect(chipMock).toHaveBeenCalledWith(expect.objectContaining({ children: chipText, className: 'chip' }), {});

    expect(screen.getByTestId('mock-chip')).toBeInTheDocument();
    expect(screen.getByText(chipText)).toBeInTheDocument();
    expect(screen.getByTestId('mock-chip')).toHaveClass('chip');
  });

  test('no renderiza Chip si la prop chip está vacía o no se proporciona', () => {
    const { rerender } = render(<CardFooter chip="">{childrenText}</CardFooter>);
    expect(require('../../atoms/Chip/Chip').default).not.toHaveBeenCalled();
    expect(screen.queryByTestId('mock-chip')).not.toBeInTheDocument();

    rerender(<CardFooter>{childrenText}</CardFooter>); // chip es undefined
    expect(require('../../atoms/Chip/Chip').default).not.toHaveBeenCalled();
    expect(screen.queryByTestId('mock-chip')).not.toBeInTheDocument();
  });

  test('renderiza ProgressBar cuando se proporciona la prop progress (no null)', () => {
    const progressValue = 75;
    render(<CardFooter progress={progressValue}>{childrenText}</CardFooter>);

    const progressBarMock = require('../../atoms/ProgressBar/ProgressBar').default;
    expect(progressBarMock).toHaveBeenCalledTimes(1);
    expect(progressBarMock).toHaveBeenCalledWith(expect.objectContaining({ value: progressValue, className: 'progress' }), {});

    expect(screen.getByTestId('mock-progressbar')).toBeInTheDocument();
    expect(screen.getByText(`Progress: ${progressValue}%`)).toBeInTheDocument();
    expect(screen.getByTestId('mock-progressbar')).toHaveClass('progress');
  });

  test('renderiza ProgressBar con value 0 si progress es 0', () => {
    render(<CardFooter progress={0}>{childrenText}</CardFooter>);
    const progressBarMock = require('../../atoms/ProgressBar/ProgressBar').default;
    expect(progressBarMock).toHaveBeenCalledWith(expect.objectContaining({ value: 0, className: 'progress' }), {});
    expect(screen.getByTestId('mock-progressbar')).toHaveAttribute('data-value', '0');
  });

  test('no renderiza ProgressBar si la prop progress es null', () => {
    render(<CardFooter progress={null}>{childrenText}</CardFooter>);
    expect(require('../../atoms/ProgressBar/ProgressBar').default).not.toHaveBeenCalled();
    expect(screen.queryByTestId('mock-progressbar')).not.toBeInTheDocument();
  });

  test('aplica className, style y otras props al div contenedor principal', () => {
    const customClass = "mi-pie-tarjeta";
    const customStyle = { padding: '20px' };
    const { container } = render(
      <CardFooter
        className={customClass}
        style={customStyle}
        data-footer-id="footer-1"
      >
        {childrenText}
      </CardFooter>
    );
    // El contenedor principal es el que tiene la clase cardFooter
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass('cardFooter', customClass);
    expect(mainContainer).toHaveStyle('padding: 20px;');
    expect(mainContainer).toHaveAttribute('data-footer-id', 'footer-1');
  });
}); 