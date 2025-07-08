import { render, screen, fireEvent } from '@testing-library/react';
import Image from './Image';

describe('Image Component', () => {
  const testSrc = '/test-image.png';
  const testAlt = 'Imagen de prueba';
  const fallbackText = 'Imagen no disponible';
  const fallbackImageUrl = '/fallback-image.png';

  test('renderiza la imagen correctamente con src y alt', () => {
    render(<Image src={testSrc} alt={testAlt} />);
    const imgElement = screen.getByRole('img', { name: testAlt });
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', testSrc);
    expect(imgElement).toHaveAttribute('alt', testAlt);
    expect(imgElement).toHaveClass('image'); // Clase base del módulo CSS
  });

  test('aplica width y height cuando se proporcionan', () => {
    render(<Image src={testSrc} alt={testAlt} width={100} height={150} />);
    const imgElement = screen.getByRole('img', { name: testAlt });
    expect(imgElement).toHaveAttribute('width', '100');
    expect(imgElement).toHaveAttribute('height', '150');
  });

  test('aplica clases CSS adicionales pasadas mediante className', () => {
    const customClass = 'mi-imagen-personalizada';
    render(<Image src={testSrc} alt={testAlt} className={customClass} />);
    const imgElement = screen.getByRole('img', { name: testAlt });
    expect(imgElement).toHaveClass('image', customClass);
  });

  test('pasa atributos adicionales al elemento img', () => {
    render(<Image src={testSrc} alt={testAlt} data-testid="custom-img" loading="lazy" />);
    const imgElement = screen.getByTestId('custom-img');
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('loading', 'lazy');
  });

  describe('Fallback Behavior', () => {
    test('muestra el texto de fallback por defecto cuando la imagen falla al cargar', () => {
      render(<Image src="ruta-invalida.jpg" alt={testAlt} />);
      const imgElement = screen.getByRole('img', { name: testAlt });

      // Simular el evento onError
      fireEvent.error(imgElement);

      // Debería mostrar el texto de fallback
      expect(screen.getByText(fallbackText)).toBeInTheDocument();
      expect(screen.getByText(fallbackText)).toHaveClass('fallback');
      // La imagen original ya no debería estar (o al menos no ser accesible por su alt original si el alt cambia)
      expect(screen.queryByAltText(testAlt)).not.toBeInTheDocument();
    });

    test('muestra un texto de fallback personalizado cuando la imagen falla al cargar', () => {
      const customFallbackText = "Error al cargar imagen";
      render(<Image src="ruta-invalida.jpg" alt={testAlt} fallback={customFallbackText} />);
      const imgElement = screen.getByRole('img', { name: testAlt });
      fireEvent.error(imgElement);

      expect(screen.getByText(customFallbackText)).toBeInTheDocument();
      expect(screen.getByText(customFallbackText)).toHaveClass('fallback');
    });

    test('muestra una imagen de fallback cuando el fallback es una URL y la imagen principal falla', () => {
      render(<Image src="ruta-invalida.jpg" alt={testAlt} fallback={fallbackImageUrl} width={50} height={50}/>);
      const originalImgElement = screen.getByRole('img', { name: testAlt });
      fireEvent.error(originalImgElement);

      // Ahora debería haber una nueva imagen con src=fallbackImageUrl y alt='fallback'
      const fallbackImgElement = screen.getByRole('img', { name: 'fallback' });
      expect(fallbackImgElement).toBeInTheDocument();
      expect(fallbackImgElement).toHaveAttribute('src', fallbackImageUrl);
      expect(fallbackImgElement).toHaveClass('image'); // También usa la clase 'image'
      expect(fallbackImgElement).toHaveAttribute('width', '50');
      expect(fallbackImgElement).toHaveAttribute('height', '50');
    });

    test('aplica width y height al span de fallback de texto', () => {
        render(<Image src="ruta-invalida.jpg" alt={testAlt} width={100} height={120} />);
        const imgElement = screen.getByRole('img', { name: testAlt });
        fireEvent.error(imgElement);

        const fallbackSpan = screen.getByText(fallbackText);
        expect(fallbackSpan).toHaveStyle('width: 100px');
        expect(fallbackSpan).toHaveStyle('height: 120px');
      });
  });

  test('renderiza la imagen incluso si el alt text está vacío (aunque no es ideal)', () => {
    render(<Image src={testSrc} alt="" />);
    const imgElement = screen.getByRole('img'); // Busca por rol si el alt está vacío
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', testSrc);
    expect(imgElement).toHaveAttribute('alt', '');
  });

  // Considerar qué sucede si src es undefined o null. El componente actual lo pasaría tal cual.
  // El navegador podría intentar cargar la URL actual de la página.
  test('maneja src undefined o null (comportamiento del navegador)', () => {
    const { rerender } = render(<Image src={undefined} alt={testAlt} />);
    let imgElement = screen.getByRole('img', {name: testAlt});
    expect(imgElement).not.toHaveAttribute('src'); // React omite atributos undefined

    rerender(<Image src={null} alt={testAlt} />); // null se convierte a string "null" o se omite
    imgElement = screen.getByRole('img', {name: testAlt});
    // Dependiendo de React y el navegador, src={null} puede ser tratado como ausente o como "null"
    // En la mayoría de los casos modernos, React lo omite o el navegador lo ignora.
    // Si se convierte en "null", el test sería: expect(imgElement).toHaveAttribute('src', 'null');
    // Vamos a asumir que se omite o es inválido y podría disparar onError si se renderiza.
    // Para un test más predecible, se podría manejar explícitamente src={null} en el componente.
    // Por ahora, solo verificamos que se renderiza.
    expect(imgElement).toBeInTheDocument();
  });
}); 