import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import PatientReferencesList from './PatientReferencesList';
import { getRole } from '../../../auth'; // Necesario para mockear getRole
import { patientReferenceService } from '../../../services/patientReferenceService'; // Necesario para mockear el servicio

// Mockear getRole
vi.mock('../../../auth', async () => {
  const actual = await vi.importActual('../../../auth');
  return {
    ...actual,
    getRole: vi.fn(),
  };
});

// Mockear patientReferenceService
vi.mock('../../../services/patientReferenceService', () => ({
  patientReferenceService: {
    deleteReference: vi.fn(),
  },
}));

// Mock de window.confirm
global.confirm = vi.fn(() => true);

describe('PatientReferencesList', () => {
  const mockOnUpdate = vi.fn();
  const mockOnEditRequest = vi.fn();
  const patientId = 1;

  beforeEach(() => {
    vi.clearAllMocks();
    getRole.mockReturnValue('secretary'); // Por defecto, rol que puede gestionar
    patientReferenceService.deleteReference.mockResolvedValue({ success: true }); // Por defecto, eliminación exitosa
    global.confirm.mockClear().mockReturnValue(true); // Resetear y simular confirmación
  });

  test('muestra mensaje cuando no hay referencias', () => {
    render(
      <PatientReferencesList
        references={[]}
        patientId={patientId}
        onUpdate={mockOnUpdate}
        onEditRequest={mockOnEditRequest}
      />
    );
    expect(screen.getByText('No hay personas de referencia asignadas.')).toBeInTheDocument();
  });

  test('renderiza la lista de referencias del paciente con datos', () => {
    const mockReferences = [
      { reference_id: '1', name: 'Ana', last_name: 'García', relationship: 'Madre', phone: '123456789' },
      { reference_id: '2', name: 'Luis', last_name: 'Martínez', relationship: 'Padre', phone: '987654321' },
    ];
    render(
      <PatientReferencesList
        references={mockReferences}
        patientId={patientId}
        onUpdate={mockOnUpdate}
        onEditRequest={mockOnEditRequest}
      />
    );

    expect(screen.getByText('Ana García')).toBeInTheDocument();
    expect(screen.getByText('Relación:')).toBeInTheDocument(); // Parte de "Relación: Madre"
    expect(screen.getByText('Madre')).toBeInTheDocument();
    expect(screen.getByText('Luis Martínez')).toBeInTheDocument();
    expect(screen.getByText('Padre')).toBeInTheDocument();

    // Verificar botones de acción (asumiendo rol con permisos)
    const editButtons = screen.getAllByRole('button', { name: 'Editar' });
    expect(editButtons.length).toBe(mockReferences.length);
    const deleteButtons = screen.getAllByRole('button', { name: 'Eliminar' });
    expect(deleteButtons.length).toBe(mockReferences.length);
  });

  test('llama a onEditRequest cuando se hace click en Editar', () => {
    const mockReferences = [{ reference_id: '1', name: 'Ana', last_name: 'García' }];
    render(
      <PatientReferencesList
        references={mockReferences}
        patientId={patientId}
        onUpdate={mockOnUpdate}
        onEditRequest={mockOnEditRequest}
      />
    );
    const editButton = screen.getByRole('button', { name: 'Editar' });
    fireEvent.click(editButton);
    expect(mockOnEditRequest).toHaveBeenCalledWith(mockReferences[0]);
  });

  test('llama a patientReferenceService.deleteReference y onUpdate cuando se confirma la eliminación', async () => {
    const mockReferences = [{ reference_id: '1', name: 'Ana', last_name: 'García' }];
    render(
      <PatientReferencesList
        references={mockReferences}
        patientId={patientId}
        onUpdate={mockOnUpdate}
        onEditRequest={mockOnEditRequest}
      />
    );
    const deleteButton = screen.getByRole('button', { name: 'Eliminar' });
    fireEvent.click(deleteButton);

    expect(global.confirm).toHaveBeenCalledTimes(1);
    // Esperar a que se resuelva la promesa de eliminación y las actualizaciones de estado
    await screen.findByRole('button', { name: 'Eliminar' }); // Esperar a que el botón vuelva a estar normal

    expect(patientReferenceService.deleteReference).toHaveBeenCalledWith('1');
    expect(mockOnUpdate).toHaveBeenCalledTimes(1);
  });

  test('no muestra botones de acción si el rol no tiene permisos', () => {
    getRole.mockReturnValue('doctor'); // Rol sin permisos de gestión de referencias
    const mockReferences = [{ reference_id: '1', name: 'Ana', last_name: 'García' }];
    render(
      <PatientReferencesList
        references={mockReferences}
        patientId={patientId}
        onUpdate={mockOnUpdate}
        onEditRequest={mockOnEditRequest}
      />
    );
    expect(screen.queryByRole('button', { name: 'Editar' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Eliminar' })).not.toBeInTheDocument();
  });

  test('muestra error si la eliminación falla', async () => {
    const errorMessage = "Error al eliminar";
    patientReferenceService.deleteReference.mockRejectedValueOnce(new Error(errorMessage));
    const mockReferences = [{ reference_id: '1', name: 'Ana', last_name: 'García' }];
    render(
      <PatientReferencesList
        references={mockReferences}
        patientId={patientId}
        onUpdate={mockOnUpdate}
        onEditRequest={mockOnEditRequest}
      />
    );
    const deleteButton = screen.getByRole('button', { name: 'Eliminar' });
    fireEvent.click(deleteButton);

    expect(global.confirm).toHaveBeenCalledTimes(1);

    // Esperar a que aparezca el mensaje de error
    const errorAlert = await screen.findByRole('alert');
    expect(errorAlert).toHaveTextContent(errorMessage);
    expect(mockOnUpdate).not.toHaveBeenCalled(); // No se debería llamar onUpdate si falla
  });

}); 