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

}); 