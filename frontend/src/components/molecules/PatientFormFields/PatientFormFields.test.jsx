import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import PatientFormFields from './PatientFormFields';
import { vi } from 'vitest';
import { doctorService } from '../../../services/doctorService';
import { healthInsuranceService } from '../../../services/healthInsuranceService';

// Mockear servicios
vi.mock('../../../services/doctorService');
vi.mock('../../../services/healthInsuranceService');

// Mockear componentes hijos
vi.mock('../FormField/FormField', () => ({
  default: vi.fn((props) => (
    <div data-testid={`mock-formfield-${props.name}`}>
      <label htmlFor={props.name}>{props.label}</label>
      <input
        id={props.name}
        name={props.name}
        type={props.type}
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
        data-error={props.error}
        placeholder={props.placeholder}
        data-required={props.required}
      />
      {props.error && <span>{props.error}</span>}
    </div>
  )),
}));
vi.mock('../../atoms/Select/Select', () => ({
  default: vi.fn((props) => (
    <select
      name={props.name}
      value={props.value}
      onChange={props.onChange}
      data-testid={`mock-select-${props.name}`}
    >
      {props.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  )),
}));
vi.mock('../../atoms/Checkbox/Checkbox', () => ({
  default: vi.fn((props) => (
    <input
      type="checkbox"
      id={props.id}
      name={props.name}
      checked={props.checked}
      onChange={props.onChange}
      data-testid={`mock-checkbox-${props.name || props.id}`}
    />
  )),
}));

describe('PatientFormFields Component', () => {
  const mockOnChange = vi.fn();
  const mockOnBlur = vi.fn();
  const mockValues = {
    first_name: '', last_name: '', dni: '', date_of_birth: '', email: '', phone: '', address: '',
    health_insurance_id: '', health_insurance_member_number: '',
    preferred_payment_methods: '', doctor_ids: [],
    reference_person: { name: '', last_name: '', phone: '', relationship: '', address: '' },
  };
  const mockErrors = {};
  const mockTouched = {};

  const mockDoctorsData = [
    { doctor_id: 1, first_name: 'Juan', last_name: 'Perez', specialty: 'Cardiología' },
    { doctor_id: 2, first_name: 'Ana', last_name: 'Gomez', specialty: 'Pediatría' },
  ];
  const mockInsurancesData = [
    { insurance_id: 10, name: 'OSDE' }, { insurance_id: 11, name: 'Swiss Medical' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    doctorService.getAll.mockResolvedValue({ doctors: mockDoctorsData });
    healthInsuranceService.getAll.mockResolvedValue({ health_insurances: mockInsurancesData });
    // Mock window.location.reload
    const originalLocation = window.location;
    delete window.location;
    window.location = { ...originalLocation, reload: vi.fn() };
  });

  afterEach(() => {
    // Restaurar window.location si es necesario, o asegurar que los mocks se limpian
    vi.restoreAllMocks(); // Esto debería restaurar el mock de window.location.reload si spyOn fue usado.
                           // Si fue reasignado directamente, necesita restauración manual.
  });


  test('muestra estado de carga inicial y luego los campos del formulario', async () => {
    render(
      <PatientFormFields
        values={mockValues}
        errors={mockErrors}
        touched={mockTouched}
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />
    );
    expect(screen.getByText('Cargando formulario...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('mock-formfield-first_name')).toBeInTheDocument();
      expect(screen.getByTestId('mock-formfield-last_name')).toBeInTheDocument();
      // Verificar que los selects se poblaron
      expect(screen.getByTestId('mock-select-health_insurance_id').children.length).toBe(mockInsurancesData.length + 1); // +1 por "Seleccione"
      // Verificar que los checkboxes de doctores se poblaron
      expect(screen.getAllByTestId(/mock-checkbox-doctor_/).length).toBe(mockDoctorsData.length);
    });
  });

  test('muestra mensaje de error si falla la carga de datos iniciales y permite reintentar', async () => {
    doctorService.getAll.mockRejectedValueOnce(new Error('API Error Doctores'));
    // healthInsuranceService.getAll.mockResolvedValue({ health_insurances: mockInsurancesData }); // Para que Promise.all no falle completamente de inmediato

    render(
      <PatientFormFields
        values={mockValues} errors={mockErrors} touched={mockTouched}
        onChange={mockOnChange} onBlur={mockOnBlur}
      />
    );
    await waitFor(() => {
      expect(screen.getByText('Error al cargar datos. Por favor, recargue la página.')).toBeInTheDocument();
    });

    const retryButton = screen.getByRole('button', { name: 'Reintentar' });
    expect(retryButton).toBeInTheDocument();
    fireEvent.click(retryButton);
    expect(window.location.reload).toHaveBeenCalledTimes(1);
  });

  test('renderiza todos los FormFields con props correctas para información personal', async () => {
    const testValues = { ...mockValues, first_name: 'Carlos', email: 'c@e.com' };
    const testErrors = { first_name: 'Nombre corto', email: 'Email inválido' };
    const testTouched = { first_name: true, email: true };

    render(
      <PatientFormFields
        values={testValues} errors={testErrors} touched={testTouched}
        onChange={mockOnChange} onBlur={mockOnBlur}
      />
    );
    await waitFor(() => expect(screen.getByTestId('mock-formfield-first_name')).toBeInTheDocument()); // Esperar a que cargue

    const FormFieldMock = require('../FormField/FormField').default;

    // Nombre
    expect(FormFieldMock).toHaveBeenCalledWith(expect.objectContaining({
      label: "Nombre", name: "first_name", type: "text", value: "Carlos",
      error: "Nombre corto", placeholder: "Ingrese el nombre", required: true
    }), {});
    // Email
    expect(FormFieldMock).toHaveBeenCalledWith(expect.objectContaining({
      label: "Email", name: "email", type: "email", value: "c@e.com",
      error: "Email inválido", placeholder: "ejemplo@email.com"
    }), {});
    // DNI (solo algunas props para ejemplo)
    expect(FormFieldMock).toHaveBeenCalledWith(expect.objectContaining({ name: "dni", type: "text" }), {});
  });

  test('maneja cambios en inputs de FormField (ej. first_name)', async () => {
    render(<PatientFormFields values={mockValues} errors={mockErrors} touched={mockTouched} onChange={mockOnChange} onBlur={mockOnBlur} />);
    await waitFor(() => expect(screen.getByTestId('mock-formfield-first_name')).toBeInTheDocument());

    const FormFieldMock = require('../FormField/FormField').default;
    // Encontrar la instancia del mock para first_name
    const firstNameFieldProps = FormFieldMock.mock.calls.find(call => call[0].name === 'first_name')[0];

    // Simular el onChange que el FormField pasaría a su Input interno, y que luego FormField llamaría
    const mockEvent = { target: { name: 'first_name', value: 'Nuevo Nombre' } };
    act(() => {
        firstNameFieldProps.onChange(mockEvent);
    });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('first_name', 'Nuevo Nombre'); // PatientFormFields's handleFieldChange
  });

  test('maneja cambio en Select de Obra Social', async () => {
    render(<PatientFormFields values={mockValues} errors={mockErrors} touched={mockTouched} onChange={mockOnChange} onBlur={mockOnBlur} />);
    await waitFor(() => expect(screen.getByTestId('mock-select-health_insurance_id')).toBeInTheDocument());

    const selectInsurance = screen.getByTestId('mock-select-health_insurance_id');
    fireEvent.change(selectInsurance, { target: { value: mockInsurancesData[0].insurance_id.toString() } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('health_insurance_id', mockInsurancesData[0].insurance_id);
  });

  test('renderiza y maneja cambio en Número de Socio cuando hay obra social seleccionada', async () => {
    const valuesWithInsurance = { ...mockValues, health_insurance_id: mockInsurancesData[0].insurance_id };
    render(<PatientFormFields values={valuesWithInsurance} errors={mockErrors} touched={mockTouched} onChange={mockOnChange} onBlur={mockOnBlur} />);

    await waitFor(() => expect(screen.getByTestId('mock-formfield-health_insurance_member_number')).toBeInTheDocument());

    const FormFieldMock = require('../FormField/FormField').default;
    const memberNumberFieldProps = FormFieldMock.mock.calls.find(call => call[0].name === 'health_insurance_member_number')[0];

    const mockEvent = { target: { name: 'health_insurance_member_number', value: 'Socio123' } };
    act(() => {
        memberNumberFieldProps.onChange(mockEvent);
    });
    expect(mockOnChange).toHaveBeenCalledWith('health_insurance_member_number', 'Socio123');
  });

  test('renderiza información de la obra social seleccionada', async () => {
    const selectedInsuranceId = mockInsurancesData[0].insurance_id;
    const valuesWithInsurance = { ...mockValues, health_insurance_id: selectedInsuranceId };
    render(<PatientFormFields values={valuesWithInsurance} errors={mockErrors} touched={mockTouched} onChange={mockOnChange} onBlur={mockOnBlur} />);

    await waitFor(() => {
      expect(screen.getByText('Información de la Obra Social')).toBeInTheDocument();
      expect(screen.getByText(new RegExp(mockInsurancesData[0].name))).toBeInTheDocument();
      // Podríamos añadir más aserciones para dirección, teléfono, email de la OS si se proporcionan en mockInsurancesData
    });
  });

  test('maneja cambio en Checkbox de Métodos de Pago', async () => {
    render(<PatientFormFields values={mockValues} errors={mockErrors} touched={mockTouched} onChange={mockOnChange} onBlur={mockOnBlur} />);
    await waitFor(() => expect(screen.getByTestId('mock-checkbox-payment_efectivo')).toBeInTheDocument());

    const efectivoCheckbox = screen.getByTestId('mock-checkbox-payment_efectivo');
    fireEvent.click(efectivoCheckbox); // Asumiendo que el mock de Checkbox llama a onChange al hacer click

    // El mock de Checkbox recibe onChange, y este debe ser el que PatientFormFields le pasa.
    // Necesitamos invocar ese onChange simulando el evento de un checkbox.
    const CheckboxMock = require('../../atoms/Checkbox/Checkbox').default;
    const efectivoCheckboxProps = CheckboxMock.mock.calls.find(call => call[0].id === 'payment_efectivo')[0];

    act(() => {
        efectivoCheckboxProps.onChange({ target: { checked: true } }); // Simular chequeo
    });

    expect(mockOnChange).toHaveBeenCalledWith('preferred_payment_methods', 'efectivo');

    // Simular deschequeo (necesitaría que el estado se actualice en el test o pasar un valor inicial)
    // Para simplificar, probamos añadir otro
    const creditoCheckboxProps = CheckboxMock.mock.calls.find(call => call[0].id === 'payment_crédito')[0];
    act(() => {
        creditoCheckboxProps.onChange({ target: { checked: true } });
    });
    // Ahora depende del estado anterior, si 'efectivo' ya estaba, será 'efectivo,crédito'
    // Para un test unitario más aislado, el 'values' debería actualizarse entre interacciones.
    // Aquí verificamos la última llamada con 'crédito'
    expect(mockOnChange).toHaveBeenCalledWith('preferred_payment_methods', expect.stringContaining('crédito'));
  });

  test('maneja cambio en Checkbox de Doctores Asignados', async () => {
    render(<PatientFormFields values={mockValues} errors={mockErrors} touched={mockTouched} onChange={mockOnChange} onBlur={mockOnBlur} />);
    const doctorIdToSelect = mockDoctorsData[0].doctor_id;
    await waitFor(() => expect(screen.getByTestId(`mock-checkbox-doctor_${doctorIdToSelect}`)).toBeInTheDocument());

    const CheckboxMock = require('../../atoms/Checkbox/Checkbox').default;
    const doctorCheckboxProps = CheckboxMock.mock.calls.find(call => call[0].id === `doctor_${doctorIdToSelect}`)[0];

    act(() => {
        doctorCheckboxProps.onChange({ target: { checked: true } });
    });
    expect(mockOnChange).toHaveBeenCalledWith('doctor_ids', [doctorIdToSelect]);
  });

  test('maneja cambio en campos de Persona de Referencia', async () => {
    render(<PatientFormFields values={mockValues} errors={mockErrors} touched={mockTouched} onChange={mockOnChange} onBlur={mockOnBlur} />);
    await waitFor(() => expect(screen.getByTestId('mock-formfield-reference_name')).toBeInTheDocument());

    const FormFieldMock = require('../FormField/FormField').default;
    const refNameFieldProps = FormFieldMock.mock.calls.find(call => call[0].name === 'reference_name')[0];

    const mockEvent = { target: { value: 'Ana' } }; // No tiene 'name' el evento, es manejado por handleReferenceChange
    act(() => {
      refNameFieldProps.onChange(mockEvent); // Esto llama a handleReferenceChange('name', 'Ana')
    });

    expect(mockOnChange).toHaveBeenCalledWith('reference_person', { name: 'Ana', last_name: '', phone: '', relationship: '', address: '' });

    // Simular blur
    act(() => {
      refNameFieldProps.onBlur(); // Esto llama a onBlur('reference_person')
    });
    expect(mockOnBlur).toHaveBeenCalledWith('reference_person');
  });

}); 