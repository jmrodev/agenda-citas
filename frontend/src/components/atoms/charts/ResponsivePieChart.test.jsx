import { render, screen } from '@testing-library/react';
import ResponsivePieChart from './ResponsivePieChart';

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
  { category: 'Electrónica', value: 400 },
  { category: 'Ropa', value: 300 },
  { category: 'Hogar', value: 200 },
];

describe('ResponsivePieChart', () => {
  test('renders no data message when data is empty', () => {
    render(<ResponsivePieChart data={[]} dataKey="value" nameKey="category" />);
    expect(screen.getByText('No hay datos suficientes para mostrar el gráfico.')).toBeInTheDocument();
  });

  test('renders no data message when data is null', () => {
    render(<ResponsivePieChart data={null} dataKey="value" nameKey="category" />);
    expect(screen.getByText('No hay datos suficientes para mostrar el gráfico.')).toBeInTheDocument();
  });

  test('renders chart with provided data', () => {
    const { container } = render(<ResponsivePieChart data={mockData} dataKey="value" nameKey="category" />);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument();

    // Comprobar la leyenda (debería mostrar los nombres de las categorías)
    expect(screen.getByText('Electrónica')).toBeInTheDocument();
    expect(screen.getByText('Ropa')).toBeInTheDocument();
    expect(screen.getByText('Hogar')).toBeInTheDocument();
  });

  test('renders with custom colors', () => {
    const customColors = ['#FF0000', '#00FF00', '#0000FF'];
    const { container } = render(<ResponsivePieChart data={mockData} dataKey="value" nameKey="category" colors={customColors} />);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument();
    // La verificación de colores exactos es compleja.
  });

  // El test para renderCustomizedLabel es más complejo porque implica interacciones internas de Recharts
  // y cómo se renderizan las etiquetas dentro del SVG.
  // Por ahora, nos enfocamos en la renderización general y la leyenda.
  // Si se descomenta la prop `label={renderCustomizedLabel}` en el componente,
  // se podrían añadir tests más específicos, aunque podrían ser frágiles.
});
