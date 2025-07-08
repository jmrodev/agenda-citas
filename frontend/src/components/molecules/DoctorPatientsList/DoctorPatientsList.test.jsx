import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import DoctorPatientsList from './DoctorPatientsList';
import { authFetch } from '../../../auth/authFetch';

vi.mock('../../../auth/authFetch');
global.confirm = vi.fn(() => true); // Simula que el usuario siempre confirma

describe('DoctorPatientsList', () => {
  const mockDoctorId = 1;
  const mockOnUpdate = vi.fn();
  const mockPatientsData = [
    { patient_id: 10, first_name: 'Carlos', last_name: 'Ruiz', dni: '11223344A', email: 'carlos.ruiz@example.com', phone: '600111222', date_of_birth: '1980-05-15' },
    { patient_id: 11, first_name: 'Elena', last_name: 'Vega', dni: '55667788B', email: 'elena.vega@example.com', phone: '600333444', date_of_birth: '1992-11-20' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    global.confirm.mockClear().mockReturnValue(true);
  });

  test('renders loading state initially and then title', async () => {
    authFetch.mockResolvedValueOnce({ ok: true, json: async () => [] });
    render(<DoctorPatientsList doctorId={mockDoctorId} onUpdate={mockOnUpdate} />);

    expect(screen.getByText('Cargando pacientes...')).toBeInTheDocument();
    // The title "Pacientes Asignados" is also visible during loading state
    expect(screen.getByRole('heading', { name: 'Pacientes Asignados' })).toBeInTheDocument();

    await waitFor(() => {
      // After loading, the specific empty message or list should appear
      expect(screen.getByText('No hay pacientes asignados a este doctor')).toBeInTheDocument();
    });
  });

  test('displays no patients message if API returns empty array', async () => {
    authFetch.mockResolvedValueOnce({ ok: true, json: async () => [] });
    render(<DoctorPatientsList doctorId={mockDoctorId} onUpdate={mockOnUpdate} />);

    await waitFor(() => {
      expect(screen.getByText('No hay pacientes asignados a este doctor')).toBeInTheDocument();
      expect(screen.getByText('0 pacientes')).toBeInTheDocument(); // Badge
    });
  });

  test('fetches and displays patients correctly', async () => {
    authFetch.mockResolvedValueOnce({ ok: true, json: async () => mockPatientsData });
    render(<DoctorPatientsList doctorId={mockDoctorId} onUpdate={mockOnUpdate} />);

    await waitFor(() => {
      expect(screen.getByText('Carlos Ruiz')).toBeInTheDocument();
      expect(screen.getByText('DNI: 11223344A')).toBeInTheDocument();
      expect(screen.getByText('Elena Vega')).toBeInTheDocument();
      expect(screen.getByText('DNI: 55667788B')).toBeInTheDocument();
      expect(screen.getByText(`${mockPatientsData.length} pacientes`)).toBeInTheDocument();
    });
  });

  test('handles patient removal successfully', async () => {
    authFetch.mockResolvedValueOnce({ ok: true, json: async () => [...mockPatientsData] }); // Initial fetch
    render(<DoctorPatientsList doctorId={mockDoctorId} onUpdate={mockOnUpdate} />);

    await waitFor(() => expect(screen.getByText('Carlos Ruiz')).toBeInTheDocument());

    authFetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) }); // Mock for DELETE call

    const removeButtons = screen.getAllByRole('button', { name: 'Eliminar' });
    fireEvent.click(removeButtons[0]); // Click remove for "Carlos Ruiz"

    expect(global.confirm).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      // Check for loading state on the button
      expect(removeButtons[0]).toBeDisabled();
      expect(removeButtons[0]).toHaveAttribute('aria-busy', 'true');
    });

    await waitFor(() => {
      expect(screen.queryByText('Carlos Ruiz')).not.toBeInTheDocument();
      expect(screen.getByText('Elena Vega')).toBeInTheDocument(); // Other patient remains
      expect(screen.getByText('1 paciente')).toBeInTheDocument(); // Badge updated
      expect(mockOnUpdate).toHaveBeenCalledTimes(1);
    });
  });

  test('displays error message on fetch failure', async () => {
    authFetch.mockResolvedValueOnce({ ok: false, status: 500, json: async () => ({ message: 'Error del servidor' }) });
    render(<DoctorPatientsList doctorId={mockDoctorId} onUpdate={mockOnUpdate} />);

    await waitFor(() => {
      expect(screen.getByText('Error al cargar pacientes')).toBeInTheDocument();
    });
  });

  test('handles patient removal failure from API', async () => {
    authFetch.mockResolvedValueOnce({ ok: true, json: async () => [...mockPatientsData] }); // Initial fetch
    render(<DoctorPatientsList doctorId={mockDoctorId} onUpdate={mockOnUpdate} />);

    await waitFor(() => expect(screen.getByText('Carlos Ruiz')).toBeInTheDocument());

    authFetch.mockResolvedValueOnce({ ok: false, json: async () => ({ message: 'No se pudo eliminar' }) }); // Mock for DELETE call - failure

    const removeButtons = screen.getAllByRole('button', { name: 'Eliminar' });
    fireEvent.click(removeButtons[0]);

    expect(global.confirm).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      // Button should show loading, then revert
      expect(removeButtons[0]).toBeDisabled(); // briefly disabled
    });

    await waitFor(() => {
      // Error message should be displayed
      expect(screen.getByText('Error al eliminar paciente')).toBeInTheDocument();
      // Patient list should not have changed
      expect(screen.getByText('Carlos Ruiz')).toBeInTheDocument();
      expect(screen.getByText(`${mockPatientsData.length} pacientes`)).toBeInTheDocument(); // Badge unchanged
      expect(mockOnUpdate).not.toHaveBeenCalled(); // onUpdate should not be called on failure
    });
  });

  test('does not remove patient if user cancels confirmation', async () => {
    authFetch.mockResolvedValueOnce({ ok: true, json: async () => [...mockPatientsData] });
    global.confirm.mockReturnValueOnce(false); // User clicks "Cancel"

    render(<DoctorPatientsList doctorId={mockDoctorId} onUpdate={mockOnUpdate} />);
    await waitFor(() => expect(screen.getByText('Carlos Ruiz')).toBeInTheDocument());

    const removeButtons = screen.getAllByRole('button', { name: 'Eliminar' });
    fireEvent.click(removeButtons[0]);

    expect(global.confirm).toHaveBeenCalledTimes(1);
    // authFetch for DELETE should not have been called
    expect(authFetch.mock.calls.filter(call => call[0].includes('/api/patient-doctors') && call[1]?.method === 'DELETE').length).toBe(0);

    // List and badge remain unchanged, onUpdate not called
    expect(screen.getByText('Carlos Ruiz')).toBeInTheDocument();
    expect(screen.getByText(`${mockPatientsData.length} pacientes`)).toBeInTheDocument();
    expect(mockOnUpdate).not.toHaveBeenCalled();
  });

  test('does not fetch patients if doctorId is not provided', () => {
    render(<DoctorPatientsList doctorId={null} onUpdate={mockOnUpdate} />);
    // The component shows "Cargando pacientes..." initially due to loading=true default state,
    // but authFetch should not be called.
    // We expect it to quickly render the "No hay pacientes" or an error if doctorId is essential for the title.
    // Given the current implementation, it will show the loading state and then nothing further happens if fetchPatients is not called.
    // Let's verify authFetch is not called for fetching patients.
    expect(authFetch.mock.calls.filter(call => call[0].includes('/api/patient-doctors/doctor/')).length).toBe(0);

    // It will remain in a loading-like state or show no patients, depending on how an empty doctorId is handled post-initial render.
    // The component's useEffect for fetching depends on doctorId.
    // If loading finishes without data, it shows "No hay pacientes".
    // The initial loading state might resolve if fetchPatients is never called and setLoading(false) is not reached.
    // To be more precise, we'd need to see how `loading` state changes if `doctorId` is null.
    // Current component: loading is true, fetchPatients is not called if no doctorId, so it stays loading.
    expect(screen.getByText('Cargando pacientes...')).toBeInTheDocument();
  });

  test('displays all patient details correctly', async () => {
    authFetch.mockResolvedValueOnce({ ok: true, json: async () => [mockPatientsData[0]] }); // Only one patient for simplicity
    const patient = mockPatientsData[0];
    render(<DoctorPatientsList doctorId={mockDoctorId} onUpdate={mockOnUpdate} />);

    await waitFor(() => {
      expect(screen.getByText(`${patient.first_name} ${patient.last_name}`)).toBeInTheDocument();
      expect(screen.getByText(`DNI: ${patient.dni}`)).toBeInTheDocument();
      expect(screen.getByText(patient.email)).toBeInTheDocument();
      expect(screen.getByText(patient.phone)).toBeInTheDocument();
      const expectedDate = new Date(patient.date_of_birth).toLocaleDateString('es-ES');
      expect(screen.getByText(`Nac: ${expectedDate}`)).toBeInTheDocument();
    });
  });

}); 