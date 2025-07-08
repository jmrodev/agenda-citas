import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import AppointmentListItem from './AppointmentListItem';

describe('AppointmentListItem Component', () => {
  const defaultProps = {
    time: "10:00 AM",
    patient: "Juan Pérez",
    doctor: "Dra. Ana García",
    status: "Confirmada",
    onClick: vi.fn(),
  };

  beforeEach(() => {
    defaultProps.onClick.mockClear();
  });

  test('renderiza todos los datos de la cita, clases y atributos ARIA', () => {
    render(<AppointmentListItem {...defaultProps} />);

    const itemElement = screen.getByRole('button');
    expect(itemElement).toBeInTheDocument();
    expect(itemElement).toHaveClass('item');
    expect(itemElement).toHaveAttribute('tabindex', '0');

    const timeElement = screen.getByText(defaultProps.time);
    expect(timeElement).toBeInTheDocument();
    expect(timeElement).toHaveClass('time');

    // Contenedor .info
    // eslint-disable-next-line testing-library/no-node-access
    const infoElement = timeElement.nextElementSibling;
    expect(infoElement).toHaveClass('info');

    const patientElement = screen.getByText(defaultProps.patient);
    expect(patientElement).toBeInTheDocument();
    expect(patientElement).toHaveClass('patient');
    // eslint-disable-next-line testing-library/no-node-access
    expect(infoElement.contains(patientElement)).toBe(true);


    const doctorElement = screen.getByText(defaultProps.doctor);
    expect(doctorElement).toBeInTheDocument();
    expect(doctorElement).toHaveClass('doctor');
    // eslint-disable-next-line testing-library/no-node-access
    expect(infoElement.contains(doctorElement)).toBe(true);

    const statusElement = screen.getByText(defaultProps.status);
    expect(statusElement).toBeInTheDocument();
    expect(statusElement).toHaveClass('status');
  });

  test('llama a onClick cuando se hace click en el elemento', () => {
    render(<AppointmentListItem {...defaultProps} />);
    const itemElement = screen.getByRole('button');
    fireEvent.click(itemElement);
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  test('no falla si onClick no se proporciona y se hace click', () => {
    const propsWithoutOnClick = { ...defaultProps, onClick: undefined };
    render(<AppointmentListItem {...propsWithoutOnClick} />);
    const itemElement = screen.getByRole('button');

    expect(() => fireEvent.click(itemElement)).not.toThrow();
  });

  test('renderiza correctamente con props de texto vacías', () => {
    const emptyTextProps = {
      time: "",
      patient: "",
      doctor: "",
      status: "",
      onClick: vi.fn()
    };
    render(<AppointmentListItem {...emptyTextProps} />);
    // Los elementos deberían existir pero estar vacíos.
    // Buscamos por clase ya que el texto está vacío.
    // eslint-disable-next-line testing-library/no-container
    const container = render(<AppointmentListItem {...emptyTextProps} />).container;

    // eslint-disable-next-line testing-library/no-node-access
    expect(container.querySelector('.time')).toHaveTextContent('');
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.querySelector('.patient')).toHaveTextContent('');
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.querySelector('.doctor')).toHaveTextContent('');
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.querySelector('.status')).toHaveTextContent('');
  });

  // Este componente no toma className adicional ni ...rest props.
}); 