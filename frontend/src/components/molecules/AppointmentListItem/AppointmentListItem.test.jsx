import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import AppointmentListItem from './AppointmentListItem';

test('renderiza el elemento de lista de cita y maneja el click', () => {
  const mockOnClick = vi.fn();
  const testProps = {
    time: "10:00 AM",
    patient: "Juan Pérez",
    doctor: "Dra. Ana García",
    status: "Confirmada"
  };

  render(
    <AppointmentListItem
      {...testProps}
      onClick={mockOnClick}
    />
  );

  expect(screen.getByText(testProps.time)).toBeInTheDocument();
  expect(screen.getByText(testProps.patient)).toBeInTheDocument();
  expect(screen.getByText(testProps.doctor)).toBeInTheDocument();
  expect(screen.getByText(testProps.status)).toBeInTheDocument();

  // Simular click
  const itemElement = screen.getByRole('button'); // El div tiene role="button"
  fireEvent.click(itemElement);
  expect(mockOnClick).toHaveBeenCalledTimes(1);
}); 