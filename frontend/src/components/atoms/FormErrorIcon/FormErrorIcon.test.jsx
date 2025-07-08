import { render, screen } from '@testing-library/react';
import FormErrorIcon from './FormErrorIcon';

describe('FormErrorIcon', () => {
  test('renderiza el icono de error con data-testid personalizado', () => {
    render(<FormErrorIcon data-testid="custom-error-icon" />);
    const iconElement = screen.getByTestId('custom-error-icon');
    expect(iconElement).toBeInTheDocument();
    // Check for SVG presence
    // eslint-disable-next-line testing-library/no-node-access
    expect(iconElement.querySelector('svg')).toBeInTheDocument();
  });

  test('renderiza con el data-testid por defecto generado por Icon si no se pasa uno', () => {
    render(<FormErrorIcon />);
    // Icon component will generate data-testid="icon-danger"
    const iconElement = screen.getByTestId('icon-danger');
    expect(iconElement).toBeInTheDocument();
  });

  test('acepta y aplica props adicionales como className', () => {
    render(
      <FormErrorIcon
        className="my-custom-error-class"
        data-testid="styled-error-icon"
      />
    );
    const iconElement = screen.getByTestId('styled-error-icon');
    expect(iconElement).toHaveClass('my-custom-error-class');
    // Default size and color are set by FormErrorIcon, can be checked if needed
    // Note: JSDOM might not compute the exact color string like a browser (e.g. 'rgb(211, 47, 47)' vs '#d32f2f')
    // So checking for presence of style attribute or partial match might be safer if exact string match fails.
    expect(iconElement).toHaveStyle('width: 20px'); // from default size={20}
    expect(iconElement).toHaveStyle('height: 20px');
    expect(iconElement).toHaveStyle('color: #d32f2f'); // from default color prop
  });
}); 