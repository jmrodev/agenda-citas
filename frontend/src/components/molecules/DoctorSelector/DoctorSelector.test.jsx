import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import DoctorSelector from './DoctorSelector';
import styles from './DoctorSelector.module.css'; // Import styles to access class names

describe('DoctorSelector', () => {
  const mockDoctors = [
    { doctor_id: 1, first_name: 'Juan', last_name: 'Perez' },
    { doctor_id: 2, first_name: 'Ana', last_name: 'Gomez' },
  ];
  const mockOnSelect = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renderiza el título y la lista de doctores (modal variant)', () => {
    render(
      <DoctorSelector
        doctors={mockDoctors}
        selectedDoctor={{}}
        onSelect={mockOnSelect}
        onClose={mockOnClose}
        variant="modal"
      />
    );

    expect(screen.getByText('Selecciona un doctor')).toBeInTheDocument();
    expect(screen.getByText('Dr. Juan Perez')).toBeInTheDocument();
    expect(screen.getByText('Dr. Ana Gomez')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cerrar' })).toBeInTheDocument();
  });

  test('llama a onSelect cuando se hace click en un doctor', () => {
    render(
      <DoctorSelector
        doctors={mockDoctors}
        selectedDoctor={{}}
        onSelect={mockOnSelect}
        variant="inline"
      />
    );

    fireEvent.click(screen.getByText('Dr. Ana Gomez'));
    expect(mockOnSelect).toHaveBeenCalledWith(mockDoctors[1].doctor_id);
  });

  test('llama a onClose cuando se hace click en el botón Cerrar (modal variant)', () => {
    render(
      <DoctorSelector
        doctors={mockDoctors}
        selectedDoctor={{}}
        onSelect={mockOnSelect}
        onClose={mockOnClose}
        variant="modal"
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar' }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('llama a onClose cuando se hace click en el overlay (modal variant)', () => {
    const { container } = render(
      <DoctorSelector
        doctors={mockDoctors}
        selectedDoctor={{}}
        onSelect={mockOnSelect}
        onClose={mockOnClose}
        variant="modal"
      />
    );
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const overlay = container.querySelector(`.${styles.overlay}`);
    expect(overlay).toBeInTheDocument(); // Ensure overlay exists
    if (overlay) { // Type guard for overlay
        fireEvent.click(overlay);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    }
  });

  test('renderiza correctamente en modo dropdown e inline', () => {
    const { rerender } = render(
      <DoctorSelector doctors={mockDoctors} selectedDoctor={{}} onSelect={mockOnSelect} variant="dropdown" />
    );
    expect(screen.getByText('Dr. Juan Perez')).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    expect(document.querySelector(`.${styles.dropdown}`)).toBeInTheDocument();


    rerender(
      <DoctorSelector doctors={mockDoctors} selectedDoctor={{}} onSelect={mockOnSelect} variant="inline" />
    );
    expect(screen.getByText('Dr. Ana Gomez')).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    expect(document.querySelector(`.${styles.overlay}`)).not.toBeInTheDocument(); // No overlay in inline
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    expect(document.querySelector(`.${styles.dropdown}`)).not.toBeInTheDocument(); // No dropdown wrapper in inline
  });

  test('marca el doctor seleccionado', () => {
    render(
      <DoctorSelector
        doctors={mockDoctors}
        selectedDoctor={mockDoctors[0]} // Select Juan Perez
        onSelect={mockOnSelect}
        variant="inline"
      />
    );
    const selectedListItem = screen.getByText('Dr. Juan Perez');
    expect(selectedListItem).toHaveClass(styles.selected);
  });

  test('renderiza lista vacía si no hay doctores', () => {
    render(
      <DoctorSelector
        doctors={[]}
        selectedDoctor={{}}
        onSelect={mockOnSelect}
        variant="inline"
      />
    );
    expect(screen.getByText('Selecciona un doctor')).toBeInTheDocument();
    const listItems = screen.queryAllByRole('listitem');
    expect(listItems.length).toBe(0);
    // Asegurar que el título sigue ahí
    expect(screen.getByText('Selecciona un doctor')).toBeInTheDocument();
  });

  test('aplica clases CSS principales correctamente para variante modal', () => {
    const { container } = render(
      <DoctorSelector doctors={mockDoctors} selectedDoctor={{}} onSelect={mockOnSelect} onClose={mockOnClose} variant="modal" />
    );
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    expect(container.firstChild).toHaveClass(styles.overlay);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const selectorDiv = container.querySelector(`.${styles.selector}`);
    expect(selectorDiv).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    expect(selectorDiv.querySelector(`.${styles.title}`)).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    expect(selectorDiv.querySelector(`.${styles.list}`)).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    expect(selectorDiv.querySelector(`.${styles.closeBtn}`)).toBeInTheDocument();
  });

  test('aplica clases CSS principales correctamente para variante dropdown', () => {
    const { container } = render(
      <DoctorSelector doctors={mockDoctors} selectedDoctor={{}} onSelect={mockOnSelect} variant="dropdown" />
    );
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    expect(container.firstChild).toHaveClass(styles.dropdown);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const selectorDiv = container.querySelector(`.${styles.selector}`);
    expect(selectorDiv).toBeInTheDocument();
  });

  test('aplica clases CSS principales correctamente para variante inline', () => {
    const { container } = render(
      <DoctorSelector doctors={mockDoctors} selectedDoctor={{}} onSelect={mockOnSelect} variant="inline" />
    );
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    expect(container.firstChild).toHaveClass(styles.selector); // El selector es el elemento raíz
    expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
    expect(screen.queryByTestId('dropdown-wrapper')).not.toBeInTheDocument();
  });

  test('aplica la prop style al div.selector', () => {
    const customStyle = { padding: '20px', border: '1px solid blue' };
    render(
      <DoctorSelector
        doctors={mockDoctors}
        selectedDoctor={{}}
        onSelect={mockOnSelect}
        variant="inline" // Más fácil de testear el style en el elemento raíz
        style={customStyle}
      />
    );
    const selectorDiv = screen.getByText('Dr. Juan Perez').closest(`.${styles.selector}`);
    expect(selectorDiv).toHaveStyle('padding: 20px');
    expect(selectorDiv).toHaveStyle('border: 1px solid blue');
  });

  test('utiliza doctor.id si doctor_id no está presente', () => {
    const doctorsWithId = [
      { id: 100, name: 'Dr. House' },
      { id: 101, name: 'Dr. Strange' }
    ];
    render(
      <DoctorSelector
        doctors={doctorsWithId}
        selectedDoctor={{id: 100}}
        onSelect={mockOnSelect}
        variant="inline"
      />
    );
    expect(screen.getByText('Dr. House')).toHaveClass(styles.selected);
    fireEvent.click(screen.getByText('Dr. Strange'));
    expect(mockOnSelect).toHaveBeenCalledWith(101);
  });
}); 