import React from 'react';
import { render, screen } from '@testing-library/react';
import FormGroup from './FormGroup';

describe('FormGroup Component', () => {
  const childrenText = "Contenido del grupo";
  const testTitle = "Información Personal";

  test('renderiza un fieldset con la clase "formGroup"', () => {
    // Para seleccionar un fieldset, a menudo se necesita un nombre accesible (ej. a través de legend)
    // o un testid. Si no tiene legend, es más difícil seleccionarlo por rol directamente sin ambigüedad.
    const { container } = render(<FormGroup>{childrenText}</FormGroup>);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const fieldsetElement = container.firstChild;
    expect(fieldsetElement.tagName).toBe('FIELDSET');
    expect(fieldsetElement).toHaveClass('formGroup');
  });

  test('renderiza la legend con el título y clase "title" si se proporciona title', () => {
    render(<FormGroup title={testTitle}>{childrenText}</FormGroup>);
    // La legend es el nombre accesible del fieldset
    const fieldsetElement = screen.getByRole('group', { name: testTitle });
    expect(fieldsetElement).toBeInTheDocument();

    const legendElement = screen.getByText(testTitle); // La legend se puede encontrar por su texto
    expect(legendElement.tagName).toBe('LEGEND');
    expect(legendElement).toHaveClass('title');
  });

  test('no renderiza la legend si no se proporciona title', () => {
    render(<FormGroup>{childrenText}</FormGroup>);
    // No debería haber ningún elemento legend
    expect(screen.queryByRole('group')).toBeInTheDocument(); // El fieldset aún existe
    expect(screen.queryByText(testTitle)).not.toBeInTheDocument(); // Pero no el título específico
    // eslint-disable-next-line testing-library/no-container
    const { container } = render(<FormGroup>{childrenText}</FormGroup>);
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.querySelector('legend')).not.toBeInTheDocument();
  });

  test('renderiza children dentro de un div con clase "fields"', () => {
    render(<FormGroup>{childrenText}</FormGroup>);
    const childrenElement = screen.getByText(childrenText);
    expect(childrenElement).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-node-access
    const fieldsDiv = childrenElement.parentElement;
    expect(fieldsDiv).toHaveClass('fields');
  });

  test('aplica className, style y otras props al fieldset principal', () => {
    const customClass = "mi-grupo-personalizado";
    const customStyle = { marginBottom: '20px' };
    const { container } = render(
      <FormGroup
        className={customClass}
        style={customStyle}
        data-group-id="grupo-1"
        disabled // un fieldset puede estar disabled
      >
        {childrenText}
      </FormGroup>
    );
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const fieldsetElement = container.firstChild;
    expect(fieldsetElement).toHaveClass('formGroup', customClass);
    expect(fieldsetElement).toHaveStyle('margin-bottom: 20px;');
    expect(fieldsetElement).toHaveAttribute('data-group-id', 'grupo-1');
    expect(fieldsetElement).toBeDisabled();
  });

  test('renderiza correctamente sin hijos (children)', () => {
    // El div .fields existirá, pero estará vacío.
    const { container } = render(<FormGroup title="Grupo Vacío" />);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const fieldsDiv = container.querySelector(`.${'fields'}`);
    expect(fieldsDiv).toBeInTheDocument();
    // eslint-disable-next-line testing-library/no-node-access
    expect(fieldsDiv.children.length).toBe(0);
    expect(screen.getByText("Grupo Vacío")).toBeInTheDocument(); // La legend debe estar
  });
}); 