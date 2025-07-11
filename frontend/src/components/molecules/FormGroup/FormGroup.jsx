import React from 'react';
import styles from './FormGroup.module.css';

/**
 * FormGroup is a molecule that groups related form fields under a common title
 * using HTML fieldset and legend elements for semantic structure and accessibility.
 *
 * @param {object} props - The component's props.
 * @param {string} [props.title=''] - The title for the group, rendered as a <legend>.
 * @param {React.ReactNode} props.children - The content of the form group, typically one or more FormField molecules or other input elements.
 * @param {string} [props.className=''] - Additional CSS classes to apply to the fieldset element.
 * @param {object} [props.style={}] - Inline styles to apply to the fieldset element.
 * @param {object} [props.rest] - Any other props will be spread onto the fieldset element.
 * @returns {JSX.Element} The rendered form group component.
 */
const FormGroup = ({
  title = '',
  children,
  className = '',
  style = {},
  ...rest
}) => {
  return (
    <fieldset className={[styles.formGroup, className].join(' ').trim()} style={style} {...rest}>
      {title && <legend className={styles.title}>{title}</legend>}
      {/* The div with styles.fields might be optional if children manage their own layout, or it provides consistent spacing. */}
      <div className={styles.fields}>{children}</div>
    </fieldset>
  );
};

export default FormGroup; 