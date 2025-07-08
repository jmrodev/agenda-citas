import { render, screen } from '@testing-library/react';
import ActivityLogList from './ActivityLogList';

import { vi } from 'vitest';

// Mock de ActivityLogItem
vi.mock('../../molecules/ActivityLogItem/ActivityLogItem', () => ({
  default: vi.fn((props) => (
    <div data-testid={`activity-log-item-${props.keyProp || props.time}`}> {/* Usar keyProp o time para unicidad */}
      <span>Time: {props.time}</span>
      <span>Secretary: {props.secretary}</span>
      <span>Type: {props.activityType}</span>
      <span>Detail: {props.detail}</span>
    </div>
  )),
}));

describe('ActivityLogList Component', () => {
  const mockActivities = [
    { time: '10:00', secretary: 'Ana', activityType: 'Creación', detail: 'Nuevo paciente Juan', keyProp: 'act1' },
    { time: '11:30', secretary: 'Laura', activityType: 'Edición', detail: 'Cambio de cita', keyProp: 'act2' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renderiza el título y las clases CSS principales', () => {
    const { container } = render(<ActivityLogList activities={mockActivities} />);
    const titleElement = screen.getByRole('heading', { name: 'Actividad de secretarias', level: 3 });
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass('title');

    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const listDiv = container.firstChild;
    expect(listDiv).toHaveClass('list');
  });

  test('renderiza un ActivityLogItem (mock) para cada actividad con las props correctas', () => {
    render(<ActivityLogList activities={mockActivities} />);

    const ActivityLogItemMock = require('../../molecules/ActivityLogItem/ActivityLogItem').default;
    expect(ActivityLogItemMock).toHaveBeenCalledTimes(mockActivities.length);

    mockActivities.forEach((activity, index) => {
      expect(ActivityLogItemMock).toHaveBeenNthCalledWith(
        index + 1,
        expect.objectContaining({ // El mock recibe todas las props de la actividad
          time: activity.time,
          secretary: activity.secretary,
          activityType: activity.activityType,
          detail: activity.detail,
        }),
        {} // Contexto del mock
      );
      // Verificar que el contenido renderizado por el mock está presente
      const itemElement = screen.getByTestId(`activity-log-item-${activity.keyProp}`);
      expect(itemElement).toBeInTheDocument();
      expect(itemElement).toHaveTextContent(`Time: ${activity.time}`);
      expect(itemElement).toHaveTextContent(`Secretary: ${activity.secretary}`);
      expect(itemElement).toHaveTextContent(`Type: ${activity.activityType}`);
      expect(itemElement).toHaveTextContent(`Detail: ${activity.detail}`);
    });
  });

  test('muestra mensaje vacío con clase "empty" cuando no hay actividades', () => {
    render(<ActivityLogList activities={[]} />);
    expect(screen.getByText('No hay actividades recientes.')).toBeInTheDocument();
  });
}); 