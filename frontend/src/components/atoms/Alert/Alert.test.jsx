import { render, screen, fireEvent } from '@testing-library/react';
import Alert from './Alert';
import { vi } from 'vitest';

describe('Alert Component', () => {
  test('muestra el mensaje y el tipo correcto', () => {
    render(<Alert type="error">¡Error grave!</Alert>);
    expect(screen.getByText('¡Error grave!')).toBeInTheDocument();
    const alertElement = screen.getByRole('alert');
    // Asegurarse de que la clase de CSS Modules se aplica correctamente.
    // Puede ser frágil si el nombre de la clase cambia. Considerar un enfoque más robusto si es necesario.
    expect(alertElement).toHaveClass('alert error');
  });

  test('renderiza con icono por defecto para el tipo "success"', () => {
    render(<Alert type="success">Éxito</Alert>);
    expect(screen.getByText('Éxito')).toBeInTheDocument();
    // Verificar que el icono por defecto 'check' se renderiza (o su representación)
    // Esto podría requerir inspeccionar el elemento Icon o usar un data-testid en Icon
    const iconElement = screen.getByRole('img', { hidden: true }); // Asumiendo que Icon renderiza un img o tiene role="img"
    // La comprobación específica del icono dependerá de cómo se implemente el componente Icon.
    // Por ejemplo, si Icon usa un data-testid: expect(screen.getByTestId('icon-check')).toBeInTheDocument();
    expect(iconElement).toBeInTheDocument();
  });

  test('renderiza con icono por defecto para el tipo "info" si el tipo no es reconocido', () => {
    render(<Alert type="unknown-type">Información Desconocida</Alert>);
    expect(screen.getByText('Información Desconocida')).toBeInTheDocument();
    const alertElement = screen.getByRole('alert');
    expect(alertElement).toHaveClass('alert'); // Debería tener la clase base y no una específica de tipo no reconocido
    // Verificar que el icono por defecto 'info' se renderiza
    const iconElement = screen.getByRole('img', { hidden: true });
    expect(iconElement).toBeInTheDocument();
  });

  test('renderiza con icono personalizado', () => {
    render(<Alert type="info" icon="custom-icon-name">Info con icono personalizado</Alert>);
    expect(screen.getByText('Info con icono personalizado')).toBeInTheDocument();
    // Verificar que el icono 'custom-icon-name' se renderiza
    const iconElement = screen.getByRole('img', { hidden: true });
    // Idealmente, el componente Icon tendría una forma de identificar qué icono está mostrando,
    // por ejemplo, a través de un data-attribute o similar.
    expect(iconElement).toBeInTheDocument();
  });

  test('llama a onClose cuando se hace click en el botón de cerrar', () => {
    const mockOnClose = vi.fn();
    render(<Alert type="warning" onClose={mockOnClose}>Advertencia con cierre</Alert>);

    const closeButton = screen.getByRole('button', { name: 'Cerrar' });
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('no renderiza el botón de cerrar si no se proporciona onClose', () => {
    render(<Alert type="danger">Peligro sin cierre</Alert>);
    expect(screen.queryByRole('button', { name: 'Cerrar' })).not.toBeInTheDocument();
  });

  test('aplica clases CSS adicionales pasadas mediante className', () => {
    const customClass = 'mi-clase-personalizada';
    render(<Alert type="info" className={customClass}>Alerta con clase extra</Alert>);
    const alertElement = screen.getByRole('alert');
    expect(alertElement).toHaveClass('alert info mi-clase-personalizada');
  });

  test('pasa atributos adicionales al elemento section', () => {
    render(<Alert type="info" data-testid="alerta-test">Alerta con data-testid</Alert>);
    expect(screen.getByTestId('alerta-test')).toBeInTheDocument();
  });

  test('renderiza correctamente sin hijos (children)', () => {
    render(<Alert type="info" />);
    const alertElement = screen.getByRole('alert');
    expect(alertElement).toBeInTheDocument();
    // El contenido podría estar vacío o tener algún texto por defecto si así se define.
    // En este caso, el componente Alert no define contenido por defecto si children es undefined.
    expect(alertElement.querySelector('._content_37a0af, .content')).toHaveTextContent('');
  });
}); 