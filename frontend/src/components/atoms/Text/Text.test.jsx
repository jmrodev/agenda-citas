import { render, screen } from '@testing-library/react';
import Text from './Text';

describe('Text Component', () => {
  const sampleText = 'Este es un texto de prueba.';

  test('renderiza el children como contenido de texto', () => {
    render(<Text>{sampleText}</Text>);
    expect(screen.getByText(sampleText)).toBeInTheDocument();
  });

  test('renderiza como un elemento <p> por defecto', () => {
    render(<Text>{sampleText}</Text>);
    const textElement = screen.getByText(sampleText);
    expect(textElement.tagName).toBe('P');
  });

  test('renderiza como el elemento especificado en la prop "as"', () => {
    render(<Text as="span">{sampleText}</Text>);
    const textElementAsSpan = screen.getByText(sampleText);
    expect(textElementAsSpan.tagName).toBe('SPAN');

    render(<Text as="div">{sampleText}</Text>);
    const textElementAsDiv = screen.getByText(sampleText);
    expect(textElementAsDiv.tagName).toBe('DIV');

    render(<Text as="h2">{sampleText}</Text>);
    // Los headings tienen un rol implícito 'heading'
    const textElementAsH2 = screen.getByRole('heading', { name: sampleText, level: 2 });
    expect(textElementAsH2.tagName).toBe('H2');
  });

  test('aplica la clase base "text", color "default" y tamaño "md" por defecto', () => {
    render(<Text>{sampleText}</Text>);
    const textElement = screen.getByText(sampleText);
    expect(textElement).toHaveClass('text default md');
  });

  test('aplica un color específico, por ejemplo "primary"', () => {
    render(<Text color="primary">{sampleText}</Text>);
    const textElement = screen.getByText(sampleText);
    expect(textElement).toHaveClass('text primary md');
  });

  test('aplica un tamaño específico, por ejemplo "lg"', () => {
    render(<Text size="lg">{sampleText}</Text>);
    const textElement = screen.getByText(sampleText);
    expect(textElement).toHaveClass('text default lg');
  });

  test('maneja color y tamaño no definidos en estilos usando los por defecto de prop', () => {
    render(<Text color="unknownColor" size="xlarge">{sampleText}</Text>);
    const textElement = screen.getByText(sampleText);
    // Las clases 'unknownColor' y 'xlarge' no se aplicarán si no existen en CSS Modules.
    // Se aplicarán las clases de los valores por defecto de las props ('default' y 'md').
    expect(textElement).toHaveClass('text default md');
    expect(textElement).not.toHaveClass('unknownColor');
    expect(textElement).not.toHaveClass('xlarge');
  });

  test('aplica clases CSS adicionales pasadas mediante className', () => {
    const customClass = 'mi-texto-personalizado';
    render(<Text className={customClass}>{sampleText}</Text>);
    const textElement = screen.getByText(sampleText);
    expect(textElement).toHaveClass('text default md', customClass);
  });

  test('pasa atributos adicionales al elemento renderizado', () => {
    render(<Text data-testid="custom-text-element" title="Texto importante">{sampleText}</Text>);
    const textElement = screen.getByTestId('custom-text-element');
    expect(textElement).toBeInTheDocument();
    expect(textElement).toHaveAttribute('title', 'Texto importante');
    expect(screen.getByText(sampleText)).toBe(textElement);
  });

  test('renderiza correctamente sin hijos (children) si es un caso válido', () => {
    render(<Text data-testid="empty-text" />);
    const textElement = screen.getByTestId('empty-text');
    expect(textElement).toBeInTheDocument();
    expect(textElement).toHaveTextContent('');
  });
}); 