import React from 'react';
import { render, screen } from '@testing-library/react';
import ReportDataCard from './ReportDataCard';
import { vi } from 'vitest';

// Mockear los átomos
vi.mock('../../atoms/CardBase/CardBase', () => ({
  default: vi.fn(({ children, className, style }) => (
    <div data-testid="mock-cardbase" className={className} style={style}>{children}</div>
  )),
}));
vi.mock('../../atoms/Text/Text', () => ({
  default: vi.fn(({ children, type, className }) => ( // Cambiado 'as' por 'type' según uso en ReportDataCard
    <span data-testid={`mock-text-${type}`} className={className}>{children}</span>
  )),
}));
vi.mock('../../atoms/Icon/Icon', () => ({
  default: vi.fn(({ name, size }) => <span data-testid={`mock-icon-${name}`} data-size={size}>{name}</span>),
}));


describe('ReportDataCard Component', () => {
  const defaultTitle = "Ingresos Totales";
  const defaultValue = "€1,250.75";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renderiza CardBase, título y valor con clases y props correctas', () => {
    render(<ReportDataCard title={defaultTitle} value={defaultValue} />);

    const CardBaseMock = require('../../atoms/CardBase/CardBase').default;
    expect(CardBaseMock).toHaveBeenCalledTimes(1);
    expect(CardBaseMock).toHaveBeenCalledWith(
      expect.objectContaining({ className: expect.stringContaining('reportDataCard') }), {}
    );
    expect(screen.getByTestId('mock-cardbase')).toBeInTheDocument();

    const TextMock = require('../../atoms/Text/Text').default;
    // Título
    expect(TextMock).toHaveBeenCalledWith(
      expect.objectContaining({ children: defaultTitle, type: 'label', className: 'title' }), {}
    );
    expect(screen.getByTestId('mock-text-label')).toHaveTextContent(defaultTitle);
    // Valor
    expect(TextMock).toHaveBeenCalledWith(
      expect.objectContaining({ children: expect.anything(), type: 'display', className: 'value' }), {}
    );
    const valueTextElement = screen.getByTestId('mock-text-display');
    expect(valueTextElement).toHaveTextContent(defaultValue); // El valor principal

    // Verificar estructura interna de clases
    // eslint-disable-next-line testing-library/no-container
    const { container } = render(<ReportDataCard title={defaultTitle} value={defaultValue} />);
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.querySelector('.textContainer')).toBeInTheDocument();
  });

  test('renderiza icono principal si se proporciona (como string o nodo)', () => {
    const IconMock = require('../../atoms/Icon/Icon').default;

    // Como string (nombre del icono)
    render(<ReportDataCard title="Usuarios" value="300" icon="user" />);
    expect(IconMock).toHaveBeenCalledWith(expect.objectContaining({ name: 'user' }), {});
    expect(screen.getByTestId('mock-icon-user')).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-container
    expect(render(<ReportDataCard title="Usuarios" value="300" icon="user" />).container.querySelector('.iconWrapper')).toBeInTheDocument();
    IconMock.mockClear();

    // Como nodo React
    const customIconNode = <span data-testid="custom-svg-icon">ICON_NODE</span>;
    render(<ReportDataCard title="Alertas" value="5" icon={customIconNode} />);
    expect(IconMock).not.toHaveBeenCalled(); // No debería llamar al Icon atom si se pasa un nodo
    expect(screen.getByTestId('custom-svg-icon')).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-container
    expect(render(<ReportDataCard title="Alertas" value="5" icon={customIconNode} />).container.querySelector('.iconWrapper')).toBeInTheDocument();
  });

  test('no renderiza icono principal si no se proporciona', () => {
    render(<ReportDataCard title="Sin Icono" value="10" />);
    expect(require('../../atoms/Icon/Icon').default).not.toHaveBeenCalled();
    // eslint-disable-next-line testing-library/no-container
    const { container } = render(<ReportDataCard title="Sin Icono" value="10" />);
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.querySelector('.iconWrapper')).not.toBeInTheDocument();
  });

  test('renderiza unidad junto al valor si se proporciona', () => {
    render(<ReportDataCard title="Temperatura" value="25" unit="°C" />);
    const valueTextElement = screen.getByTestId('mock-text-display'); // El Text mock para el valor
    // El valor y la unidad están dentro del mismo Text mock
    expect(valueTextElement).toHaveTextContent("25");
    // El span de la unidad está DENTRO del Text mockeado.
    // Para verificarlo, el mock de Text tendría que manejar children de forma más compleja o buscar por texto.
    // Por ahora, verificamos que el valor está y podemos asumir que el span.unit se renderiza junto a él.
    // Si el mock de Text renderizara children como array, podríamos hacer:
    // expect(valueTextElement).toHaveTextContent("25");
    // expect(within(valueTextElement).getByText("°C")).toHaveClass('unit');
    // Con el mock actual, el span.unit es un hijo del mock-text-display, no texto directo.
    // Necesitamos acceder al DOM real renderizado por el componente, no por el mock.
    const { container } = render(<ReportDataCard title="Temperatura" value="25" unit="°C" />);
    // eslint-disable-next-line testing-library/no-node-access
    const unitSpan = container.querySelector('.value > .unit');
    expect(unitSpan).toBeInTheDocument();
    expect(unitSpan).toHaveTextContent('°C');
  });

  test('renderiza información de tendencia (trend) si se proporciona', () => {
    const trendText = "+5% vs ayer";
    render(<ReportDataCard title="Vistas" value="1000" trend={trendText} trendDirection="up" />);

    // eslint-disable-next-line testing-library/no-container
    const { container } = render(<ReportDataCard title="Vistas" value="1000" trend={trendText} trendDirection="up" />);
    // eslint-disable-next-line testing-library/no-node-access
    const trendInfoDiv = container.querySelector('.trendInfo');
    expect(trendInfoDiv).toBeInTheDocument();
    expect(trendInfoDiv).toHaveClass('up');

    // Icono de tendencia
    const IconMock = require('../../atoms/Icon/Icon').default;
    expect(IconMock).toHaveBeenCalledWith(expect.objectContaining({ name: 'arrow_upward', size: 'small' }), {});
    expect(screen.getByTestId('mock-icon-arrow_upward')).toBeInTheDocument();

    // Texto de tendencia
    const TextMock = require('../../atoms/Text/Text').default;
    expect(TextMock).toHaveBeenCalledWith(expect.objectContaining({ children: trendText, type: 'caption', className: 'trendText' }), {});
    // El getByTestId para el texto de la tendencia necesita que el mock de Text use 'type' en su testid
    expect(screen.getByTestId('mock-text-caption')).toHaveTextContent(trendText);
  });

  test('renderiza icono de tendencia "arrow_downward" para trendDirection "down"', () => {
    render(<ReportDataCard title="Rebote" value="10%" trend="-2%" trendDirection="down" />);
    expect(screen.getByTestId('mock-icon-arrow_downward')).toBeInTheDocument();
  });

  test('no renderiza icono de tendencia para trendDirection "neutral" o no existente', () => {
    const IconMock = require('../../atoms/Icon/Icon').default;
    render(<ReportDataCard title="Estable" value="50" trend="sin cambios" trendDirection="neutral" />);
    // Ningún icono de flecha debería ser llamado
    expect(IconMock).not.toHaveBeenCalledWith(expect.objectContaining({ name: 'arrow_upward' }), {});
    expect(IconMock).not.toHaveBeenCalledWith(expect.objectContaining({ name: 'arrow_downward' }), {});
    // El span del icono de tendencia no debería existir si trendIcon() devuelve null
    const { container } = render(<ReportDataCard title="Estable" value="50" trend="sin cambios" trendDirection="neutral" />);
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.querySelector('.trendInfo > span[data-testid^="mock-icon-"]')).not.toBeInTheDocument();
  });

  test('no renderiza sección de tendencia si trend no se proporciona', () => {
    render(<ReportDataCard title="Datos" value="123" />);
    // eslint-disable-next-line testing-library/no-container
    const { container } = render(<ReportDataCard title="Datos" value="123" />);
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.querySelector('.trendInfo')).not.toBeInTheDocument();
  });

  test('aplica cardStyle como clase al CardBase', () => {
    const cardStyle = "warning";
    render(<ReportDataCard title="Alerta" value="High" cardStyle={cardStyle} />);

    const CardBaseMock = require('../../atoms/CardBase/CardBase').default;
    expect(CardBaseMock).toHaveBeenCalledWith(
      expect.objectContaining({ className: expect.stringContaining(`reportDataCard ${cardStyle}`) }), {}
    );
    // El mock de CardBase ya incluye la clase, así que podemos verificarlo en el elemento mockeado
    expect(screen.getByTestId('mock-cardbase')).toHaveClass('reportDataCard', cardStyle);
  });
}); 