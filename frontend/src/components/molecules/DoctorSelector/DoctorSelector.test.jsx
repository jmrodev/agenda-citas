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
    const listItems = screen.queryAllByRole('listitem'); // Assuming li elements are used
    expect(listItems.length).toBe(0);
  });
}); 