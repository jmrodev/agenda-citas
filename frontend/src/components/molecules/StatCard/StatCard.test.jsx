import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import StatCard from './StatCard';
import { vi } from 'vitest';

// Mockear DoctorSelector
vi.mock('../DoctorSelector/DoctorSelector', () => ({
  default: vi.fn(({ onSelect, onClose, selectedDoctor, doctors }) => (
    <div data-testid="mock-doctor-selector">
      <p>Selected: {selectedDoctor?.name || selectedDoctor?.first_name}</p>
      <ul>
        {doctors.map(doc => (
          <li key={doc.id || doc.doctor_id} onClick={() => onSelect(doc.id || doc.doctor_id)}>
            {doc.name || `Dr. ${doc.first_name} ${doc.last_name}`}
          </li>
        ))}
      </ul>
      <button onClick={onClose} data-testid="doctor-selector-close">CloseSelector</button>
    </div>
  )),
}));

describe('StatCard Component', () => {
  const mockOnDoctorChange = vi.fn();
  const mockDoctors = [
    { doctor_id: 1, first_name: 'Juan', last_name: 'Perez', name: 'Dr. Juan Perez' }, // Añadir name para consistencia del mock
    { doctor_id: 2, first_name: 'Ana', last_name: 'Gomez', name: 'Dr. Ana Gomez' },
  ];
  const mockDoctor = mockDoctors[0];

  const defaultProps = {
    title: "Pacientes Hoy",
    value: "125",
    icon: <span data-testid="stat-icon">⭐</span>,
    color: 'blue',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renderiza título, valor, icono y aplica color', () => {
    render(<StatCard {...defaultProps} />);

    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.value)).toBeInTheDocument();
    expect(screen.getByTestId('stat-icon')).toBeInTheDocument();

    // eslint-disable-next-line testing-library/no-container
    const cardDiv = render(<StatCard {...defaultProps} />).container.firstChild;
    expect(cardDiv).toHaveStyle(`border-color: ${defaultProps.color}`);
    // eslint-disable-next-line testing-library/no-node-access
    expect(cardDiv.querySelector('.icon')).toHaveStyle(`color: ${defaultProps.color}`);
  });

  test('usa nombre del doctor como título si title no se proporciona y doctor sí', () => {
    render(<StatCard doctor={mockDoctor} value="50" />);
    expect(screen.getByRole('heading', { name: mockDoctor.name })).toBeInTheDocument();
  });

  test('usa "Sin título" si ni title ni doctor.name se proporcionan', () => {
    render(<StatCard value="10" />);
    expect(screen.getByRole('heading', { name: 'Sin título' })).toBeInTheDocument();
  });

  test('aplica clase "selected" si selected es true', () => {
    // eslint-disable-next-line testing-library/no-container
    const { container } = render(<StatCard {...defaultProps} selected={true} />);
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.firstChild).toHaveClass('selected');
  });

  describe('DoctorSelector Functionality', () => {
    test('no muestra DoctorSelector y el cursor es default si onDoctorChange no se proporciona', () => {
      // eslint-disable-next-line testing-library/no-container
      const { container } = render(<StatCard {...defaultProps} doctor={mockDoctor} doctors={mockDoctors} />);
      // eslint-disable-next-line testing-library/no-node-access
      const cardDiv = container.firstChild;
      expect(cardDiv).toHaveStyle('cursor: default');
      fireEvent.click(cardDiv);
      expect(screen.queryByTestId('mock-doctor-selector')).not.toBeInTheDocument();
    });

    test('muestra DoctorSelector al hacer click si props de doctor están presentes y onDoctorChange existe', () => {
      // eslint-disable-next-line testing-library/no-container
      const { container } = render(
        <StatCard {...defaultProps} doctor={mockDoctor} doctors={mockDoctors} onDoctorChange={mockOnDoctorChange} />
      );
      // eslint-disable-next-line testing-library/no-node-access
      const cardDiv = container.firstChild;
      expect(cardDiv).toHaveStyle('cursor: pointer');

      fireEvent.click(cardDiv);
      expect(screen.getByTestId('mock-doctor-selector')).toBeInTheDocument();
      const DoctorSelectorMock = require('../DoctorSelector/DoctorSelector').default;
      expect(DoctorSelectorMock).toHaveBeenCalledWith(
        expect.objectContaining({
          doctors: expect.arrayContaining(mockDoctors.map(d => expect.objectContaining({name: d.name}))), // El map en StatCard añade 'name'
          selectedDoctor: mockDoctor,
          onSelect: expect.any(Function),
          onClose: expect.any(Function),
        }),
        {}
      );
    });

    test('llama a onDoctorChange y cierra DoctorSelector al seleccionar un doctor', async () => {
      render(
        <StatCard {...defaultProps} doctor={mockDoctor} doctors={mockDoctors} onDoctorChange={mockOnDoctorChange} />
      );
      // eslint-disable-next-line testing-library/no-container
      fireEvent.click(render(<StatCard {...defaultProps} doctor={mockDoctor} doctors={mockDoctors} onDoctorChange={mockOnDoctorChange} />).container.firstChild); // Abrir selector

      await screen.findByTestId('mock-doctor-selector'); // Esperar a que aparezca

      // Simular la selección del segundo doctor desde el mock de DoctorSelector
      // El mock de DoctorSelector renderiza <li> con onClick que llama a onSelect(doctorId)
      const doctorOptionToClick = screen.getByText(mockDoctors[1].name); // Dr. Ana Gomez
      fireEvent.click(doctorOptionToClick);

      expect(mockOnDoctorChange).toHaveBeenCalledWith(mockDoctors[1].doctor_id);
      // El DoctorSelector debería ocultarse (showSelector = false)
      await waitFor(() => {
        expect(screen.queryByTestId('mock-doctor-selector')).not.toBeInTheDocument();
      });
    });

    test('cierra DoctorSelector al llamar a su onClose (click en overlay o botón cerrar del mock)', async () => {
      render(
        <StatCard {...defaultProps} doctor={mockDoctor} doctors={mockDoctors} onDoctorChange={mockOnDoctorChange} />
      );
      // eslint-disable-next-line testing-library/no-container
      fireEvent.click(render(<StatCard {...defaultProps} doctor={mockDoctor} doctors={mockDoctors} onDoctorChange={mockOnDoctorChange} />).container.firstChild);
      await screen.findByTestId('mock-doctor-selector');

      // Simular cierre desde el mock de DoctorSelector
      fireEvent.click(screen.getByTestId('doctor-selector-close'));

      await waitFor(() => {
        expect(screen.queryByTestId('mock-doctor-selector')).not.toBeInTheDocument();
      });
    });
  });

  // Verificar clases CSS principales
  test('aplica clases CSS principales a los elementos', () => {
    // eslint-disable-next-line testing-library/no-container
    const { container } = render(<StatCard {...defaultProps} />);
    // eslint-disable-next-line testing-library/no-node-access
    const cardElement = container.firstChild;
    expect(cardElement).toHaveClass('card');
    // eslint-disable-next-line testing-library/no-node-access
    expect(cardElement.querySelector('.icon')).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-node-access
    expect(cardElement.querySelector('.title')).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-node-access
    expect(cardElement.querySelector('.value')).toBeInTheDocument();
  });
}); 