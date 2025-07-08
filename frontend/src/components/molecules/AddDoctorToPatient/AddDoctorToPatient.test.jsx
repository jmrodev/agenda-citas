import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import AddDoctorToPatient from './AddDoctorToPatient';
import { vi } from 'vitest';
import { authFetch } from '../../../auth/authFetch';

// Mockear authFetch globalmente para este archivo de test
vi.mock('../../../auth/authFetch');

describe('AddDoctorToPatient Component', () => {
  const mockPatientId = '123';
  const mockCurrentDoctors = [{ doctor_id: 1, first_name: 'Juan', last_name: 'Perez', specialty: 'Cardiología' }];
  const mockAllDoctors = [
    { doctor_id: 1, first_name: 'Juan', last_name: 'Perez', specialty: 'Cardiología' },
    { doctor_id: 2, first_name: 'Ana', last_name: 'Gomez', specialty: 'Pediatría' },
    { doctor_id: 3, first_name: 'Luis', last_name: 'Martínez', specialty: 'General' },
  ];
  const mockAvailableDoctors = [ // Doctores que no están en mockCurrentDoctors
    { doctor_id: 2, first_name: 'Ana', last_name: 'Gomez', specialty: 'Pediatría' },
    { doctor_id: 3, first_name: 'Luis', last_name: 'Martínez', specialty: 'General' },
  ];

  beforeEach(() => {
    // Limpiar mocks antes de cada test
    authFetch.mockReset();
    vi.useFakeTimers(); // Para controlar setTimeout
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers(); // Restaurar timers reales
  });

  test('muestra spinner de carga de doctores inicialmente y luego el select con doctores disponibles', async () => {
    authFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockAllDoctors,
    });

    render(
      <AddDoctorToPatient
        patientId={mockPatientId}
        currentDoctors={mockCurrentDoctors}
        onDoctorAdded={vi.fn()}
      />
    );

    expect(screen.getByText('Cargando doctores disponibles...')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument(); // Spinner

    await waitFor(() => {
      expect(screen.getByLabelText('Seleccionar Doctor:')).toBeInTheDocument();
    });

    // Verificar que las opciones disponibles (excluyendo currentDoctors) están en el select
    // mockAvailableDoctors tiene 2 doctores
    mockAvailableDoctors.forEach(doc => {
      expect(screen.getByRole('option', { name: `Dr. ${doc.first_name} ${doc.last_name} - ${doc.specialty}` })).toBeInTheDocument();
    });
    // Verificar que el doctor actual no está en las opciones
    const currentDoctorOption = screen.queryByRole('option', { name: `Dr. ${mockCurrentDoctors[0].first_name} ${mockCurrentDoctors[0].last_name} - ${mockCurrentDoctors[0].specialty}` });
    expect(currentDoctorOption).not.toBeInTheDocument();
  });

  test('muestra mensaje de error si falla la carga de doctores', async () => {
    authFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Error de red al cargar doctores' }),
    });

    render(
      <AddDoctorToPatient
        patientId={mockPatientId}
        currentDoctors={[]}
        onDoctorAdded={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Error al cargar doctores')).toBeInTheDocument(); // Error de throw new Error
    });
  });

  test('muestra mensaje si no hay doctores disponibles para agregar', async () => {
    authFetch.mockResolvedValueOnce({
      ok: true,
      // Simula que todos los doctores ya están asignados
      json: async () => mockCurrentDoctors,
    });

    render(
      <AddDoctorToPatient
        patientId={mockPatientId}
        currentDoctors={mockCurrentDoctors} // Todos los doctores de la "API" ya están en currentDoctors
        onDoctorAdded={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('No hay doctores disponibles para agregar')).toBeInTheDocument();
    });
  });

  test('selecciona un doctor, lo agrega exitosamente y muestra mensaje de éxito', async () => {
    const mockOnDoctorAdded = vi.fn();
    // Mock para fetchAvailableDoctors
    authFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockAllDoctors,
    });
    // Mock para handleAddDoctor (POST)
    authFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Doctor agregado' }),
    });

    render(
      <AddDoctorToPatient
        patientId={mockPatientId}
        currentDoctors={mockCurrentDoctors}
        onDoctorAdded={mockOnDoctorAdded}
      />
    );

    // Esperar a que carguen los doctores
    await waitFor(() => {
      expect(screen.getByLabelText('Seleccionar Doctor:')).toBeInTheDocument();
    });

    // Seleccionar un doctor disponible (el segundo de mockAllDoctors, que es el primero de mockAvailableDoctors)
    const doctorToSelect = mockAvailableDoctors[0];
    const selectElement = screen.getByLabelText('Seleccionar Doctor:');
    fireEvent.change(selectElement, { target: { value: doctorToSelect.doctor_id.toString() } });

    expect(selectElement.value).toBe(doctorToSelect.doctor_id.toString());

    // Hacer clic en agregar
    const addButton = screen.getByRole('button', { name: 'Agregar Doctor' });
    fireEvent.click(addButton);

    // Esperar spinner en el botón y luego mensaje de éxito
    expect(await screen.findByRole('button', { name: 'Agregando...' })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Doctor agregado correctamente')).toBeInTheDocument();
    });

    // Verificar que onDoctorAdded fue llamado
    expect(mockOnDoctorAdded).toHaveBeenCalledTimes(1);
    // Verificar que el select se resetea
    expect(selectElement.value).toBe('');

    // Avanzar timers para que el mensaje de éxito desaparezca
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(screen.queryByText('Doctor agregado correctamente')).not.toBeInTheDocument();
    });
  });

  test('muestra error si no se selecciona un doctor antes de agregar', async () => {
     authFetch.mockResolvedValueOnce({ // Para la carga inicial de doctores
      ok: true,
      json: async () => mockAllDoctors,
    });
    render(
      <AddDoctorToPatient
        patientId={mockPatientId}
        currentDoctors={mockCurrentDoctors}
        onDoctorAdded={vi.fn()}
      />
    );
    await waitFor(() => screen.getByLabelText('Seleccionar Doctor:'));

    const addButton = screen.getByRole('button', { name: 'Agregar Doctor' });
    fireEvent.click(addButton);

    expect(await screen.findByText('Por favor selecciona un doctor')).toBeInTheDocument();
    expect(authFetch).toHaveBeenCalledTimes(1); // Solo la llamada para obtener doctores
  });

  test('muestra error si la API falla al agregar el doctor', async () => {
    // Mock para fetchAvailableDoctors
    authFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockAllDoctors,
    });
    // Mock para handleAddDoctor (POST) - falla
    authFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'El doctor ya está asignado a este paciente' }),
    });

    render(
      <AddDoctorToPatient
        patientId={mockPatientId}
        currentDoctors={mockCurrentDoctors}
        onDoctorAdded={vi.fn()}
      />
    );
    await waitFor(() => screen.getByLabelText('Seleccionar Doctor:'));

    const doctorToSelect = mockAvailableDoctors[0];
    fireEvent.change(screen.getByLabelText('Seleccionar Doctor:'), { target: { value: doctorToSelect.doctor_id.toString() } });

    fireEvent.click(screen.getByRole('button', { name: 'Agregar Doctor' }));

    expect(await screen.findByText('El doctor ya está asignado a este paciente')).toBeInTheDocument();
  });
}); 