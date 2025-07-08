import { render, screen } from '@testing-library/react';
import ReportSection from './ReportSection';

test('renderiza el título y contenido de la sección de reporte', () => {
  render(
    <ReportSection title="Pacientes" isLoading={false} error={null}>
      <div>Contenido del reporte</div>
    </ReportSection>
  );
  expect(screen.getByText('Pacientes')).toBeInTheDocument();
  expect(screen.getByText('Contenido del reporte')).toBeInTheDocument();
}); 