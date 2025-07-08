import React from 'react';
import PropTypes from 'prop-types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import styles from './Charts.module.css';

const ResponsiveBarChart = ({ data, bars, xAxisKey, yAxisLabel, layout = 'horizontal', colors }) => {
  if (!data || data.length === 0) {
    return <section className={styles.noDataMessage}>No hay datos suficientes para mostrar el gráfico.</section>;
  }

  const defaultColors = [
    'var(--chart-color-1, #8884d8)',
    'var(--chart-color-2, #82ca9d)',
    'var(--chart-color-3, #ffc658)',
    'var(--chart-color-4, #ff8042)',
    'var(--chart-color-5, #0088FE)',
    'var(--chart-color-6, #00C49F)',
  ];
  const chartColors = colors || defaultColors;

  return (
    <section className={styles.chartWrapper}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          layout={layout}
          margin={{ top: 5, right: 20, left: layout === 'vertical' ? 5 : -20, bottom: 5 }} // Ajustar margen izquierdo para layout vertical
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color-light, #e0e0e0)" />
          {layout === 'horizontal' ? (
            <>
              <XAxis dataKey={xAxisKey} tick={{ fontSize: 10, fill: 'var(--text-tertiary, #757575)' }} stroke="var(--text-tertiary, #757575)" />
              <YAxis
                label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft', fill: 'var(--text-secondary, #5f5f5f)', fontSize: 12, dx: -10 } : null}
                tick={{ fontSize: 10, fill: 'var(--text-tertiary, #757575)' }}
                stroke="var(--text-tertiary, #757575)"
                allowDecimals={false}
              />
            </>
          ) : ( // Layout vertical (barras horizontales)
            <>
              <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--text-tertiary, #757575)' }} stroke="var(--text-tertiary, #757575)" allowDecimals={false} />
              <YAxis
                dataKey={xAxisKey}
                type="category"
                width={80} // Ajustar ancho para etiquetas largas
                tick={{ fontSize: 10, fill: 'var(--text-tertiary, #757575)' }}
                stroke="var(--text-tertiary, #757575)"
              />
            </>
          )}
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--surface-color, #ffffff)',
              borderColor: 'var(--border-color, #cccccc)',
              borderRadius: 'var(--border-radius-small, 4px)',
              fontSize: '12px'
            }}
            itemStyle={{ color: 'var(--text-primary, #212121)' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          {bars.map((bar, index) => (
            <Bar key={bar.dataKey} dataKey={bar.dataKey} name={bar.name || bar.dataKey} radius={layout === 'horizontal' ? [4, 4, 0, 0] : [0, 4, 4, 0]}>
              {/* Aplicar colores diferentes a cada barra si es un gráfico de una sola serie de barras */}
              {bars.length === 1 && data.map((entry, cellIndex) => (
                <Cell key={`cell-${cellIndex}`} fill={chartColors[cellIndex % chartColors.length]} />
              ))}
              {/* Si hay múltiples series de barras, Recharts asigna colores por Bar, aquí usamos el color del array 'colors' */}
              {bars.length > 1 && <Cell fill={chartColors[index % chartColors.length]} />}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
};

ResponsiveBarChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  bars: PropTypes.arrayOf(PropTypes.shape({
    dataKey: PropTypes.string.isRequired,
    name: PropTypes.string,
  })).isRequired,
  xAxisKey: PropTypes.string.isRequired,
  yAxisLabel: PropTypes.string,
  layout: PropTypes.oneOf(['horizontal', 'vertical']), // horizontal: barras verticales, vertical: barras horizontales
  colors: PropTypes.arrayOf(PropTypes.string),
};

export default ResponsiveBarChart;
