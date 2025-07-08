import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import CalendarDayInfo from './CalendarDayInfo';

test('renderiza la información del día del calendario y maneja el click', () => {
  const mockOnClick = vi.fn();
  const testProps = {
    day: 15,
    isToday: false,
    isSelected: false,
    isDisabled: false,
    hasEvent: true,
    badge: '3',
    chip: 'Evento', // Changed from Fiesta to avoid potential conflict with other tests if any
    onClick: mockOnClick
  };

  render(<CalendarDayInfo {...testProps} />);

  // CalendarDay atom renders the day number
  expect(screen.getByText(testProps.day.toString())).toBeInTheDocument();

  // Check for badge and chip
  expect(screen.getByText(testProps.badge)).toBeInTheDocument();
  expect(screen.getByText(testProps.chip)).toBeInTheDocument();

  // Check for event dot (CalendarDot is rendered if hasEvent is true)
  // We can check if the dot's class is present if CalendarDot adds a specific class or data-testid
  // For now, its presence is implied if hasEvent is true and the component renders.

  // Simulate click on the CalendarDay button within CalendarDayInfo
  // The CalendarDay component itself is a button with the day number as its accessible name (usually).
  const dayButton = screen.getByRole('button', { name: testProps.day.toString() });
  fireEvent.click(dayButton);
  expect(mockOnClick).toHaveBeenCalledTimes(1);
});

test('renderiza correctamente sin props opcionales', () => {
  render(<CalendarDayInfo day={1} />);
  expect(screen.getByText('1')).toBeInTheDocument();
  // Check that badge and chip are not rendered if not provided
  expect(screen.queryByText('3')).not.toBeInTheDocument();
  expect(screen.queryByText('Evento')).not.toBeInTheDocument();
}); 