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
    // The data-testid will still be `icon-nonExistentIconName` due to how it's generated.
    // We are primarily testing that it doesn't crash and renders *something*.
    // To properly test the fallback visual, one would need to know what iconMap.default is.
    render(<Icon name="nonExistentIconName" />);
    const iconElement = screen.getByTestId('icon-nonExistentIconName');
    expect(iconElement).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-node-access
    expect(iconElement.querySelector('svg')).toBeInTheDocument(); // Assumes default icon is also an SVG
  });
}); 