import { render, screen } from '@testing-library/react';
import CardImage from './CardImage';

describe('CardImage Component', () => {
  const testSrc = '/test-image.jpg';
  const testAlt = 'Descripción de la imagen de prueba';

  test('renderiza la imagen con src y alt correctos', () => {
    render(<CardImage src={testSrc} alt={testAlt} />);
    const imgElement = screen.getByRole('img', { name: testAlt });
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', testSrc);
    expect(imgElement).toHaveAttribute('alt', testAlt);
  });

  test('aplica la clase base "cardImage"', () => {
    render(<CardImage src={testSrc} alt={testAlt} />);
    const imgElement = screen.getByRole('img', { name: testAlt });
    expect(imgElement).toHaveClass('cardImage');
  });

  test('aplica clases CSS adicionales pasadas mediante className', () => {
    const customClass = 'mi-imagen-tarjeta-personalizada';
    render(<CardImage src={testSrc} alt={testAlt} className={customClass} />);
    const imgElement = screen.getByRole('img', { name: testAlt });
    expect(imgElement).toHaveClass('cardImage', customClass);
  });

  test('aplica estilos en línea pasados mediante la prop style', () => {
    const inlineStyle = { border: '1px solid red', objectFit: 'cover' };
    render(<CardImage src={testSrc} alt={testAlt} style={inlineStyle} />);
    const imgElement = screen.getByRole('img', { name: testAlt });
    expect(imgElement).toHaveStyle('border: 1px solid red');
    expect(imgElement).toHaveStyle('object-fit: cover');
  });

  test('pasa atributos adicionales al elemento img', () => {
    render(<CardImage src={testSrc} alt={testAlt} data-testid="custom-card-image" loading="lazy" />);
    const imgElement = screen.getByTestId('custom-card-image');
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('loading', 'lazy');
    // Asegurar que sigue siendo la imagen correcta
    expect(screen.getByRole('img', { name: testAlt })).toBe(imgElement);
  });

  test('renderiza la imagen incluso si el alt text está vacío (aunque no es ideal para accesibilidad)', () => {
    render(<CardImage src={testSrc} alt="" />);
    const imgElement = screen.getByRole('img'); // Busca por rol si el alt está vacío
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', testSrc);
    expect(imgElement).toHaveAttribute('alt', ''); // Verifica que el alt esté presente pero vacío
  });

  test('no renderiza si src no se proporciona (o maneja el error según diseño)', () => {
    // Dependiendo de cómo quieras que se comporte el componente sin src:
    // Opción 1: No renderiza nada (o un placeholder)
    // const { container } = render(<CardImage alt={testAlt} />);
    // expect(container.querySelector('img')).not.toBeInTheDocument(); // o queryByRole

    // Opción 2: Renderiza img con src vacío (comportamiento del navegador)
    render(<CardImage alt={testAlt} src="" />); // src="" es diferente a src no definido
    const imgElement = screen.getByRole('img', { name: testAlt });
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', '');

    // Si src es undefined, el atributo no debería estar presente o ser string "undefined"
    // Esto depende mucho de cómo React maneje props undefined para atributos HTML.
    // Normalmente un atributo con valor undefined no se renderiza.
    const { container } = render(<CardImage alt={testAlt} src={undefined} />);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const imgTag = container.querySelector('img');
    expect(imgTag).toBeInTheDocument();
    expect(imgTag).not.toHaveAttribute('src'); // O que tenga un valor por defecto si se define
  });
}); 