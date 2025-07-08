import { render, screen, fireEvent } from '@testing-library/react';
import StatsGrid from './StatsGrid';
import { vi } from 'vitest';

// Mock de los componentes hijos
vi.mock('../../molecules/StatCard/StatCard', () => {
  return {
    default: function MockStatCard({ title, value, icon, color, trend }) {
      return (
        <div data-testid="stat-card" data-color={color}>
          <div data-testid="stat-title">{title}</div>
          <div data-testid="stat-value">{value}</div>
          <div data-testid="stat-icon">{icon}</div>
          {trend && <div data-testid="stat-trend">{trend}</div>}
        </div>
      );
    }
  };
});

vi.mock('../../molecules/QuickAction/QuickAction', () => {
  return {
    default: function MockQuickAction({ title, icon, onClick, variant }) {
      return (
        <button data-testid="quick-action" onClick={onClick} data-variant={variant}>
          <span data-testid="action-title">{title}</span>
          <span data-testid="action-icon">{icon}</span>
        </button>
      );
    }
  };
});

describe('StatsGrid', () => {
  const mockStats = [
    {
      title: 'Total Pacientes',
      value: '1,234',
      icon: '👥',
      color: 'var(--primary-color)',
      trend: '+12%'
    },
    {
      title: 'Citas Hoy',
      value: '45',
      icon: '📅',
      color: 'var(--secondary-color)',
      trend: '+5%'
    },
    {
      title: 'Ingresos Mensuales',
      value: '$12,500',
      icon: '💰',
      color: 'var(--success-color)'
    }
  ];

  const mockActions = [
    {
      title: 'Nuevo Paciente',
      icon: '➕',
      onClick: vi.fn(),
      variant: 'primary'
    },
    {
      title: 'Nueva Cita',
      icon: '📝',
      onClick: vi.fn(),
      variant: 'secondary'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renderiza el grid de estadísticas', () => {
    render(<StatsGrid stats={mockStats} />);
    
    expect(screen.getByTestId('stat-card')).toBeInTheDocument();
  });

  test('renderiza todas las estadísticas proporcionadas', () => {
    render(<StatsGrid stats={mockStats} />);
    
    const statCards = screen.getAllByTestId('stat-card');
    expect(statCards).toHaveLength(mockStats.length);
  });

  test('renderiza correctamente los datos de cada estadística', () => {
    render(<StatsGrid stats={mockStats} />);
    
    // Verificar la primera estadística
    expect(screen.getByText('Total Pacientes')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
    expect(screen.getByText('👥')).toBeInTheDocument();
    expect(screen.getByText('+12%')).toBeInTheDocument();
    
    // Verificar la segunda estadística
    expect(screen.getByText('Citas Hoy')).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();
    expect(screen.getByText('📅')).toBeInTheDocument();
    expect(screen.getByText('+5%')).toBeInTheDocument();
    
    // Verificar la tercera estadística
    expect(screen.getByText('Ingresos Mensuales')).toBeInTheDocument();
    expect(screen.getByText('$12,500')).toBeInTheDocument();
    expect(screen.getByText('💰')).toBeInTheDocument();
  });

  test('aplica color por defecto cuando no se especifica', () => {
    const statsWithoutColor = [
      {
        title: 'Test Stat',
        value: '100',
        icon: '📊'
      }
    ];
    
    render(<StatsGrid stats={statsWithoutColor} />);
    
    const statCard = screen.getByTestId('stat-card');
    expect(statCard.getAttribute('data-color')).toBe('var(--primary-color)');
  });

  test('renderiza acciones cuando se proporcionan', () => {
    render(<StatsGrid stats={mockStats} actions={mockActions} />);
    
    const quickActions = screen.getAllByTestId('quick-action');
    expect(quickActions).toHaveLength(mockActions.length);
  });

  test('renderiza correctamente los datos de cada acción', () => {
    render(<StatsGrid stats={mockStats} actions={mockActions} />);
    
    // Verificar la primera acción
    expect(screen.getByText('Nuevo Paciente')).toBeInTheDocument();
    expect(screen.getByText('➕')).toBeInTheDocument();
    
    // Verificar la segunda acción
    expect(screen.getByText('Nueva Cita')).toBeInTheDocument();
    expect(screen.getByText('📝')).toBeInTheDocument();
  });

  test('maneja clicks en las acciones', () => {
    render(<StatsGrid stats={mockStats} actions={mockActions} />);
    
    const firstAction = screen.getByText('Nuevo Paciente').closest('button');
    fireEvent.click(firstAction);
    
    expect(mockActions[0].onClick).toHaveBeenCalled();
  });

  test('aplica variantes correctas a las acciones', () => {
    render(<StatsGrid stats={mockStats} actions={mockActions} />);
    
    const actions = screen.getAllByTestId('quick-action');
    expect(actions[0].getAttribute('data-variant')).toBe('primary');
    expect(actions[1].getAttribute('data-variant')).toBe('secondary');
  });

  test('funciona sin estadísticas', () => {
    render(<StatsGrid stats={[]} />);
    
    const statCards = screen.queryAllByTestId('stat-card');
    expect(statCards).toHaveLength(0);
  });

  test('funciona sin acciones', () => {
    render(<StatsGrid stats={mockStats} actions={[]} />);
    
    const quickActions = screen.queryAllByTestId('quick-action');
    expect(quickActions).toHaveLength(0);
  });

  test('funciona sin estadísticas ni acciones', () => {
    render(<StatsGrid />);
    
    const statCards = screen.queryAllByTestId('stat-card');
    const quickActions = screen.queryAllByTestId('quick-action');
    
    expect(statCards).toHaveLength(0);
    expect(quickActions).toHaveLength(0);
  });

  test('renderiza solo estadísticas cuando no hay acciones', () => {
    render(<StatsGrid stats={mockStats} />);
    
    const statCards = screen.getAllByTestId('stat-card');
    const quickActions = screen.queryAllByTestId('quick-action');
    
    expect(statCards).toHaveLength(mockStats.length);
    expect(quickActions).toHaveLength(0);
  });

  test('renderiza solo acciones cuando no hay estadísticas', () => {
    render(<StatsGrid actions={mockActions} />);
    
    const statCards = screen.queryAllByTestId('stat-card');
    const quickActions = screen.getAllByTestId('quick-action');
    
    expect(statCards).toHaveLength(0);
    expect(quickActions).toHaveLength(mockActions.length);
  });

  test('maneja estadísticas con trend opcional', () => {
    const statsWithOptionalTrend = [
      {
        title: 'Con Trend',
        value: '100',
        icon: '📊',
        trend: '+10%'
      },
      {
        title: 'Sin Trend',
        value: '200',
        icon: '📈'
      }
    ];
    
    render(<StatsGrid stats={statsWithOptionalTrend} />);
    
    expect(screen.getByText('+10%')).toBeInTheDocument();
    expect(screen.queryByTestId('stat-trend')).toBeInTheDocument();
  });
}); 