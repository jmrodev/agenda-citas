import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import CalendarHeader from './CalendarHeader';

describe('CalendarHeader', () => {
  test('renderiza el encabezado del calendario con mes y año', () => {
    const mockOnPrev = vi.fn();
    const mockOnNext = vi.fn();
    render(<CalendarHeader month={0} year={2024} onPrev={mockOnPrev} onNext={mockOnNext} />);

    expect(screen.getByText('Enero 2024')).toBeInTheDocument(); // month={0} is Enero

    // Check navigation buttons
    const prevButton = screen.getByRole('button', { name: 'Mes anterior' });
    const nextButton = screen.getByRole('button', { name: 'Mes siguiente' });

    fireEvent.click(prevButton);
    expect(mockOnPrev).toHaveBeenCalledTimes(1);

    fireEvent.click(nextButton);
    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });

  test('renderiza selectores cuando showSelectors es true', () => {
    const mockOnMonthChange = vi.fn();
    const mockOnYearChange = vi.fn();
    render(
      <CalendarHeader
        month={5} // Junio
        year={2023}
        onPrev={vi.fn()}
        onNext={vi.fn()}
        onMonthChange={mockOnMonthChange}
        onYearChange={mockOnYearChange}
        showSelectors={true}
      />
    );

    // Assuming selects don't have explicit accessible names, we find them by current value.
    // It would be better if the component's selects had aria-labels.
    const monthSelect = screen.getByDisplayValue('Junio'); // month={5} is Junio
    const yearSelect = screen.getByDisplayValue('2023');

    expect(monthSelect).toBeInTheDocument();
    expect(yearSelect).toBeInTheDocument();

    // Example of changing month via select
    fireEvent.change(monthSelect, { target: { value: '0' } }); // Change to Enero (value "0")
    expect(mockOnMonthChange).toHaveBeenCalledWith(0);

    // Example of changing year via select
    fireEvent.change(yearSelect, { target: { value: '2024' } });
    expect(mockOnYearChange).toHaveBeenCalledWith(2024);
  });
}); 