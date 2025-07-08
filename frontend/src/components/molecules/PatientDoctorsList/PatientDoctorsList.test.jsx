import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import PatientDoctorsList from './PatientDoctorsList';
import { authFetch } from '../../../auth/authFetch';

// Mockear authFetch
vi.mock('../../../auth/authFetch');

// Mock de window.confirm
global.confirm = vi.fn(() => true); // Simula que el usuario siempre confirma

const mockDoctors = [
  { doctor_id: 1, first_name: 'Juan', last_name: 'Perez', specialty: 'Cardiología', email: 'juan.perez@example.com' },
  { doctor_id: 2, first_name: 'Ana', last_name: 'Gomez', specialty: 'Pediatría', email: 'ana.gomez@example.com' },
];

describe('PatientDoctorsList', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Limpiar mocks antes de cada test
    global.confirm.mockClear(); // Limpiar mock de confirm
  });

  test('renders loading state initially', () => {
    authFetch.mockResolvedValueOnce({ ok: true, json: async () => mockDoctors });
    render(<PatientDoctorsList patientId={1} />);
    expect(screen.getByText('Cargando doctores...')).toBeInTheDocument();
  });

  test('fetches and displays doctors', async () => {
    authFetch.mockResolvedValueOnce({ ok: true, json: async () => mockDoctors });
    render(<PatientDoctorsList patientId={1} />);

    await waitFor(() => {
      expect(screen.getByText('Juan Perez')).toBeInTheDocument();
      expect(screen.getByText('Cardiología')).toBeInTheDocument();
      expect(screen.getByText('Ana Gomez')).toBeInTheDocument();
      expect(screen.getByText('Pediatría')).toBeInTheDocument();
      expect(screen.getByText('2 doctores')).toBeInTheDocument(); // Badge
    });
  });

  test('displays no doctors message if API returns empty array', async () => {
    authFetch.mockResolvedValueOnce({ ok: true, json: async () => [] });
    render(<PatientDoctorsList patientId={1} />);

    await waitFor(() => {
      expect(screen.getByText('No hay doctores asignados a este paciente')).toBeInTheDocument();
      expect(screen.getByText('0 doctores')).toBeInTheDocument();
    });
  });

  test('displays error message on fetch failure', async () => {
    authFetch.mockResolvedValueOnce({ ok: false, status: 500, json: async () => ({ message: 'Error del servidor' }) });
    render(<PatientDoctorsList patientId={1} />);

    await waitFor(() => {
      expect(screen.getByText('Error al cargar doctores')).toBeInTheDocument();
    });
  });

  test('handles doctor removal successfully', async () => {
    authFetch.mockResolvedValueOnce({ ok: true, json: async () => [...mockDoctors] }); // Initial fetch
    const onUpdateMock = vi.fn();
    render(<PatientDoctorsList patientId={1} onUpdate={onUpdateMock} />);

    await waitFor(() => {
      expect(screen.getByText('Juan Perez')).toBeInTheDocument();
    });

    // Mock para la llamada DELETE
    authFetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });

    const removeButtons = screen.getAllByRole('button', { name: 'Eliminar' });
    fireEvent.click(removeButtons[0]); // Click en el botón de eliminar del primer doctor

    expect(global.confirm).toHaveBeenCalledTimes(1);

    // Check for loading state on the button
    // The button will be disabled and have aria-busy=true
    // The text "Eliminando..." is passed as a child but the Button component
    // does not render children when loading=true.
    await waitFor(() => {
      expect(removeButtons[0]).toBeDisabled();
      expect(removeButtons[0]).toHaveAttribute('aria-busy', 'true');
    });

    await waitFor(() => {
      // El doctor Juan Perez ya no debería estar en la lista
      expect(screen.queryByText('Juan Perez')).not.toBeInTheDocument();
      // El otro doctor debería seguir
      expect(screen.getByText('Ana Gomez')).toBeInTheDocument();
      // El contador de doctores debería actualizarse
      expect(screen.getByText('1 doctor')).toBeInTheDocument();
      // onUpdate debería haber sido llamado
      expect(onUpdateMock).toHaveBeenCalledTimes(1);
    });
  });

  test('handles doctor removal failure', async () => {
    authFetch.mockResolvedValueOnce({ ok: true, json: async () => [...mockDoctors] });
    render(<PatientDoctorsList patientId={1} />);

    await waitFor(() => {
      expect(screen.getByText('Juan Perez')).toBeInTheDocument();
    });

    // Mock para la llamada DELETE que falla
    authFetch.mockResolvedValueOnce({ ok: false, status: 500, json: async () => ({ message: 'Error del servidor al eliminar' }) });

    const removeButtons = screen.getAllByRole('button', { name: 'Eliminar' });
    fireEvent.click(removeButtons[0]);

    expect(global.confirm).toHaveBeenCalledTimes(1);

    // Check for loading state on the button
    await waitFor(() => {
      expect(removeButtons[0]).toBeDisabled();
      expect(removeButtons[0]).toHaveAttribute('aria-busy', 'true');
    });

    await waitFor(() => {
      // Debería mostrar un mensaje de error
      expect(screen.getByText('Error al eliminar doctor')).toBeInTheDocument();
      // El doctor Juan Perez debería seguir en la lista porque la eliminación falló
      expect(screen.getByText('Juan Perez')).toBeInTheDocument();
       // El botón debería volver a ser "Eliminar" y estar habilitado
       const buttonAfterFailure = screen.getAllByRole('button', { name: 'Eliminar' })[0];
       expect(buttonAfterFailure).toBeInTheDocument();
       expect(buttonAfterFailure).not.toBeDisabled();
       expect(buttonAfterFailure).toHaveAttribute('aria-busy', 'false');
    });
  });

   test('does not remove doctor if user cancels confirmation', async () => {
    authFetch.mockResolvedValueOnce({ ok: true, json: async () => mockDoctors });
    global.confirm.mockReturnValueOnce(false); // Usuario cancela
    const onUpdateMock = vi.fn();

    render(<PatientDoctorsList patientId={1} onUpdate={onUpdateMock} />);

    await waitFor(() => {
      expect(screen.getByText('Juan Perez')).toBeInTheDocument();
    });

    const removeButtons = screen.getAllByRole('button', { name: 'Eliminar' });
    fireEvent.click(removeButtons[0]);

    expect(global.confirm).toHaveBeenCalledTimes(1);
    // authFetch para DELETE no debería ser llamado
    expect(authFetch).toHaveBeenCalledTimes(1); // Solo el fetch inicial
    // El doctor debería seguir en la lista
    expect(screen.getByText('Juan Perez')).toBeInTheDocument();
    // onUpdate no debería ser llamado
    expect(onUpdateMock).not.toHaveBeenCalled();
  });
});
