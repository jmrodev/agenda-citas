import React from 'react';
import { render, screen } from '@testing-library/react';
import ReportSection from './ReportSection';
import { vi } from 'vitest';

// Mockear los átomos
vi.mock('../../atoms/CardBase/CardBase', () => ({
  default: vi.fn(({ children, className }) => <div data-testid="mock-cardbase" className={className}>{children}</div>),
}));
vi.mock('../../atoms/Title/Title', () => ({
  default: vi.fn(({ children, level, className }) => <h3 data-testid="mock-title" data-level={level} className={className}>{children}</h3>),
}));

describe('ReportSection Component', () => {
  const testTitle = "Resumen de Actividad";
  const childrenContent = <p data-testid="report-content">Datos importantes aquí.</p>;
  const defaultEmptyMessage = "No hay datos para mostrar en esta sección.";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renderiza CardBase, Title con título y children por defecto', () => {
    render(<ReportSection title={testTitle}>{childrenContent}</ReportSection>);

    const CardBaseMock = require('../../atoms/CardBase/CardBase').default;
    expect(CardBaseMock).toHaveBeenCalledTimes(1);
    expect(CardBaseMock).toHaveBeenCalledWith(
      expect.objectContaining({ className: expect.stringContaining('reportSectionCard') }), {}
    );
    expect(screen.getByTestId('mock-cardbase')).toBeInTheDocument();

    const TitleMock = require('../../atoms/Title/Title').default;
    expect(TitleMock).toHaveBeenCalledTimes(1);
    expect(TitleMock).toHaveBeenCalledWith(
      expect.objectContaining({ children: testTitle, level: 3, className: 'title' }), {}
    );
    expect(screen.getByTestId('mock-title')).toHaveTextContent(testTitle);

    expect(screen.getByTestId('report-content')).toBeInTheDocument();

    // Verificar clases de estructura
    // eslint-disable-next-line testing-library/no-container
    const { container } = render(<ReportSection title={testTitle}>{childrenContent}</ReportSection>);
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.querySelector('header.header')).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.querySelector('div.content')).toBeInTheDocument();
  });

  test('muestra estado de carga cuando isLoading es true', () => {
    render(<ReportSection title={testTitle} isLoading={true}>{childrenContent}</ReportSection>);

    expect(screen.getByText('Cargando datos de la sección...')).toBeInTheDocument();
    expect(screen.getByText('Cargando datos de la sección...')).toHaveClass('loading');
    expect(screen.queryByTestId('report-content')).not.toBeInTheDocument();
    expect(screen.queryByText(/Error al cargar/)).not.toBeInTheDocument();
    expect(screen.queryByText(defaultEmptyMessage)).not.toBeInTheDocument();
  });

  test('muestra mensaje de error cuando error se proporciona', () => {
    const errorMessage = "Fallo de conexión";
    render(<ReportSection title={testTitle} error={errorMessage}>{childrenContent}</ReportSection>);

    expect(screen.getByText(`Error al cargar: ${errorMessage}`)).toBeInTheDocument();
    expect(screen.getByText(`Error al cargar: ${errorMessage}`)).toHaveClass('error');
    expect(screen.queryByTestId('report-content')).not.toBeInTheDocument();
    expect(screen.queryByText('Cargando datos de la sección...')).not.toBeInTheDocument();
    expect(screen.queryByText(defaultEmptyMessage)).not.toBeInTheDocument();
  });

  test('muestra mensaje de error usando error.message si error es un objeto', () => {
    const errorObject = { message: "Error de objeto" };
    render(<ReportSection title={testTitle} error={errorObject}>{childrenContent}</ReportSection>);
    expect(screen.getByText(`Error al cargar: ${errorObject.message}`)).toBeInTheDocument();
  });

  test('muestra mensaje de vacío (emptyMessage) cuando isEmpty es true (y no loading/error)', () => {
    render(<ReportSection title={testTitle} isEmpty={true}>{childrenContent}</ReportSection>);

    expect(screen.getByText(defaultEmptyMessage)).toBeInTheDocument();
    expect(screen.getByText(defaultEmptyMessage)).toHaveClass('emptyMessage');
    expect(screen.queryByTestId('report-content')).not.toBeInTheDocument();
    expect(screen.queryByText('Cargando datos de la sección...')).not.toBeInTheDocument();
    expect(screen.queryByText(/Error al cargar/)).not.toBeInTheDocument();
  });

  test('muestra emptyMessage personalizado cuando isEmpty es true', () => {
    const customEmpty = "No hay nada aquí.";
    render(<ReportSection title={testTitle} isEmpty={true} emptyMessage={customEmpty}>{childrenContent}</ReportSection>);
    expect(screen.getByText(customEmpty)).toBeInTheDocument();
  });

  test('prioriza isLoading sobre error y isEmpty', () => {
    render(<ReportSection title={testTitle} isLoading={true} error="Un error" isEmpty={true}>{childrenContent}</ReportSection>);
    expect(screen.getByText('Cargando datos de la sección...')).toBeInTheDocument();
    expect(screen.queryByText(/Error al cargar/)).not.toBeInTheDocument();
    expect(screen.queryByText(defaultEmptyMessage)).not.toBeInTheDocument();
    expect(screen.queryByTestId('report-content')).not.toBeInTheDocument();
  });

  test('prioriza error sobre isEmpty (cuando no isLoading)', () => {
    render(<ReportSection title={testTitle} isLoading={false} error="Un error" isEmpty={true}>{childrenContent}</ReportSection>);
    expect(screen.getByText(/Error al cargar: Un error/)).toBeInTheDocument();
    expect(screen.queryByText('Cargando datos de la sección...')).not.toBeInTheDocument();
    expect(screen.queryByText(defaultEmptyMessage)).not.toBeInTheDocument();
    expect(screen.queryByTestId('report-content')).not.toBeInTheDocument();
  });

  // El componente ReportSection no pasa className, style, ni ...rest a su CardBase raíz.
  // CardBase sí los acepta, pero ReportSection tendría que ser modificado para pasarlos.
}); 