import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import CalendarDayInfo from './CalendarDayInfo';

// Mockear CalendarDot para facilitar la prueba de su existencia condicional
vi.mock('../../atoms/CalendarDot/CalendarDot', () => ({
  default: ({ className }) => <span data-testid="mock-calendar-dot" className={className} />,
}));


describe('CalendarDayInfo Component', () => {
  const mockOnClick = vi.fn();
  const defaultProps = {
    day: 15,
    onClick: mockOnClick,
  };

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  test('renderiza el CalendarDay con el día y maneja el click', () => {
    render(<CalendarDayInfo {...defaultProps} />);
    const dayButton = screen.getByRole('button', { name: defaultProps.day.toString() });
    expect(dayButton).toBeInTheDocument();
    fireEvent.click(dayButton);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('renderiza Badge y Chip cuando se proporcionan las props', () => {
    const badgeText = 'N';
    const chipText = 'Festivo';
    render(<CalendarDayInfo {...defaultProps} badge={badgeText} chip={chipText} />);

    const badgeElement = screen.getByText(badgeText);
    expect(badgeElement).toBeInTheDocument();
    expect(badgeElement).toHaveClass('badge'); // Clase del componente Badge (asumiendo que la tiene)

    const chipElement = screen.getByText(chipText);
    expect(chipElement).toBeInTheDocument();
    expect(chipElement).toHaveClass('chip'); // Clase del componente Chip (asumiendo que la tiene)
  });

  test('no renderiza Badge ni Chip si no se proporcionan sus props', () => {
    render(<CalendarDayInfo {...defaultProps} />);
    expect(screen.queryByText(/.+/)).not.toHaveClass('badge'); // No debería haber ningún elemento con clase badge
    expect(screen.queryByText(/.+/)).not.toHaveClass('chip');  // No debería haber ningún elemento con clase chip
    // Una forma más específica sería query por un texto que sabes que no estará si no hay badge/chip
    expect(screen.queryByTestId('mock-badge')).not.toBeInTheDocument(); // Si Badge tuviera un testid
    expect(screen.queryByTestId('mock-chip')).not.toBeInTheDocument();  // Si Chip tuviera un testid
  });

  test('renderiza CalendarDot cuando hasEvent es true y aplica clase "dot"', () => {
    render(<CalendarDayInfo {...defaultProps} hasEvent={true} />);
    const dotElement = screen.getByTestId('mock-calendar-dot');
    expect(dotElement).toBeInTheDocument();
    expect(dotElement).toHaveClass('dot'); // Clase aplicada por CalendarDayInfo al CalendarDot
  });

  test('no renderiza CalendarDot cuando hasEvent es false', () => {
    render(<CalendarDayInfo {...defaultProps} hasEvent={false} />);
    expect(screen.queryByTestId('mock-calendar-dot')).not.toBeInTheDocument();
  });

  test('pasa props isToday, isSelected, isDisabled a CalendarDay', () => {
    render(
      <CalendarDayInfo
        {...defaultProps}
        isToday={true}
        isSelected={true}
        isDisabled={true}
      />
    );
    const dayButton = screen.getByRole('button', { name: defaultProps.day.toString() });
    // CalendarDay aplica clases basadas en estas props.
    // Asumimos que CalendarDay.test.jsx ya verifica esto a fondo.
    // Aquí solo verificamos que las clases esperadas (si se conocen) se aplican.
    expect(dayButton).toHaveClass('today');   // Clase aplicada por CalendarDay
    expect(dayButton).toHaveClass('selected'); // Clase aplicada por CalendarDay
    expect(dayButton).toBeDisabled();        // Atributo aplicado por CalendarDay
  });

  test('aplica className, style y otras props al div contenedor principal', () => {
    const customClass = "mi-dia-info";
    const customStyle = { border: '1px solid red' };
    render(
      <CalendarDayInfo
        {...defaultProps}
        className={customClass}
        style={customStyle}
        data-custom="valor-extra"
      />
    );
    // El elemento que contiene todo, incluyendo el botón del día
    const dayButton = screen.getByRole('button', { name: defaultProps.day.toString() });
    // eslint-disable-next-line testing-library/no-node-access
    const mainContainer = dayButton.closest(`.${'calendarDayInfo'}`);

    expect(mainContainer).toHaveClass('calendarDayInfo', customClass);
    expect(mainContainer).toHaveStyle('border: 1px solid red');
    expect(mainContainer).toHaveAttribute('data-custom', 'valor-extra');
  });

  test('el div wrapper principal y el dayWrapper tienen sus clases CSS', () => {
    render(<CalendarDayInfo {...defaultProps} />);
    const dayButton = screen.getByRole('button', { name: defaultProps.day.toString() });
    // eslint-disable-next-line testing-library/no-node-access
    const mainContainer = dayButton.closest('div[class*="calendarDayInfo"]');
    expect(mainContainer).toHaveClass('calendarDayInfo');
    // eslint-disable-next-line testing-library/no-node-access
    const dayWrapper = dayButton.parentElement; // Asumiendo que CalendarDay está directamente en dayWrapper
    expect(dayWrapper).toHaveClass('dayWrapper');
  });
}); 