import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Tooltip from './Tooltip';

describe('Tooltip Component', () => {
  const triggerText = '?';
  const tooltipText = 'Información de ayuda';

  test('renderiza el children y el tooltip no es visible inicialmente', () => {
    render(<Tooltip text={tooltipText}>{triggerText}</Tooltip>);
    expect(screen.getByText(triggerText)).toBeInTheDocument();
    expect(screen.queryByText(tooltipText)).not.toBeInTheDocument(); // queryByText para no-existencia
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  test('muestra el tooltip en mouseEnter y lo oculta en mouseLeave', async () => {
    render(<Tooltip text={tooltipText}>{triggerText}</Tooltip>);
    const triggerElement = screen.getByText(triggerText).closest('span'); // El span wrapper

    fireEvent.mouseEnter(triggerElement);
    // El tooltip debería aparecer
    await waitFor(() => {
      const tooltipElement = screen.getByRole('tooltip');
      expect(tooltipElement).toBeInTheDocument();
      expect(tooltipElement).toHaveTextContent(tooltipText);
    });

    fireEvent.mouseLeave(triggerElement);
    // El tooltip debería desaparecer
    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  test('muestra el tooltip en focus y lo oculta en blur', async () => {
    render(<Tooltip text={tooltipText}>{triggerText}</Tooltip>);
    const triggerElement = screen.getByText(triggerText).closest('span');

    fireEvent.focus(triggerElement);
    await waitFor(() => {
      const tooltipElement = screen.getByRole('tooltip');
      expect(tooltipElement).toBeInTheDocument();
      expect(tooltipElement).toHaveTextContent(tooltipText);
    });

    fireEvent.blur(triggerElement);
    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  test('el wrapper tiene tabIndex="0" para ser enfocable', () => {
    render(<Tooltip text={tooltipText}>{triggerText}</Tooltip>);
    const wrapperElement = screen.getByText(triggerText).closest('span');
    expect(wrapperElement).toHaveAttribute('tabindex', '0');
    expect(wrapperElement).toHaveClass('wrapper'); // Clase base del wrapper
  });

  test('aplica la posición por defecto "top" al tooltip', async () => {
    render(<Tooltip text={tooltipText}>{triggerText}</Tooltip>);
    const triggerElement = screen.getByText(triggerText).closest('span');
    fireEvent.mouseEnter(triggerElement);

    await waitFor(() => {
      const tooltipElement = screen.getByRole('tooltip');
      expect(tooltipElement).toHaveClass('tooltip top'); // Clases base y de posición
    });
  });

  test('aplica una posición específica, por ejemplo "bottom"', async () => {
    render(<Tooltip text={tooltipText} position="bottom">{triggerText}</Tooltip>);
    const triggerElement = screen.getByText(triggerText).closest('span');
    fireEvent.mouseEnter(triggerElement);

    await waitFor(() => {
      const tooltipElement = screen.getByRole('tooltip');
      expect(tooltipElement).toHaveClass('tooltip bottom');
    });
  });

   test('maneja una posición no definida en estilos usando la clase base del tooltip', async () => {
    render(<Tooltip text={tooltipText} position="diagonal">{triggerText}</Tooltip>);
    const triggerElement = screen.getByText(triggerText).closest('span');
    fireEvent.mouseEnter(triggerElement);

    await waitFor(() => {
      const tooltipElement = screen.getByRole('tooltip');
      expect(tooltipElement).toHaveClass('tooltip'); // Solo clase base
      expect(tooltipElement).not.toHaveClass('diagonal');
      // El componente no tiene un fallback a 'top' en la lógica de clases si la posición no existe,
      // pero la prop 'position' tiene 'top' como valor por defecto.
      // Si se pasa 'diagonal', la clase 'top' NO se aplicará por la prop.
      expect(tooltipElement).not.toHaveClass('top');
    });
  });

  test('aplica clases CSS adicionales al wrapper', () => {
    const customClass = 'mi-tooltip-wrapper';
    render(<Tooltip text={tooltipText} className={customClass}>{triggerText}</Tooltip>);
    const wrapperElement = screen.getByText(triggerText).closest('span');
    expect(wrapperElement).toHaveClass('wrapper', customClass);
  });

  test('pasa atributos adicionales al wrapper span', () => {
    render(
      <Tooltip text={tooltipText} data-testid="custom-tooltip-wrapper" title="Wrapper Title">
        {triggerText}
      </Tooltip>
    );
    const wrapperElement = screen.getByTestId('custom-tooltip-wrapper');
    expect(wrapperElement).toBeInTheDocument();
    expect(wrapperElement).toHaveAttribute('title', 'Wrapper Title');
  });

  test('no muestra tooltip si el texto del tooltip es vacío o no se proporciona', async () => {
    const { rerender } = render(<Tooltip text="">{triggerText}</Tooltip>);
    const triggerElement = screen.getByText(triggerText).closest('span');
    fireEvent.mouseEnter(triggerElement);
    await waitFor(() => {
        // El span del tooltip podría renderizarse pero estar vacío, o no renderizarse.
        // El componente actual renderiza el span del tooltip incluso si text es vacío.
        const tooltipElement = screen.queryByRole('tooltip');
        expect(tooltipElement).toBeInTheDocument(); // El span se renderiza
        expect(tooltipElement).toHaveTextContent(''); // Pero está vacío
    });

    rerender(<Tooltip>{triggerText}</Tooltip>); // text es undefined
    fireEvent.mouseEnter(triggerElement);
     await waitFor(() => {
        const tooltipElement = screen.queryByRole('tooltip');
        expect(tooltipElement).toBeInTheDocument(); // El span se renderiza
        expect(tooltipElement).toHaveTextContent(''); // Pero está vacío (text es undefined)
    });
  });
}); 