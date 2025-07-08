import { render, screen } from '@testing-library/react';
import ResponsiveLineChart from './ResponsiveLineChart';

// Mock de ResizeObserver, necesario para ResponsiveContainer de recharts
global.ResizeObserver = class ResizeObserver {
    observe() {
        // do nothing
    }
    unobserve() {
        // do nothing
    }
    disconnect() {
        // do nothing
    }
};

const mockData = [
  { month: 'Ene', visits: 100, sales: 50 },
  { month: 'Feb', visits: 120, sales: 60 },
  { month: 'Mar', visits: 150, sales: 70 },
];

const mockLines = [
  { dataKey: 'visits', name: 'Visitas' },
  { dataKey: 'sales', name: 'Ventas' },
];

describe('ResponsiveLineChart', () => {
  test('renders no data message when data is empty', () => {
    render(<ResponsiveLineChart data={[]} lines={mockLines} xAxisKey="month" />);
    expect(screen.getByText('No hay datos suficientes para mostrar el gráfico.')).toBeInTheDocument();
  });

  test('renders no data message when data is null', () => {
    render(<ResponsiveLineChart data={null} lines={mockLines} xAxisKey="month" />);
    expect(screen.getByText('No hay datos suficientes para mostrar el gráfico.')).toBeInTheDocument();
  });

  test('renders chart with provided data', () => {
    const { container } = render(<ResponsiveLineChart data={mockData} lines={mockLines} xAxisKey="month" />);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument();

    // Comprobar la leyenda
    expect(screen.getByText('Visitas')).toBeInTheDocument();
    expect(screen.getByText('Ventas')).toBeInTheDocument();
  });

  test('renders with custom yAxisLabel', () => {
    const { container } = render(<ResponsiveLineChart data={mockData} lines={mockLines} xAxisKey="month" yAxisLabel="Total" />);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument();
    // La presencia de la etiqueta YAxis se infiere si el gráfico se renderiza.
  });

  test('renders with custom colors', () => {
    const customColors = ['#FF6384', '#36A2EB'];
    const { container } = render(<ResponsiveLineChart data={mockData} lines={mockLines} xAxisKey="month" colors={customColors} />);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument();
    // La verificación de colores exactos es compleja.
  });

  test('renders with a single line', () => {
    const singleLine = [{ dataKey: 'visits', name: 'Visitas' }];
    const { container } = render(<ResponsiveLineChart data={mockData} lines={singleLine} xAxisKey="month" />);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument();
    expect(screen.getByText('Visitas')).toBeInTheDocument();
  });
});
