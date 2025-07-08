import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PatientHealthInsurancesList from './PatientHealthInsurancesList';
import { vi } from 'vitest';
import { authFetch } from '../../../auth/authFetch';

// Mockear dependencias
vi.mock('../../../auth/authFetch');
global.confirm = vi.fn();

// Mockear átomos para simplificar y enfocarse en la lógica de PatientHealthInsurancesList
vi.mock('../../atoms/Button/Button', () => ({
  default: vi.fn(({ children, onClick, variant, size, disabled, loading }) => (
    <button
      onClick={onClick}
      data-variant={variant}
      data-size={size}
      disabled={disabled || loading}
      aria-busy={loading}
      data-testid={`mock-button-${typeof children === 'string' ? children.toLowerCase().replace(/\s+/g, '-') : 'icon-button'}`}
    >
      {children}
    </button>
  )),
}));
vi.mock('../../atoms/Alert/Alert', () => ({
  default: vi.fn(({ children, type }) => <div role="alert" data-type={type}>{children}</div>),
}));
vi.mock('../../atoms/Chip/Chip', () => ({
  // eslint-disable-next-line no-unused-vars
  default: vi.fn(({ children, variant, size }) => <span data-testid={`mock-chip-${children.toLowerCase()}`}>{children}</span>),
}));
vi.mock('../../atoms/Icon/Icon', () => ({
  default: vi.fn(({ name }) => <span data-testid={`mock-icon-${name}`} />),
}));


