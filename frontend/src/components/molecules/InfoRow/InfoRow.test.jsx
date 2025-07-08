import React from 'react';
import { render, screen } from '@testing-library/react';
import InfoRow from './InfoRow';

describe('InfoRow Component', () => {
  const testLabel = "Teléfono";
  const testValue = "600123456";

  test('renderiza label y value con sus clases correctas', () => {
    render(<InfoRow label={testLabel} value={testValue} />);

    const labelElement = screen.getByText(testLabel);
    expect(labelElement).toBeInTheDocument();
    expect(labelElement.tagName).toBe('SPAN');
    expect(labelElement).toHaveClass('label');

    const valueElement = screen.getByText(testValue);
    expect(valueElement).toBeInTheDocument();
    expect(valueElement.tagName).toBe('SPAN');
    expect(valueElement).toHaveClass('value');

    // Verificar el contenedor principal
    // eslint-disable-next-line testing-library/no-node-access
    expect(labelElement.closest('div')).toHaveClass('infoRow');
  });

  test('renderiza el icono cuando se proporciona y tiene la clase "icon"', () => {
    const iconMock = <span data-testid="mock-icon">📞</span>;
    render(<InfoRow label={testLabel} value={testValue} icon={iconMock} />);

    const renderedIcon = screen.getByTestId('mock-icon');
    expect(renderedIcon).toBeInTheDocument();
    // El icono está envuelto en un span con clase 'icon' por el componente InfoRow
    expect(renderedIcon.parentElement).toHaveClass('icon');
  });

  test('no renderiza el span del icono si no se proporciona icono', () => {
    render(<InfoRow label={testLabel} value={testValue} />);
    // eslint-disable-next-line testing-library/no-container
    const { container } = render(<InfoRow label={testLabel} value={testValue} />);
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.querySelector('span.icon')).not.toBeInTheDocument();
  });

  test('renderiza correctamente si label o value son vacíos o nulos', () => {
    const { rerender, container } = render(<InfoRow label="" value="" />);
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.querySelector('.label')).toHaveTextContent('');
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.querySelector('.value')).toHaveTextContent('');

    rerender(<InfoRow label={null} value={null} />);
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.querySelector('.label')).toHaveTextContent('');
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.querySelector('.value')).toHaveTextContent('');
  });

  test('aplica className, style y otras props al div contenedor principal', () => {
    const customClass = "mi-fila-info";
    const customStyle = { borderBottom: '1px solid #eee' };
    const { container } = render(
      <InfoRow
        label={testLabel}
        value={testValue}
        className={customClass}
        style={customStyle}
        data-info-id="info-contacto"
      />
    );
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass('infoRow', customClass);
    expect(mainContainer).toHaveStyle('border-bottom: 1px solid rgb(238, 238, 238);'); // JSDOM normaliza el color
    expect(mainContainer).toHaveAttribute('data-info-id', 'info-contacto');
  });
}); 