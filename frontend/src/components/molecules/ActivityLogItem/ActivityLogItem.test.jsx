import { render, screen } from '@testing-library/react';
import ActivityLogItem from './ActivityLogItem';

describe('ActivityLogItem Component', () => {
  const testProps = {
    time: "10:30 AM",
    secretary: "Laura Gómez",
    activityType: "Modificó Cita",
    detail: "Cambio de hora para paciente Carlos Ruiz"
  };

  test('renderiza el elemento del log de actividad con todos sus datos y clases CSS correctas', () => {
    render(<ActivityLogItem {...testProps} />);

    const itemElement = screen.getByTestId('activity-log-item');
    expect(itemElement).toBeInTheDocument();
    expect(itemElement).toHaveClass('item'); // Clase base del módulo CSS

    const timeElement = screen.getByTestId('activity-time');
    expect(timeElement).toBeInTheDocument();
    expect(timeElement).toHaveTextContent(testProps.time);
    expect(timeElement).toHaveClass('time');
    // También se puede usar getByText si el contenido es único y directo
    // expect(screen.getByText(testProps.time)).toBeInTheDocument(); // Ya cubierto por getByTestId y toHaveTextContent

    // Verificar el contenedor 'info'
    // eslint-disable-next-line testing-library/no-node-access
    const infoElement = timeElement.nextElementSibling; // Asumiendo que 'info' es el siguiente hermano de 'time'
    expect(infoElement).toHaveClass('info');

    const typeElement = screen.getByTestId('activity-type');
    expect(typeElement).toBeInTheDocument();
    expect(typeElement).toHaveTextContent(testProps.activityType);
    expect(typeElement).toHaveClass('activityType');
    // expect(screen.getByText(testProps.activityType)).toBeInTheDocument();

    const detailElement = screen.getByTestId('activity-detail');
    expect(detailElement).toBeInTheDocument();
    expect(detailElement).toHaveTextContent(testProps.detail);
    expect(detailElement).toHaveClass('detail');
    // expect(screen.getByText(testProps.detail)).toBeInTheDocument();

    const secretaryElement = screen.getByTestId('activity-secretary');
    expect(secretaryElement).toBeInTheDocument();
    expect(secretaryElement).toHaveTextContent(testProps.secretary);
    expect(secretaryElement).toHaveClass('secretary');
    // expect(screen.getByText(testProps.secretary)).toBeInTheDocument();
  });

  test('renderiza correctamente si alguna prop de texto está vacía', () => {
    const emptyProps = {
      time: "11:00 AM",
      secretary: "", // Secretaria vacía
      activityType: "Creó Usuario",
      detail: "" // Detalle vacío
    };
    render(<ActivityLogItem {...emptyProps} />);

    expect(screen.getByTestId('activity-time')).toHaveTextContent(emptyProps.time);
    expect(screen.getByTestId('activity-secretary')).toHaveTextContent('');
    expect(screen.getByTestId('activity-type')).toHaveTextContent(emptyProps.activityType);
    expect(screen.getByTestId('activity-detail')).toHaveTextContent('');
  });

  // Este componente no toma className ni ...rest, por lo que no se testean.
}); 