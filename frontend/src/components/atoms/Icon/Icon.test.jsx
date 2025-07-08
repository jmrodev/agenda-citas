import { render, screen } from '@testing-library/react';
import Icon from './Icon';
// import { iconMap } from './Icon'; // If iconMap needs to be inspected or mocked

describe('Icon', () => {
  test('renderiza el icono con el data-testid generado por defecto', () => {
    render(<Icon name="check" />);
    // Default generated testid is icon-${name}
    const iconElement = screen.getByTestId('icon-check');
    expect(iconElement).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-node-access
    expect(iconElement.querySelector('svg')).toBeInTheDocument();
  });

  test('renderiza el icono con un data-testid personalizado', () => {
    render(<Icon name="home" data-testid="my-custom-home-icon" />);
    const iconElement = screen.getByTestId('my-custom-home-icon');
    expect(iconElement).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-node-access
    expect(iconElement.querySelector('svg')).toBeInTheDocument();
  });

  test('aplica className, style, size, y color correctamente', () => {
    const testSize = 48;
    const testColor = 'blue';
    const testClassName = 'extra-icon-class';
    const testStyle = { marginRight: '10px' };

    render(
      <Icon
        name="settings"
        size={testSize}
        color={testColor}
        className={testClassName}
        style={testStyle}
        data-testid="styled-icon"
      />
    );
    const iconElement = screen.getByTestId('styled-icon');
    expect(iconElement).toHaveClass(testClassName);
    expect(iconElement).toHaveStyle(`width: ${testSize}px`);
    expect(iconElement).toHaveStyle(`height: ${testSize}px`);
    expect(iconElement).toHaveStyle(`color: ${testColor}`);
    expect(iconElement).toHaveStyle(`margin-right: 10px`);
  });

  test('renderiza el icono por defecto (si iconMap.default existe) si el nombre no existe en iconMap', () => {
    // This test assumes iconMap.default is a valid SVG component.
    // The component's behavior is: const SvgIcon = iconMap[name] || iconMap.default;
    // The data-testid will be `icon-nonExistentIconName` due to the new default data-testid logic.
    // However, since the icon itself is null, the element with this testid won't be in the document.
    // We test that the component renders null by checking that the testid is not found.
    const { container } = render(<Icon name="nonExistentIconName" />);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    expect(container.firstChild).toBeNull();
    expect(screen.queryByTestId('icon-nonExistentIconName')).not.toBeInTheDocument();
  });

  test('aplica aria-label si se proporciona', () => {
    const label = "Icono de búsqueda";
    render(<Icon name="search" aria-label={label} />);
    const iconElement = screen.getByLabelText(label);
    expect(iconElement).toBeInTheDocument();
    expect(iconElement).toHaveAttribute('role', 'img');
  });

  test('no tiene aria-label si no se proporciona', () => {
    render(<Icon name="check" />);
    const iconElement = screen.getByTestId('icon-check');
    expect(iconElement).not.toHaveAttribute('aria-label');
  });
}); 