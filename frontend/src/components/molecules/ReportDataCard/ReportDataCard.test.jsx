import { render, screen } from '@testing-library/react';
import ReportDataCard from './ReportDataCard';

test('renderiza el título y valor de la tarjeta de reporte', () => {
  render(<ReportDataCard title="Total Pacientes" value="150" />);
  expect(screen.getByText('Total Pacientes')).toBeInTheDocument();
  expect(screen.getByText('150')).toBeInTheDocument();
}); 