describe('PatientHealthInsurancesList Component', () => {
  const mockPatientId = 1;
  const mockOnUpdate = vi.fn();
  const mockHealthInsurancesData = [
    {
      patient_insurance_id: 101,
      insurance_id: 1,
      insurance_name: 'OSDE',
      member_number: '12345',
      is_primary: true,
      is_active: true,
      insurance_address: 'Av. Corrientes 1000',
      insurance_phone: '011-4000-5000',
      insurance_email: 'contacto@osde.com.ar',
    },
    {
      patient_insurance_id: 102,
      insurance_id: 2,
      insurance_name: 'Swiss Medical',
      member_number: '67890',
      is_primary: false,
      is_active: true,
      insurance_address: 'Av. Santa Fe 2000',
      insurance_phone: '011-5000-6000',
      insurance_email: 'info@swissmedical.com.ar',
    },
    {
      patient_insurance_id: 103,
      insurance_id: 3,
      insurance_name: 'Galeno',
      member_number: 'ABC001',
      is_primary: false,
      is_active: false, // Inactiva
      insurance_address: null, // Sin dirección
      insurance_phone: null,
      insurance_email: null,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    authFetch.mockReset();
    global.confirm.mockReturnValue(true); // Por defecto, el usuario confirma
  });

  test('muestra mensaje cuando no hay obras sociales', () => {
    render(<PatientHealthInsurancesList patientId={mockPatientId} healthInsurances={[]} onUpdate={mockOnUpdate} />);
    expect(screen.getByText('Este paciente no tiene obras sociales asociadas.')).toBeInTheDocument();
  });

  test('renderiza la lista de obras sociales con todos sus detalles y acciones', () => {
    render(
      <PatientHealthInsurancesList
        patientId={mockPatientId}
        healthInsurances={mockHealthInsurancesData}
        onUpdate={mockOnUpdate}
      />
    );

    mockHealthInsurancesData.forEach(insurance => {
      // Nombre y badges
      expect(screen.getByText(insurance.insurance_name)).toBeInTheDocument();
      if (insurance.is_primary) {
        expect(screen.getByTestId('mock-chip-principal')).toBeInTheDocument();
      }
      expect(screen.getByTestId(`mock-chip-${insurance.is_active ? 'activa' : 'inactiva'}`)).toBeInTheDocument();

      // Número de socio
      if (insurance.member_number) {
        expect(screen.getByText(new RegExp(`Número de Socio: ${insurance.member_number}`))).toBeInTheDocument();
      }
      // Detalles de la OS
      if (insurance.insurance_address) expect(screen.getByText(new RegExp(`Dirección: ${insurance.insurance_address}`))).toBeInTheDocument();
      if (insurance.insurance_phone) expect(screen.getByText(new RegExp(`Teléfono: ${insurance.insurance_phone}`))).toBeInTheDocument();
      if (insurance.insurance_email) expect(screen.getByText(new RegExp(`Email: ${insurance.insurance_email}`))).toBeInTheDocument();

      // Botones de acción
      const removeButton = screen.getByTestId(`mock-button-remover`); // Asumiendo que el mock de Button usa el children
      // El botón "Remover" siempre está. Para encontrar el específico, necesitaríamos una forma de identificarlo por OS.
      // Vamos a asumir que hay un botón "Remover" visible para cada item.
      // Para "Establecer como Principal", solo si no es primaria
      if (!insurance.is_primary) {
        expect(screen.getByTestId('mock-button-establecer-como-principal')).toBeInTheDocument();
      }
    });
     // Debería haber 3 botones de remover (uno por cada OS)
     expect(screen.getAllByTestId('mock-button-remover').length).toBe(mockHealthInsurancesData.length);
     // Debería haber 2 botones de "Establecer como Principal" (para las no primarias)
     expect(screen.getAllByTestId('mock-button-establecer-como-principal').length).toBe(
       mockHealthInsurancesData.filter(ins => !ins.is_primary).length
     );
  });

  test('acción "Establecer como Principal" llama a API y onUpdate', async () => {
    authFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ message: 'Actualizado' }) });
    render(
      <PatientHealthInsurancesList
        patientId={mockPatientId}
        healthInsurances={mockHealthInsurancesData}
        onUpdate={mockOnUpdate}
      />
    );

    // Click en "Establecer como Principal" para la segunda OS (Swiss Medical)
    const setPrimaryButtons = screen.getAllByTestId('mock-button-establecer-como-principal');
    // El primer botón "Establecer como Principal" corresponde a la segunda OS en la lista mock (Swiss Medical)
    fireEvent.click(setPrimaryButtons[0]);

    await waitFor(() => {
      expect(authFetch).toHaveBeenCalledWith(
        `/api/patients/${mockPatientId}/health-insurances/primary`,
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ insurance_id: mockHealthInsurancesData[1].insurance_id }),
        })
      );
      expect(mockOnUpdate).toHaveBeenCalledTimes(1);
    });
  });

  test('acción "Remover Obra Social" llama a API y onUpdate tras confirmación', async () => {
    authFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ message: 'Eliminado' }) });
    render(
      <PatientHealthInsurancesList
        patientId={mockPatientId}
        healthInsurances={mockHealthInsurancesData}
        onUpdate={mockOnUpdate}
      />
    );

    // Click en "Remover" para la primera OS (OSDE)
    // Necesitamos una forma más específica de seleccionar el botón correcto si el texto es el mismo.
    // Por ahora, asumimos que el orden de renderizado corresponde al array y usamos el primer botón "Remover".
    const removeButtons = screen.getAllByTestId('mock-button-remover');
    fireEvent.click(removeButtons[0]);

    expect(global.confirm).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(authFetch).toHaveBeenCalledWith(
        `/api/patients/${mockPatientId}/health-insurances/${mockHealthInsurancesData[0].patient_insurance_id}`,
        expect.objectContaining({ method: 'DELETE' })
      );
      expect(mockOnUpdate).toHaveBeenCalledTimes(1);
    });
  });

  test('no llama a remover si el usuario cancela la confirmación', () => {
    global.confirm.mockReturnValueOnce(false);
     render(
      <PatientHealthInsurancesList
        patientId={mockPatientId}
        healthInsurances={mockHealthInsurancesData}
        onUpdate={mockOnUpdate}
      />
    );
    const removeButtons = screen.getAllByTestId('mock-button-remover');
    fireEvent.click(removeButtons[0]);

    expect(global.confirm).toHaveBeenCalledTimes(1);
    expect(authFetch).not.toHaveBeenCalled(); // No se llama a la API
    expect(mockOnUpdate).not.toHaveBeenCalled();
  });

  test('muestra error y no llama onUpdate si falla "Establecer como Principal"', async () => {
    authFetch.mockResolvedValueOnce({ ok: false, json: async () => ({ error: 'Fallo API' }) });
    render(
      <PatientHealthInsurancesList
        patientId={mockPatientId}
        healthInsurances={mockHealthInsurancesData}
        onUpdate={mockOnUpdate}
      />
    );
    const setPrimaryButtons = screen.getAllByTestId('mock-button-establecer-como-principal');
    fireEvent.click(setPrimaryButtons[0]);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Error al establecer obra social principal');
    });
    expect(mockOnUpdate).not.toHaveBeenCalled();
  });

  test('muestra error y no llama onUpdate si falla "Remover Obra Social"', async () => {
    authFetch.mockResolvedValueOnce({ ok: false, json: async () => ({ error: 'Fallo API' }) });
     render(
      <PatientHealthInsurancesList
        patientId={mockPatientId}
        healthInsurances={mockHealthInsurancesData}
        onUpdate={mockOnUpdate}
      />
    );
    const removeButtons = screen.getAllByTestId('mock-button-remover');
    fireEvent.click(removeButtons[0]);

    expect(global.confirm).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Error al remover obra social');
    });
    expect(mockOnUpdate).not.toHaveBeenCalled();
  });
}); 