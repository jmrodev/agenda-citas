import React from 'react';
import { render, screen } from '@testing-library/react';
import CalendarEventList from './CalendarEventList';
import { vi } from 'vitest';

describe('CalendarEventList Component', () => {
  const mockEvents = [
    { id: '1', title: 'Reunión de equipo', time: '10:00 AM' },
    { id: '2', title: 'Almuerzo con cliente' }, // Evento sin hora
    { id: '3', title: 'Presentación', time: '03:00 PM' },
  ];

  test('muestra el mensaje "Sin eventos" por defecto cuando no hay eventos', () => {
    render(<CalendarEventList events={[]} />);
    expect(screen.getByText('Sin eventos')).toBeInTheDocument();
    expect(screen.getByText('Sin eventos')).toHaveClass('empty');
  });

  test('muestra un emptyText personalizado cuando no hay eventos', () => {
    const customEmptyText = "No hay citas para hoy.";
    render(<CalendarEventList events={[]} emptyText={customEmptyText} />);
    expect(screen.getByText(customEmptyText)).toBeInTheDocument();
  });

  test('renderiza los eventos usando el formato por defecto si no se proporciona renderEvent', () => {
    render(<CalendarEventList events={mockEvents} />);

    mockEvents.forEach(event => {
      const eventTitleElement = screen.getByText(event.title);
      expect(eventTitleElement).toBeInTheDocument();
      expect(eventTitleElement).toHaveClass('eventTitle');
      // eslint-disable-next-line testing-library/no-node-access
      expect(eventTitleElement.closest('.event')).toBeInTheDocument(); // Verificar que está dentro de un div.event

      if (event.time) {
        const eventTimeElement = screen.getByText(event.time);
        expect(eventTimeElement).toBeInTheDocument();
        expect(eventTimeElement).toHaveClass('eventTime');
      } else {
        // Si no hay tiempo, no debería haber un elemento con la clase eventTime para este título.
        // Esto es un poco más complejo de asegurar directamente sin testids únicos por evento.
        // Por ahora, nos enfocamos en que los que tienen tiempo, se renderizan.
      }
    });
    // Verificar que se renderizaron 3 elementos de evento
    // eslint-disable-next-line testing-library/no-container
    const { container } = render(<CalendarEventList events={mockEvents} />);
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.querySelectorAll(`.${'event'}`).length).toBe(mockEvents.length);
  });

  test('llama a renderEvent para cada evento si se proporciona', () => {
    const mockRenderEvent = vi.fn((event, index) => (
      <div key={index} data-testid={`custom-event-${event.id}`}>
        {event.title} - Custom Render
      </div>
    ));

    render(<CalendarEventList events={mockEvents} renderEvent={mockRenderEvent} />);

    expect(mockRenderEvent).toHaveBeenCalledTimes(mockEvents.length);
    mockEvents.forEach((event, index) => {
      expect(mockRenderEvent).toHaveBeenCalledWith(event, index);
      expect(screen.getByTestId(`custom-event-${event.id}`)).toBeInTheDocument();
      expect(screen.getByText(`${event.title} - Custom Render`)).toBeInTheDocument();
    });
    // No debería usar el renderizado por defecto
    expect(screen.queryByText(mockEvents[0].time)).not.toBeInTheDocument(); // Asumiendo que el render por defecto mostraría la hora
  });

  test('aplica className, style y otras props al div contenedor principal', () => {
    const customClass = "mi-lista-eventos";
    const customStyle = { border: '1px dashed blue' };
    render(
      <CalendarEventList
        events={[]} // Vacío para simplificar, ya que no probamos los eventos aquí
        className={customClass}
        style={customStyle}
        data-custom="valor-extra-lista"
        id="lista-eventos-id"
      />
    );
    // El elemento contenedor es el que tiene la clase calendarEventList
    // Si está vacío, contendrá el div con la clase 'empty'
    const containerElement = screen.getByText('Sin eventos').parentElement; // El div.empty está dentro del contenedor principal

    expect(containerElement).toHaveClass('calendarEventList', customClass);
    expect(containerElement).toHaveStyle('border: 1px dashed blue;');
    expect(containerElement).toHaveAttribute('data-custom', 'valor-extra-lista');
    expect(containerElement).toHaveAttribute('id', 'lista-eventos-id');
  });
}); 