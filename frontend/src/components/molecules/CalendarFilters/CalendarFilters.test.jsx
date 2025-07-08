import { render, screen, fireEvent } from '@testing-library/react';
import CalendarFilters from './CalendarFilters';
import { vi } from 'vitest';

describe('CalendarFilters Component', () => {
  const initialFilters = {
    cita: true,
    disponibilidad: false,
    actividad: true,
  };
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  test('renderiza los checkboxes con sus etiquetas visuales y el estado checked inicial correcto', () => {
    render(<CalendarFilters filters={initialFilters} onChange={mockOnChange} />);

    // Verificar etiquetas visuales (spans)
    expect(screen.getByText('Citas')).toBeInTheDocument();
    expect(screen.getByText('Disponibilidad')).toBeInTheDocument();
    expect(screen.getByText('Actividades')).toBeInTheDocument();

    // Verificar checkboxes por aria-label y su estado
    const citasCheckbox = screen.getByRole('checkbox', { name: 'Citas' });
    expect(citasCheckbox).toBeInTheDocument();
    expect(citasCheckbox).toBeChecked();

    const disponibilidadCheckbox = screen.getByRole('checkbox', { name: 'Disponibilidad' });
    expect(disponibilidadCheckbox).toBeInTheDocument();
    expect(disponibilidadCheckbox).not.toBeChecked();

    const actividadCheckbox = screen.getByRole('checkbox', { name: 'Actividades' });
    expect(actividadCheckbox).toBeInTheDocument();
    expect(actividadCheckbox).toBeChecked();

    // Verificar clase base del contenedor
    // eslint-disable-next-line testing-library/no-node-access
    expect(citasCheckbox.closest('div[class*="filters"]')).toHaveClass('filters');
  });

  test('llama a onChange con el filtro "cita" actualizado cuando se hace click', () => {
    render(<CalendarFilters filters={initialFilters} onChange={mockOnChange} />);
    const citasCheckbox = screen.getByRole('checkbox', { name: 'Citas' });

    fireEvent.click(citasCheckbox);

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith({
      ...initialFilters,
      cita: !initialFilters.cita, // Debería ser false
    });
  });

  test('llama a onChange con el filtro "disponibilidad" actualizado cuando se hace click', () => {
    render(<CalendarFilters filters={initialFilters} onChange={mockOnChange} />);
    const disponibilidadCheckbox = screen.getByRole('checkbox', { name: 'Disponibilidad' });

    fireEvent.click(disponibilidadCheckbox);

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith({
      ...initialFilters,
      disponibilidad: !initialFilters.disponibilidad, // Debería ser true
    });
  });

  test('llama a onChange con el filtro "actividad" actualizado cuando se hace click', () => {
    render(<CalendarFilters filters={initialFilters} onChange={mockOnChange} />);
    const actividadCheckbox = screen.getByRole('checkbox', { name: 'Actividades' });

    fireEvent.click(actividadCheckbox);

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith({
      ...initialFilters,
      actividad: !initialFilters.actividad, // Debería ser false
    });
  });

  // El componente CalendarFilters no acepta className ni ...rest directamente en su div principal.
  // Si se quisiera esa funcionalidad, habría que modificar el componente.
}); 