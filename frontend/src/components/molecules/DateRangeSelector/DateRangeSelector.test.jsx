import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import DateRangeSelector from './DateRangeSelector';
import { vi } from 'vitest';

// Lista de opciones predefinidas tal como está en el componente
const PREDEFINED_RANGES_OPTIONS = [
  { label: 'Hoy', value: 'today' },
  { label: 'Ayer', value: 'yesterday' },
  { label: 'Últimos 7 días', value: 'last7days' },
  { label: 'Esta semana', value: 'thisWeek' },
  { label: 'Semana pasada', value: 'lastWeek' },
  { label: 'Este mes', value: 'thisMonth' },
  { label: 'Mes pasado', value: 'lastMonth' },
  { label: 'Este año', value: 'thisYear' },
  { label: 'Año pasado', value: 'lastYear' },
];

describe('DateRangeSelector Component', () => {
  const mockOnRangeChange = vi.fn();
  let mockDateNow;

  beforeEach(() => {
    mockOnRangeChange.mockClear();
    // Mockear Date para tener resultados predecibles en calculateDateRange
    // Vamos a fijar la fecha a 15 de Junio de 2024
    const mockCurrentDate = new Date(2024, 5, 15, 10, 0, 0); // Mes 5 es Junio
    mockDateNow = vi.spyOn(global, 'Date').mockImplementation((...args) => {
      if (args.length > 0) {
        return new (Function.prototype.bind.apply(global.Date.ORIGINAL_DATE_CONSTRUCTOR, [null, ...args]));
      }
      return mockCurrentDate;
    });
    // Guardar el constructor original para poder restaurarlo y usarlo dentro del mock si es necesario
    global.Date.ORIGINAL_DATE_CONSTRUCTOR = global.Date;
  });

  afterEach(() => {
    vi.restoreAllMocks(); // Restaura todos los mocks, incluyendo Date
    global.Date = global.Date.ORIGINAL_DATE_CONSTRUCTOR; // Asegurarse de restaurar Date correctamente
    delete global.Date.ORIGINAL_DATE_CONSTRUCTOR;
  });

  test('renderiza el Select con las opciones predefinidas y el valor inicial correcto', () => {
    render(<DateRangeSelector onRangeChange={mockOnRangeChange} initialRange="last7days" />);

    const selectElement = screen.getByRole('combobox', { name: 'Seleccionar Rango:' });
    expect(selectElement).toBeInTheDocument();
    expect(selectElement).toHaveValue('last7days');
    expect(selectElement).toHaveClass('selectControl');

    // Verificar que todas las opciones predefinidas están presentes
    PREDEFINED_RANGES_OPTIONS.forEach(opt => {
      expect(screen.getByRole('option', { name: opt.label })).toHaveValue(opt.value);
    });

    // Verificar clase del contenedor principal
    // eslint-disable-next-line testing-library/no-node-access
    expect(selectElement.closest('div')).toHaveClass('dateRangeSelector');
  });

  test('llama a onRangeChange con el rango calculado para initialRange después del montaje', () => {
    // El useEffect llama a onRangeChange.
    // Dado que Date está mockeado a 2024-06-15
    // initialRange="thisMonth" debería ser 2024-06-01 a 2024-06-30
    render(<DateRangeSelector onRangeChange={mockOnRangeChange} initialRange="thisMonth" />);

    expect(mockOnRangeChange).toHaveBeenCalledTimes(1);
    const expectedStartDateThisMonth = new Date(2024, 5, 1).toISOString();
    const expectedEndDateThisMonth = new Date(2024, 5, 30, 23, 59, 59, 999).toISOString();

    expect(mockOnRangeChange).toHaveBeenCalledWith({
      key: 'thisMonth',
      label: 'Este mes',
      startDate: expectedStartDateThisMonth,
      endDate: expectedEndDateThisMonth,
    });
  });

  test('actualiza el rango seleccionado y llama a onRangeChange con nuevas fechas al cambiar el select', () => {
    render(<DateRangeSelector onRangeChange={mockOnRangeChange} initialRange="thisMonth" />);
    mockOnRangeChange.mockClear(); // Limpiar la llamada inicial del useEffect

    const selectElement = screen.getByRole('combobox', { name: 'Seleccionar Rango:' });

    // Cambiar a "Hoy" (today)
    // Fecha mockeada: 2024-06-15
    fireEvent.change(selectElement, { target: { value: 'today' } });

    expect(selectElement).toHaveValue('today');
    expect(mockOnRangeChange).toHaveBeenCalledTimes(1);

    const expectedStartDateToday = new Date(2024, 5, 15, 0, 0, 0, 0).toISOString();
    const expectedEndDateToday = new Date(2024, 5, 15, 23, 59, 59, 999).toISOString();

    expect(mockOnRangeChange).toHaveBeenCalledWith({
      key: 'today',
      label: 'Hoy',
      startDate: expectedStartDateToday,
      endDate: expectedEndDateToday,
    });
  });

  test('calcula correctamente el rango para "last7days"', () => {
    render(<DateRangeSelector onRangeChange={mockOnRangeChange} initialRange="thisMonth" />);
    mockOnRangeChange.mockClear();
    const selectElement = screen.getByRole('combobox', { name: 'Seleccionar Rango:' });

    fireEvent.change(selectElement, { target: { value: 'last7days' } });
    // Fecha mockeada: 2024-06-15. "Últimos 7 días" incluye hoy.
    // Hoy es 15. Hace 6 días es 9. Rango: 2024-06-09 00:00:00 a 2024-06-15 23:59:59
    const expectedStartDate = new Date(2024, 5, 9, 0, 0, 0, 0).toISOString();
    const expectedEndDate = new Date(2024, 5, 15, 23, 59, 59, 999).toISOString();

    expect(mockOnRangeChange).toHaveBeenCalledWith({
      key: 'last7days',
      label: 'Últimos 7 días',
      startDate: expectedStartDate,
      endDate: expectedEndDate,
    });
  });

  test('calcula correctamente el rango para "lastMonth"', () => {
    render(<DateRangeSelector onRangeChange={mockOnRangeChange} initialRange="thisMonth" />);
    mockOnRangeChange.mockClear();
    const selectElement = screen.getByRole('combobox', { name: 'Seleccionar Rango:' });

    fireEvent.change(selectElement, { target: { value: 'lastMonth' } });
    // Fecha mockeada: 2024-06-15. Mes pasado es Mayo 2024.
    // Rango: 2024-05-01 00:00:00 a 2024-05-31 23:59:59
    const expectedStartDate = new Date(2024, 4, 1).toISOString(); // Mes 4 es Mayo
    const expectedEndDate = new Date(2024, 5, 0, 23, 59, 59, 999).toISOString(); // new Date(year, month, 0) da el último día del mes anterior

    expect(mockOnRangeChange).toHaveBeenCalledWith({
      key: 'lastMonth',
      label: 'Mes pasado',
      startDate: expectedStartDate,
      endDate: expectedEndDate,
    });
  });

  // El componente no maneja className ni ...rest en su div principal.
}); 