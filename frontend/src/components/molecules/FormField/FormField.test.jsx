import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FormField from './FormField';
import { vi } from 'vitest';

// Mockear los átomos
vi.mock('../../atoms/Label/Label', () => ({
  default: vi.fn(({ htmlFor, children, required, className }) => (
    <label htmlFor={htmlFor} data-required={required} className={className} data-testid="mock-label">
      {children}
    </label>
  )),
}));
vi.mock('../../atoms/Input/Input', () => ({
  default: vi.fn((props) => <input {...props} data-testid="mock-input" />),
}));
vi.mock('../../atoms/Textarea/Textarea', () => ({
  default: vi.fn((props) => <textarea {...props} data-testid="mock-textarea" />),
}));
vi.mock('../../atoms/Select/Select', () => ({
  default: vi.fn((props) => <select {...props} data-testid="mock-select">{props.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select>),
}));
vi.mock('../../atoms/HelperText/HelperText', () => ({
  default: vi.fn(({ children, type, className }) => <div data-testid="mock-helpertext" data-type={type} className={className}>{children}</div>),
}));
vi.mock('../../atoms/FormErrorIcon/FormErrorIcon', () => ({
  default: vi.fn(({className}) => <span data-testid="mock-formerroricon" className={className}>ErrorIcon</span>),
}));


describe('FormField Component', () => {
  const mockOnChange = vi.fn();
  const mockOnBlur = vi.fn();

  const defaultProps = {
    label: 'Nombre Completo',
    name: 'fullName',
    value: 'Juan Perez',
    onChange: mockOnChange,
    onBlur: mockOnBlur,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renderiza Label e Input por defecto con props correctas', () => {
    render(<FormField {...defaultProps} placeholder="Escribe aquí" required />);

    // Label
    const LabelMock = require('../../atoms/Label/Label').default;
    expect(LabelMock).toHaveBeenCalledTimes(1);
    expect(LabelMock).toHaveBeenCalledWith(expect.objectContaining({
      htmlFor: defaultProps.name,
      children: defaultProps.label,
      required: true,
      className: expect.stringContaining('label')
    }), {});
    expect(screen.getByTestId('mock-label')).toHaveTextContent(defaultProps.label);

    // Input
    const InputMock = require('../../atoms/Input/Input').default;
    expect(InputMock).toHaveBeenCalledTimes(1);
    expect(InputMock).toHaveBeenCalledWith(expect.objectContaining({
      id: defaultProps.name,
      name: defaultProps.name,
      type: 'text',
      value: defaultProps.value,
      onChange: expect.any(Function), // El handleChange interno
      onBlur: mockOnBlur,
      disabled: false,
      placeholder: "Escribe aquí",
      className: '' // No error class
    }), {});
    expect(screen.getByTestId('mock-input')).toBeInTheDocument();
  });

  test('no renderiza Label si no se proporciona la prop label', () => {
    render(<FormField {...defaultProps} label={undefined} />);
    expect(require('../../atoms/Label/Label').default).not.toHaveBeenCalled();
    expect(screen.queryByTestId('mock-label')).not.toBeInTheDocument();
  });

  test('renderiza Textarea cuando type="textarea"', () => {
    render(<FormField {...defaultProps} type="textarea" rows={5} />);
    const TextareaMock = require('../../atoms/Textarea/Textarea').default;
    expect(TextareaMock).toHaveBeenCalledTimes(1);
    expect(TextareaMock).toHaveBeenCalledWith(expect.objectContaining({ id: defaultProps.name, value: defaultProps.value, rows: 5 }), {});
    expect(screen.getByTestId('mock-textarea')).toBeInTheDocument();
    expect(require('../../atoms/Input/Input').default).not.toHaveBeenCalled();
  });

  test('renderiza Select cuando type="select"', () => {
    const options = [{value: 'a', label: 'A'}];
    render(<FormField {...defaultProps} type="select" options={options} />);
    const SelectMock = require('../../atoms/Select/Select').default;
    expect(SelectMock).toHaveBeenCalledTimes(1);
    expect(SelectMock).toHaveBeenCalledWith(expect.objectContaining({ id: defaultProps.name, value: defaultProps.value, options }), {});
    expect(screen.getByTestId('mock-select')).toBeInTheDocument();
  });

  test('renderiza children personalizados en lugar de input/textarea/select', () => {
    const CustomChild = () => <div data-testid="custom-child">Soy un hijo</div>;
    render(<FormField {...defaultProps}><CustomChild /></FormField>);

    expect(screen.getByTestId('custom-child')).toBeInTheDocument();
    expect(require('../../atoms/Input/Input').default).not.toHaveBeenCalled();
    expect(require('../../atoms/Textarea/Textarea').default).not.toHaveBeenCalled();
    expect(require('../../atoms/Select/Select').default).not.toHaveBeenCalled();
  });

  test('maneja el evento onChange correctamente', () => {
    render(<FormField {...defaultProps} />);
    const inputElement = screen.getByTestId('mock-input');
    const mockEvent = { target: { value: 'Nuevo Valor' } };

    // El mock de Input recibe un onChange que es el handleChange interno de FormField
    const InputMock = require('../../atoms/Input/Input').default;
    const internalOnChange = InputMock.mock.calls[0][0].onChange;

    act(() => { // act es necesario si el callback de onChange causa actualizaciones de estado en el componente testeado o sus padres
        internalOnChange(mockEvent);
    });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(mockEvent); // FormField pasa el evento original
  });

  describe('Estado de Error y HelperText', () => {
    test('cuando hay error, muestra FormErrorIcon y HelperText con mensaje de error', () => {
      const errorMessage = "Campo inválido";
      render(<FormField {...defaultProps} error={errorMessage} helperText="Texto de ayuda normal" />);

      // FormErrorIcon
      const FormErrorIconMock = require('../../atoms/FormErrorIcon/FormErrorIcon').default;
      expect(FormErrorIconMock).toHaveBeenCalledTimes(1);
      expect(FormErrorIconMock).toHaveBeenCalledWith(expect.objectContaining({ className: expect.stringContaining('errorIcon') }), {});
      expect(screen.getByTestId('mock-formerroricon')).toBeInTheDocument();

      // HelperText (debe mostrar el error, no el helperText normal)
      const HelperTextMock = require('../../atoms/HelperText/HelperText').default;
      expect(HelperTextMock).toHaveBeenCalledTimes(1);
      expect(HelperTextMock).toHaveBeenCalledWith(expect.objectContaining({
        children: errorMessage,
        type: 'error',
        className: expect.stringContaining('errorText')
      }), {});
      expect(screen.getByTestId('mock-helpertext')).toHaveTextContent(errorMessage);

      // Input debe tener clase de error
      const InputMock = require('../../atoms/Input/Input').default;
      expect(InputMock).toHaveBeenCalledWith(expect.objectContaining({ className: expect.stringContaining('inputError') }), {});

      // Contenedor principal debe tener clase de error
      // eslint-disable-next-line testing-library/no-node-access
      expect(screen.getByTestId('mock-input').closest('div[class*="formField"]')).toHaveClass('error');
    });

    test('cuando no hay error pero hay helperText, muestra HelperText normal', () => {
      const helperMessage = "Instrucciones útiles";
      render(<FormField {...defaultProps} helperText={helperMessage} />);

      const HelperTextMock = require('../../atoms/HelperText/HelperText').default;
      expect(HelperTextMock).toHaveBeenCalledTimes(1);
      expect(HelperTextMock).toHaveBeenCalledWith(expect.objectContaining({
        children: helperMessage,
        type: 'helper',
        className: expect.stringContaining('helperText')
      }), {});
      expect(screen.getByTestId('mock-helpertext')).toHaveTextContent(helperMessage);
      expect(require('../../atoms/FormErrorIcon/FormErrorIcon').default).not.toHaveBeenCalled();
    });

    test('no muestra HelperText ni FormErrorIcon si no hay error ni helperText', () => {
      render(<FormField {...defaultProps} />);
      expect(require('../../atoms/HelperText/HelperText').default).not.toHaveBeenCalled();
      expect(require('../../atoms/FormErrorIcon/FormErrorIcon').default).not.toHaveBeenCalled();
    });
  });

  test('aplica clases de disabled al contenedor y pasa disabled al input', () => {
    render(<FormField {...defaultProps} disabled={true} />);
    // eslint-disable-next-line testing-library/no-node-access
    expect(screen.getByTestId('mock-input').closest('div[class*="formField"]')).toHaveClass('disabled');
    expect(require('../../atoms/Input/Input').default).toHaveBeenCalledWith(expect.objectContaining({ disabled: true }), {});
  });

  test('aplica className al div contenedor principal', () => {
    const customClass = "mi-campo-formulario";
    render(<FormField {...defaultProps} className={customClass} />);
    // eslint-disable-next-line testing-library/no-node-access
    expect(screen.getByTestId('mock-input').closest('div[class*="formField"]')).toHaveClass(customClass);
  });

  // La sanitización no se prueba aquí porque el componente FormField actual
  // no la aplica internamente al valor antes de llamar a onChange.
  // El callback sanitizeValue está definido pero no se usa en handleChange.
}); 