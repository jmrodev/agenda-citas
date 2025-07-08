import { render, screen } from '@testing-library/react';
import HelperText from './HelperText';

describe('HelperText Component', () => {
  const helpTextContent = 'Esta es una instrucción útil.';

  test('renderiza el contenido (children) del texto de ayuda', () => {
    render(<HelperText>{helpTextContent}</HelperText>);
    expect(screen.getByText(helpTextContent)).toBeInTheDocument();
  });

  test('renderiza como un elemento span', () => {
    render(<HelperText>{helpTextContent}</HelperText>);
    const helperElement = screen.getByText(helpTextContent);
    expect(helperElement.tagName).toBe('SPAN');
  });

  test('aplica la clase base "helperText" y el color "default" por defecto', () => {
    render(<HelperText>{helpTextContent}</HelperText>);
    const helperElement = screen.getByText(helpTextContent);
    expect(helperElement).toHaveClass('helperText default');
  });

  test('aplica un color específico, por ejemplo "error"', () => {
    // Suponiendo que 'error' es una clase de color definida en tus CSS Modules
    render(<HelperText color="error">{helpTextContent}</HelperText>);
    const helperElement = screen.getByText(helpTextContent);
    expect(helperElement).toHaveClass('helperText error');
  });

  test('aplica un color no definido en estilos y no añade clase de color extra (usa "default" o ninguna)', () => {
    render(<HelperText color="unknownColor">{helpTextContent}</HelperText>);
    const helperElement = screen.getByText(helpTextContent);
    // styles[color] || '' resultará en '', por lo que solo 'helperText' y 'default' (si es fallback) o ninguna clase de color
    // En este caso, el componente no tiene un fallback explícito a 'default' si styles[color] es undefined,
    // pero la prueba de 'default por defecto' ya cubre eso. Aquí solo nos aseguramos que 'unknownColor' no se aplica.
    expect(helperElement).toHaveClass('helperText'); // Debería tener la clase base
    expect(helperElement).not.toHaveClass('unknownColor');
    // Si el color por defecto 'default' se aplica siempre que no haya otro, entonces:
    // expect(helperElement).toHaveClass('helperText default');
    // Revisando el componente: styles[color] || '' , si color es unknownColor, entonces solo styles.helperText y className
    // El color 'default' se aplica porque es el valor por defecto de la prop, no porque sea un fallback en la lógica de clases si color no existe.
    // Por lo tanto, si color="unknownColor" se pasa, la clase 'default' no se aplicará.
     expect(helperElement).not.toHaveClass('default');


  });

  test('aplica clases CSS adicionales pasadas mediante className', () => {
    const customClass = 'mi-texto-ayuda-personalizado';
    render(<HelperText className={customClass}>{helpTextContent}</HelperText>);
    const helperElement = screen.getByText(helpTextContent);
    expect(helperElement).toHaveClass('helperText default', customClass);
  });

  test('pasa atributos adicionales al elemento span', () => {
    render(<HelperText id="ayuda-campo" data-testid="custom-helper">{helpTextContent}</HelperText>);
    const helperElement = screen.getByTestId('custom-helper');
    expect(helperElement).toBeInTheDocument();
    expect(helperElement).toHaveAttribute('id', 'ayuda-campo');
    expect(screen.getByText(helpTextContent)).toBe(helperElement);
  });

  test('renderiza correctamente sin hijos (children) si es un caso válido', () => {
    render(<HelperText data-testid="empty-helper" />);
    const helperElement = screen.getByTestId('empty-helper');
    expect(helperElement).toBeInTheDocument();
    expect(helperElement).toHaveTextContent('');
  });
}); 