import { render, screen } from '@testing-library/react';
import CalendarIcon from './CalendarIcon';

describe('CalendarIcon', () => {
  test('renderiza el icono del calendario con un data-testid personalizado', () => {
    render(<CalendarIcon data-testid="my-calendar-icon" />);
    const iconElement = screen.getByTestId('my-calendar-icon');
    expect(iconElement).toBeInTheDocument();
    // Check if it contains an SVG element as Icon component renders an SVG
    // eslint-disable-next-line testing-library/no-node-access
    expect(iconElement.querySelector('svg')).toBeInTheDocument();
  });

  test('renderiza el icono del calendario con el data-testid por defecto generado por Icon', () => {
    render(<CalendarIcon />);
    // The Icon component (used by CalendarIcon) generates data-testid="icon-calendar"
    // if no data-testid is passed to CalendarIcon.
    const iconElement = screen.getByTestId('icon-calendar');
    expect(iconElement).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-node-access
    expect(iconElement.querySelector('svg')).toBeInTheDocument();
  });

  test('acepta y aplica props adicionales como className y size', () => {
    const testSize = 32;
    render(
      <CalendarIcon
        className="custom-calendar-icon-class"
        size={testSize}
        data-testid="styled-calendar-icon"
      />
    );
    const iconElement = screen.getByTestId('styled-calendar-icon');
    expect(iconElement).toHaveClass('custom-calendar-icon-class');
    // The Icon component applies size to its style
    expect(iconElement).toHaveStyle(`width: ${testSize}px`);
    expect(iconElement).toHaveStyle(`height: ${testSize}px`);
  });
}); 