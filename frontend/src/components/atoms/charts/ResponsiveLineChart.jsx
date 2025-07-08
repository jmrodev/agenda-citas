import React from 'react';
import PropTypes from 'prop-types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './Charts.module.css'; // Un CSS común para los gráficos

const ResponsiveLineChart = ({ data, lines, xAxisKey, yAxisLabel, colors }) => {
  if (!data || data.length === 0) {
    return <div className={styles.noDataMessage}>No hay datos suficientes para mostrar el gráfico.</div>;
  }

  return (
    <div className={styles.chartWrapper}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}> {/* Ajuste de márgenes */}
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color-light, #e0e0e0)" />
          <XAxis
            dataKey={xAxisKey}
            tick={{ fontSize: 10, fill: 'var(--text-tertiary, #757575)' }}
            stroke="var(--text-tertiary, #757575)"
          />
          <YAxis
            label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft', fill: 'var(--text-secondary, #5f5f5f)', fontSize: 12, dx: -10 } : null}
            tick={{ fontSize: 10, fill: 'var(--text-tertiary, #757575)' }}
            stroke="var(--text-tertiary, #757575)"
            allowDecimals={false} // Evitar decimales en el eje Y si son conteos
          />
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
          {lines.map((line, index) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name || line.dataKey}
              stroke={colors?.[index % colors.length] || `var(--chart-color-${index + 1}, #8884d8)`} // Usar colores del array o variables CSS
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

ResponsiveLineChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  lines: PropTypes.arrayOf(PropTypes.shape({
    dataKey: PropTypes.string.isRequired,
    name: PropTypes.string, // Nombre para la leyenda
  })).isRequired,
  xAxisKey: PropTypes.string.isRequired,
  yAxisLabel: PropTypes.string,
  colors: PropTypes.arrayOf(PropTypes.string), // Array de colores para las líneas
};

export default ResponsiveLineChart;
