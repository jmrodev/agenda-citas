import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HealthInsuranceForm from './HealthInsuranceForm';
import { vi } from 'vitest';

// Mockear átomos/moléculas hijos
vi.mock('../ModalContainer/ModalContainer', () => ({
  default: vi.fn(({ children, onClose }) => (
    <div data-testid="mock-modal-container" data-onclose={onClose ? 'true' : 'false'}>
      {children}
      <button onClick={onClose} data-testid="modal-close-internal">InternalClose</button> {/* Simular cierre del modal */}
    </div>
  )),
}));
vi.mock('../../atoms/Button/Button', () => ({
  default: vi.fn(({ children, onClick, type, variant }) => (
    <button onClick={onClick} type={type} data-variant={variant} data-testid={`mock-button-${type === 'submit' ? 'submit' : children.toLowerCase()}`}>
      {children}
    </button>
  )),
}));


describe('HealthInsuranceForm Component', () => {
  const mockOnSave = vi.fn();
  const mockOnCancel = vi.fn();

  const initialDataEdit = {
    insurance_id: 1, // Aunque no se usa en el form, es parte del dato
    name: 'OSDE',
    address: 'Av. Corrientes 123',
    phone: '1122334455',
    email: 'osde@example.com',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renderiza el formulario con título "Nueva Obra Social" y campos vacíos por defecto', () => {
    render(<HealthInsuranceForm onSave={mockOnSave} onCancel={mockOnCancel} />);

    expect(screen.getByText('Nueva Obra Social')).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre/i)).toHaveValue('');
    expect(screen.getByLabelText(/Dirección/i)).toHaveValue('');
    expect(screen.getByLabelText(/Teléfono/i)).toHaveValue('');
    expect(screen.getByLabelText(/Email/i)).toHaveValue('');
    expect(screen.getByTestId('mock-button-submit')).toHaveTextContent('Crear');
  });

  test('renderiza el formulario con initialData para edición', () => {
    render(<HealthInsuranceForm initialData={initialDataEdit} onSave={mockOnSave} onCancel={mockOnCancel} />);

    expect(screen.getByText('Editar Obra Social')).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre/i)).toHaveValue(initialDataEdit.name);
    expect(screen.getByLabelText(/Dirección/i)).toHaveValue(initialDataEdit.address);
    expect(screen.getByLabelText(/Teléfono/i)).toHaveValue(initialDataEdit.phone);
    expect(screen.getByLabelText(/Email/i)).toHaveValue(initialDataEdit.email);
    expect(screen.getByTestId('mock-button-submit')).toHaveTextContent('Actualizar');
  });

  test('renderiza el formulario con initialData (null) como si fuera nuevo', () => {
    render(<HealthInsuranceForm initialData={null} onSave={mockOnSave} onCancel={mockOnCancel} />);
    expect(screen.getByText('Nueva Obra Social')).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre/i)).toHaveValue('');
    expect(screen.getByTestId('mock-button-submit')).toHaveTextContent('Crear');
  });

  test('actualiza el estado del formulario al escribir en los inputs', () => {
    render(<HealthInsuranceForm onSave={mockOnSave} onCancel={mockOnCancel} />);

    const nameInput = screen.getByLabelText(/Nombre/i);
    fireEvent.change(nameInput, { target: { value: 'Swiss Medical' } });
    expect(nameInput.value).toBe('Swiss Medical');

    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.change(emailInput, { target: { value: 'info@swiss.com' } });
    expect(emailInput.value).toBe('info@swiss.com');
  });

  test('llama a onSave con los datos del formulario al hacer submit', () => {
    render(<HealthInsuranceForm onSave={mockOnSave} onCancel={mockOnCancel} />);

    const nameInput = screen.getByLabelText(/Nombre/i);
    const addressInput = screen.getByLabelText(/Dirección/i);
    const phoneInput = screen.getByLabelText(/Teléfono/i);
    const emailInput = screen.getByLabelText(/Email/i);

    fireEvent.change(nameInput, { target: { value: 'Galeno' } });
    fireEvent.change(addressInput, { target: { value: 'Calle Falsa 123' } });
    fireEvent.change(phoneInput, { target: { value: '9876543210' } });
    fireEvent.change(emailInput, { target: { value: 'contacto@galeno.com.ar' } });

    const formElement = screen.getByRole('form'); // El form es el padre de los inputs
    fireEvent.submit(formElement);
    // O fireEvent.click(screen.getByTestId('mock-button-submit'));

    expect(mockOnSave).toHaveBeenCalledTimes(1);
    expect(mockOnSave).toHaveBeenCalledWith({
      name: 'Galeno',
      address: 'Calle Falsa 123',
      phone: '9876543210',
      email: 'contacto@galeno.com.ar',
    });
  });

  test('llama a onCancel cuando se hace click en el botón Cancelar', () => {
    render(<HealthInsuranceForm onSave={mockOnSave} onCancel={mockOnCancel} />);
    const cancelButton = screen.getByTestId('mock-button-cancelar'); // El mock de Button usa el children como parte del testid
    fireEvent.click(cancelButton);
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  test('ModalContainer recibe onClose (que es onCancel de HealthInsuranceForm)', () => {
    render(<HealthInsuranceForm onSave={mockOnSave} onCancel={mockOnCancel} />);
    const ModalContainerMock = require('../ModalContainer/ModalContainer').default;
    expect(ModalContainerMock).toHaveBeenCalledTimes(1);
    // Verificar que la prop onClose de ModalContainer es la misma función que onCancel
    expect(ModalContainerMock.mock.calls[0][0].onClose).toBe(mockOnCancel);

    // También se puede simular el cierre interno del modal si el mock lo permite
    // fireEvent.click(screen.getByTestId('modal-close-internal'));
    // expect(mockOnCancel).toHaveBeenCalledTimes(1); // Si el mock de ModalContainer llama a su onClose
  });

  test('el campo Nombre es requerido', () => {
    render(<HealthInsuranceForm onSave={mockOnSave} onCancel={mockOnCancel} />);
    const nameInput = screen.getByLabelText(/Nombre/i);
    expect(nameInput).toBeRequired();
  });
}); 