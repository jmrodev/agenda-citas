import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import HealthInsuranceDeleteModal from './HealthInsuranceDeleteModal';
import { authFetch } from '../../../auth/authFetch';

vi.mock('../../../auth/authFetch');

describe('HealthInsuranceDeleteModal', () => {
  const mockOnClose = vi.fn();
  const mockOnConfirmDelete = vi.fn();
  const mockInsurance = { insurance_id: 1, name: 'OSDE' };

  beforeEach(() => {
    vi.clearAllMocks();
    authFetch.mockReset();
  });

  test('renderiza modal y permite eliminar cuando no hay referencias', async () => {
    authFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ patients: [], doctors: [] }),
    });

    render(
      <HealthInsuranceDeleteModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirmDelete={mockOnConfirmDelete}
        insurance={mockInsurance}
      />
    );

    await waitFor(() => {
      expect(screen.queryByText('Cargando referencias...')).not.toBeInTheDocument();
    });

    expect(screen.getByText(`Eliminar Obra Social: ${mockInsurance.name}`)).toBeInTheDocument();
    expect(screen.getByText('Esta obra social no tiene referencias activas y puede ser eliminada sin problemas.')).toBeInTheDocument();

    const deleteButton = screen.getByRole('button', { name: 'Eliminar' });
    expect(deleteButton).toBeInTheDocument();
    const cancelButton = screen.getByRole('button', { name: 'Cancelar' });
    expect(cancelButton).toBeInTheDocument();

    fireEvent.click(deleteButton);
    expect(mockOnConfirmDelete).toHaveBeenCalledWith(mockInsurance.insurance_id, 'delete');
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('muestra opciones y botón "Confirmar Acción" cuando hay referencias', async () => {
    authFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        patients: [{ patient_id: 1, first_name: 'Juan', last_name: 'Perez' }],
        doctors: []
      }),
    });

    render(
      <HealthInsuranceDeleteModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirmDelete={mockOnConfirmDelete}
        insurance={mockInsurance}
      />
    );

    await waitFor(() => {
      expect(screen.queryByText('Cargando referencias...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('¡Atención!')).toBeInTheDocument(); // Parte de la alerta
    expect(screen.getByText('Juan Perez')).toBeInTheDocument(); // Nombre del paciente referenciado

    // Verificar radios de acción
    expect(screen.getByLabelText(/Eliminar y quitar referencias/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Marcar como "Sin Obra Social"/i)).toBeInTheDocument();

    const confirmButton = screen.getByRole('button', { name: 'Confirmar Acción' });
    expect(confirmButton).toBeInTheDocument();

    // Cambiar la acción seleccionada
    const orphanRadio = screen.getByLabelText(/Marcar como "Sin Obra Social"/i);
    fireEvent.click(orphanRadio);

    fireEvent.click(confirmButton);
    expect(mockOnConfirmDelete).toHaveBeenCalledWith(mockInsurance.insurance_id, 'orphan');
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('muestra mensaje de error si falla la carga de referencias', async () => {
    authFetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Server Error',
      json: async () => ({ message: 'Error del servidor' }),
    });

    render(
      <HealthInsuranceDeleteModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirmDelete={mockOnConfirmDelete}
        insurance={mockInsurance}
      />
    );

    await waitFor(() => {
      expect(screen.queryByText('Cargando referencias...')).not.toBeInTheDocument();
    });

    expect(screen.getByRole('alert')).toHaveTextContent(/Error 500: Server Error/i);
  });

}); 