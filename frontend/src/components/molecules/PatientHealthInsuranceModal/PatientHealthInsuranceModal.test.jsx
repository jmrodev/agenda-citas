import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import PatientHealthInsuranceModal from './PatientHealthInsuranceModal';
import { authFetch } from '../../../auth/authFetch';

vi.mock('../../../auth/authFetch');

describe('PatientHealthInsuranceModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSuccess = vi.fn();
  const mockPatient = { patient_id: 1, name: 'Test Patient' }; // Basic patient prop

  beforeEach(() => {
    vi.clearAllMocks();
    authFetch.mockReset();
    // Default mock for loading health insurances (empty list)
    authFetch.mockResolvedValue({
      ok: true,
      json: async () => []
    });
  });

  test('renderiza el modal en modo selección inicial', async () => {
    render(
      <PatientHealthInsuranceModal
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
        patient={mockPatient}
      />
    );

    // Esperar a que se carguen las obras sociales (aunque esté mockeado)
    await waitFor(() => {
      expect(screen.getByText('Gestionar Obra Social')).toBeInTheDocument();
    });

    expect(screen.getByText('¿Qué deseas hacer?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Asociar Obra Social Existente' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Crear Nueva Obra Social' })).toBeInTheDocument();
    // "Remover Obra Social Actual" button only appears if patient has health_insurance_id
    expect(screen.queryByRole('button', { name: 'Remover Obra Social Actual' })).not.toBeInTheDocument();
  });

  test('muestra botón "Remover Obra Social Actual" si el paciente tiene una', async () => {
    const patientWithInsurance = { ...mockPatient, health_insurance_id: 123 };
    render(
      <PatientHealthInsuranceModal
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
        patient={patientWithInsurance}
      />
    );
    await waitFor(() => {
      expect(screen.getByText('Gestionar Obra Social')).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: 'Remover Obra Social Actual' })).toBeInTheDocument();
  });

  // Further tests would cover:
  // - Switching to 'existing' mode and selecting/submitting
  // - Switching to 'create' mode and creating/submitting
  // - Handling API errors during load or submit
  // - Removing an existing insurance
}); 