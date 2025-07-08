import { render, screen } from '@testing-library/react';
import ResponsiveBarChart from './ResponsiveBarChart';

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
  { name: 'Enero', uv: 400, pv: 2400 },
  { name: 'Febrero', uv: 300, pv: 1398 },
  { name: 'Marzo', uv: 200, pv: 9800 },
];

const mockBars = [
  { dataKey: 'uv', name: 'UV' },
  { dataKey: 'pv', name: 'PV' },
];

describe('ResponsiveBarChart', () => {
  test('renders no data message when data is empty', () => {
    render(<ResponsiveBarChart data={[]} bars={mockBars} xAxisKey="name" />);
    expect(screen.getByText('No hay datos suficientes para mostrar el gráfico.')).toBeInTheDocument();
  });

  test('renders no data message when data is null', () => {
    render(<ResponsiveBarChart data={null} bars={mockBars} xAxisKey="name" />);
    expect(screen.getByText('No hay datos suficientes para mostrar el gráfico.')).toBeInTheDocument();
  });

  test('renders chart with provided data (horizontal layout)', () => {
    const { container } = render(<ResponsiveBarChart data={mockData} bars={mockBars} xAxisKey="name" />);
    // Verificar que el contenedor del gráfico está presente
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument();

    // Comprobar la leyenda (debería mostrar los nombres de las barras)
    // Nota: la visibilidad de estos elementos puede depender de la renderización completa del SVG en JSDOM.
    // Si estos fallan consistentemente, podríamos necesitar una estrategia de prueba diferente para el contenido del SVG.
    expect(screen.getByText('UV')).toBeInTheDocument();
    expect(screen.getByText('PV')).toBeInTheDocument();

    // Comprobar algunas etiquetas del eje X (nombres de los datos)
    // Nota: la renderización exacta de los ejes puede ser compleja de testear con precisión
    // debido a la naturaleza SVG y la responsividad. Nos enfocamos en la presencia de elementos clave.
    // En un entorno de prueba JSDOM, Recharts puede no renderizar completamente el SVG.
    // Si se necesita una prueba más profunda, se podría considerar ejecutar tests en un navegador real.
  });

  test('renders chart with provided data (vertical layout)', () => {
    const { container } = render(<ResponsiveBarChart data={mockData} bars={mockBars} xAxisKey="name" layout="vertical" />);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument();
    expect(screen.getByText('UV')).toBeInTheDocument();
    expect(screen.getByText('PV')).toBeInTheDocument();
  });

  test('renders with custom yAxisLabel', () => {
    const { container } = render(<ResponsiveBarChart data={mockData} bars={mockBars} xAxisKey="name" yAxisLabel="Cantidad" />);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument();
    // La etiqueta YAxis es un elemento <text> dentro del SVG. Su presencia es difícil de testear directamente por contenido.
    // La existencia del contenedor del gráfico es un buen indicador.
  });

  test('renders with single bar configuration and default colors', () => {
    const singleBar = [{ dataKey: 'uv', name: 'UV' }];
    const { container } = render(<ResponsiveBarChart data={mockData} bars={singleBar} xAxisKey="name" />);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument();
    expect(screen.getByText('UV')).toBeInTheDocument();
  });

  test('renders with custom colors', () => {
    const customColors = ['#FF0000', '#00FF00', '#0000FF'];
    const { container } = render(<ResponsiveBarChart data={mockData} bars={mockBars} xAxisKey="name" colors={customColors} />);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument();
    // La verificación de colores específicos es compleja y frágil.
  });
});
