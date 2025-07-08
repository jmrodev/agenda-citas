import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import CalendarHeader from './CalendarHeader';

// Mock IconButton para simplificar, ya que sus tests son separados
// y para evitar dependencias en la estructura interna del icono (emoji span)
vi.mock('../../atoms/IconButton/IconButton', () => ({
  default: ({ onClick, 'aria-label': ariaLabel, children, className }) => (
    <button onClick={onClick} aria-label={ariaLabel} className={className}>
      {children || ariaLabel} {/* Mostrar ariaLabel si no hay children para facilitar la depuración */}
    </button>
  ),
}));


describe('CalendarHeader Component', () => {
  const mockOnPrev = vi.fn();
  const mockOnNext = vi.fn();
  const mockOnMonthChange = vi.fn();
  const mockOnYearChange = vi.fn();

  beforeEach(() => {
    mockOnPrev.mockClear();
    mockOnNext.mockClear();
    mockOnMonthChange.mockClear();
    mockOnYearChange.mockClear();
  });

  test('renderiza título (mes y año), botones de navegación y clases por defecto', () => {
    render(<CalendarHeader month={0} year={2024} onPrev={mockOnPrev} onNext={mockOnNext} />);

    const titleElement = screen.getByText('Enero 2024'); // month={0} is Enero
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass('title');

    const prevButton = screen.getByRole('button', { name: 'Mes anterior' });
    expect(prevButton).toBeInTheDocument();
    expect(prevButton).toHaveClass('navBtn');
    fireEvent.click(prevButton);
    expect(mockOnPrev).toHaveBeenCalledTimes(1);

    const nextButton = screen.getByRole('button', { name: 'Mes siguiente' });
    expect(nextButton).toBeInTheDocument();
    expect(nextButton).toHaveClass('navBtn');
    fireEvent.click(nextButton);
    expect(mockOnNext).toHaveBeenCalledTimes(1);

    // eslint-disable-next-line testing-library/no-node-access
    const headerDiv = titleElement.closest('div[class*="calendarHeader"]');
    expect(headerDiv).toHaveClass('calendarHeader');
  });

  test('renderiza selectores de mes y año cuando showSelectors es true', () => {
    render(
      <CalendarHeader
        month={5} // Junio
        year={2023}
        onPrev={mockOnPrev}
        onNext={mockOnNext}
        onMonthChange={mockOnMonthChange}
        onYearChange={mockOnYearChange}
        showSelectors={true}
      />
    );

    // No debería mostrar el título de texto
    expect(screen.queryByText('Junio 2023')).not.toBeInTheDocument();

    const monthSelect = screen.getByRole('combobox', { name: 'Seleccionar mes' });
    expect(monthSelect).toBeInTheDocument();
    expect(monthSelect).toHaveValue('5'); // Junio
    expect(monthSelect).toHaveClass('select');

    const yearSelect = screen.getByRole('combobox', { name: 'Seleccionar año' });
    expect(yearSelect).toBeInTheDocument();
    expect(yearSelect).toHaveValue('2023');
    expect(yearSelect).toHaveClass('select');

    // Verificar opciones del selector de año (rango de 11 años)
    // eslint-disable-next-line testing-library/no-node-access
    expect(yearSelect.options.length).toBe(11);
    expect(screen.getByRole('option', { name: '2018' })).toBeInTheDocument(); // 2023 - 5
    expect(screen.getByRole('option', { name: '2033' })).toBeInTheDocument(); // 2023 + 5 (length 11 means index 10 is +5)

    fireEvent.change(monthSelect, { target: { value: '0' } }); // Enero
    expect(mockOnMonthChange).toHaveBeenCalledWith(0);

    fireEvent.change(yearSelect, { target: { value: '2024' } });
    expect(mockOnYearChange).toHaveBeenCalledWith(2024);
  });

  test('no llama a onMonthChange/onYearChange si no se proporcionan y showSelectors es true', () => {
    render(
      <CalendarHeader
        month={5}
        year={2023}
        onPrev={vi.fn()}
        onNext={vi.fn()}
        showSelectors={true}
        // onMonthChange y onYearChange no se proporcionan
      />
    );
    const monthSelect = screen.getByRole('combobox', { name: 'Seleccionar mes' });
    const yearSelect = screen.getByRole('combobox', { name: 'Seleccionar año' });

    expect(() => fireEvent.change(monthSelect, { target: { value: '0' } })).not.toThrow();
    expect(mockOnMonthChange).not.toHaveBeenCalled();

    expect(() => fireEvent.change(yearSelect, { target: { value: '2024' } })).not.toThrow();
    expect(mockOnYearChange).not.toHaveBeenCalled();
  });

  test('aplica className, style y otras props al div contenedor principal', () => {
    const customClass = "mi-encabezado-calendario";
    const customStyle = { background: 'lightblue' };
    render(
      <CalendarHeader
        month={0}
        year={2024}
        onPrev={vi.fn()}
        onNext={vi.fn()}
        className={customClass}
        style={customStyle}
        data-header-id="header-cal-1"
      />
    );
    const headerDiv = screen.getByText('Enero 2024').closest('div[class*="calendarHeader"]');
    expect(headerDiv).toHaveClass('calendarHeader', customClass);
    expect(headerDiv).toHaveStyle('background: lightblue;');
    expect(headerDiv).toHaveAttribute('data-header-id', 'header-cal-1');
  });
}); 