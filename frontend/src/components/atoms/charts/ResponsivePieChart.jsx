import React from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './Charts.module.css';

const ResponsivePieChart = ({ data, dataKey, nameKey, colors }) => {
  if (!data || data.length === 0) {
    return <div className={styles.noDataMessage}>No hay datos suficientes para mostrar el gráfico.</div>;
  }

  const defaultColors = [
    'var(--chart-color-1, #0088FE)',
    'var(--chart-color-2, #00C49F)',
    'var(--chart-color-3, #FFBB28)',
    'var(--chart-color-4, #FF8042)',
    'var(--chart-color-5, #8884d8)',
    'var(--chart-color-6, #82ca9d)',
    'var(--chart-color-7, #ffc658)',
    'var(--chart-color-8, #d0ed57)',
    'var(--chart-color-9, #a4de6c)',
    'var(--chart-color-10, #8dd1e1)',
  ];
  const chartColors = colors || defaultColors;

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Mostrar etiqueta solo si el porcentaje es suficientemente grande
    if ((percent * 100).toFixed(0) < 5) return null;


    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="10px">
        {`${name} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  return (
    <div className={styles.chartWrapper}>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            // label={renderCustomizedLabel} // Descomentar para etiquetas dentro del Pie
            outerRadius={80}
            fill="#8884d8"
            dataKey={dataKey}
            nameKey={nameKey}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--surface-color, #ffffff)',
              borderColor: 'var(--border-color, #cccccc)',
              borderRadius: 'var(--border-radius-small, 4px)',
              fontSize: '12px'
            }}
            itemStyle={{ color: 'var(--text-primary, #212121)' }}
            formatter={(value, name) => [`${value} (${(value / data.reduce((sum, item) => sum + item[dataKey], 0) * 100).toFixed(1)}%)`, name]}
          />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            wrapperStyle={{ fontSize: '12px', lineHeight: '20px' }}
            iconSize={10}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

ResponsivePieChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  dataKey: PropTypes.string.isRequired, // La clave para los valores numéricos
  nameKey: PropTypes.string.isRequired,  // La clave para los nombres de las secciones del pie
  colors: PropTypes.arrayOf(PropTypes.string),
};

export default ResponsivePieChart;
