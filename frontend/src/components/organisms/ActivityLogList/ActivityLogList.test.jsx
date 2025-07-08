import { render, screen } from '@testing-library/react';
import ActivityLogList from './ActivityLogList';

import { vi } from 'vitest';

// Mock de ActivityLogItem
vi.mock('../../molecules/ActivityLogItem/ActivityLogItem', () => {
  return {
    default: function MockActivityLogItem(props) {
      return <div data-testid="activity-log-item">{props.description}</div>;
    }
  };
});

describe('ActivityLogList', () => {
  const mockActivities = [
    { description: 'Cita creada por secretaria Ana', date: '2024-06-10' },
    { description: 'Paciente editado por secretaria Laura', date: '2024-06-11' }
  ];

  test('renderiza el título de la lista', () => {
    render(<ActivityLogList activities={mockActivities} />);
    expect(screen.getByText('Actividad de secretarias')).toBeInTheDocument();
  });

  test('renderiza los elementos de actividad', () => {
    render(<ActivityLogList activities={mockActivities} />);
    const items = screen.getAllByTestId('activity-log-item');
    expect(items).toHaveLength(mockActivities.length);
    expect(screen.getByText('Cita creada por secretaria Ana')).toBeInTheDocument();
    expect(screen.getByText('Paciente editado por secretaria Laura')).toBeInTheDocument();
  });

  test('muestra mensaje vacío cuando no hay actividades', () => {
    render(<ActivityLogList activities={[]} />);
    expect(screen.getByText('No hay actividades recientes.')).toBeInTheDocument();
  });
}); 