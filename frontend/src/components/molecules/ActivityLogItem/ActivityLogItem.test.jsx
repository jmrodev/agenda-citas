import { render, screen } from '@testing-library/react';
import ActivityLogItem from './ActivityLogItem';

test('renderiza el elemento del log de actividad con todos sus datos', () => {
  const testProps = {
    time: "10:30 AM",
    secretary: "Laura Gómez",
    activityType: "Modificó Cita",
    detail: "Cambio de hora para paciente Carlos Ruiz"
  };
  render(<ActivityLogItem {...testProps} />);

  // Verificar usando data-testid y contenido
  const itemElement = screen.getByTestId('activity-log-item');
  expect(itemElement).toBeInTheDocument();

  const timeElement = screen.getByTestId('activity-time');
  expect(timeElement).toBeInTheDocument();
  expect(timeElement).toHaveTextContent(testProps.time);
  // También se puede usar getByText si el contenido es único y directo
  expect(screen.getByText(testProps.time)).toBeInTheDocument();


  const typeElement = screen.getByTestId('activity-type');
  expect(typeElement).toBeInTheDocument();
  expect(typeElement).toHaveTextContent(testProps.activityType);
  expect(screen.getByText(testProps.activityType)).toBeInTheDocument();

  const detailElement = screen.getByTestId('activity-detail');
  expect(detailElement).toBeInTheDocument();
  expect(detailElement).toHaveTextContent(testProps.detail);
  expect(screen.getByText(testProps.detail)).toBeInTheDocument();

  const secretaryElement = screen.getByTestId('activity-secretary');
  expect(secretaryElement).toBeInTheDocument();
  expect(secretaryElement).toHaveTextContent(testProps.secretary);
  expect(screen.getByText(testProps.secretary)).toBeInTheDocument();
}); 