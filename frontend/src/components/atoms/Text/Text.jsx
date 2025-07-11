import React from 'react';
import styles from './Text.module.css';

/**
 * Text component renders text with various semantic elements and styles.
 * It serves as a versatile atom for displaying text content.
 *
 * @param {object} props - The component's props.
 * @param {React.ReactNode} props.children - The content to be rendered inside the text component.
 * @param {('p'|'span'|'div'|'h1'|'h2'|'h3'|'h4'|'h5'|'h6'|'label'|'caption'|'small'|'strong'|'em')} [props.as='p'] - The HTML tag to render the text as.
 * @param {('default'|'primary'|'secondary'|'success'|'warning'|'error'|'light')} [props.color='default'] - The color scheme for the text.
 * @param {('xs'|'sm'|'md'|'lg'|'xl'|'xxl'|'xxxl')} [props.size='md'] - The size of the text.
 * @param {('light'|'normal'|'medium'|'semibold'|'bold')} [props.weight='normal'] - The font weight of the text.
 * @param {string} [props.className=''] - Additional CSS classes to apply to the component.
 * @param {object} [props.rest] - Any other props will be spread onto the root element.
 * @returns {JSX.Element} The rendered text component.
 */
const Text = ({
  children,
  as = 'p',
  color = 'default',
  size = 'md',
  weight = 'normal',
  className = '',
  ...rest
}) => {
  const Component = as;
  return (
    <Component
      className={[
        styles.text,
        styles[color] || '',
        styles[size] || '',
        styles[`weight${weight.charAt(0).toUpperCase() + weight.slice(1)}`] || '', // Added weight class
        className
      ].join(' ').trim()}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default Text; 