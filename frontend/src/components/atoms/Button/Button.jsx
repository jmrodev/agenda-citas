import React from 'react';
import styles from './Button.module.css';

const variantClass = {
  primary: styles.primary,
  secondary: styles.secondary,
  danger: styles.danger,
  success: styles.success,
  outline: styles.outline
};

const sizeClass = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
  neutral: styles.neutral, // Added neutral variant
};

/**
 * @typedef {('button'|'submit'|'reset')} ButtonType
 * @typedef {('primary'|'secondary'|'danger'|'success'|'outline'|'neutral')} ButtonVariant
 * @typedef {('sm'|'md'|'lg')} ButtonSize
 */

/**
 * Button component provides a flexible and themeable button element.
 * It supports different visual styles (variants), sizes, loading states, and icons.
 *
 * @param {object} props - The component's props.
 * @param {React.ReactNode} [props.children] - The content to be rendered inside the button. Not rendered if `isIconOnly` is true.
 * @param {function} [props.onClick] - Callback function invoked when the button is clicked.
 * @param {ButtonType} [props.type='button'] - The native HTML button type.
 * @param {string} [props.className=''] - Additional CSS classes to apply to the button.
 * @param {ButtonVariant} [props.variant='primary'] - The visual style of the button.
 * @param {ButtonSize} [props.size='md'] - The size of the button.
 * @param {boolean} [props.loading=false] - If true, displays a loading spinner instead of children and disables the button.
 * @param {boolean} [props.disabled=false] - If true, disables the button.
 * @param {React.ReactNode} [props.iconLeft=null] - React node (e.g., an <Icon /> component) to render on the left side of the button children.
 * @param {React.ReactNode} [props.iconRight=null] - React node to render on the right side of the button children.
 * @param {boolean} [props.isIconOnly=false] - If true, styles the button for displaying only an icon (circular, adjusted padding). `children` will not be rendered. `iconLeft` should be used for the icon.
 * @param {string} [props.ariaLabel] - Aria-label for accessibility, especially important for `isIconOnly` buttons. Defaults to "icon button" if `isIconOnly` and no specific label is provided.
 * @param {object} [props.rest] - Any other props will be spread onto the native button element.
 * @param {React.Ref<HTMLButtonElement>} ref - Forwarded ref to the native button element.
 * @returns {JSX.Element} The rendered button component.
 */
const ButtonComponent = ( // Renamed for clarity with forwardRef
  {
    children,
    onClick,
    type = 'button',
    className = '',
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    iconLeft = null,
    iconRight = null,
    isIconOnly = false,
    'aria-label': ariaLabel,
    ...rest
  },
  ref
) => {
  const buttonContent = (
    <>
      {iconLeft && <span className={styles.iconWrapper}>{iconLeft}</span>}
      {!isIconOnly && children}
      {iconRight && <span className={styles.iconWrapper}>{iconRight}</span>}
    </>
  );

  return (
    <button
      ref={ref} // Apply the ref here
      type={type}
      className={[
        styles.button,
        variantClass[variant] || '',
        sizeClass[size] || '',
        isIconOnly ? styles.iconOnly : '',
        className
      ].join(' ').trim()}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={isIconOnly && !ariaLabel ? 'icon button' : ariaLabel}
      aria-busy={loading}
      {...rest}
    >
      {loading ? <span className={styles.loader} aria-hidden="true" /> : buttonContent}
    </button>
  );
};

ButtonComponent.displayName = 'Button';

// Wrap with forwardRef and then memo
const Button = React.memo(React.forwardRef(ButtonComponent));

export default Button;