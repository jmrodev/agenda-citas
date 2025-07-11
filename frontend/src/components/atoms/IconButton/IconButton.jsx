import React from 'react';
import Icon from '../Icon/Icon';
import Button from '../Button/Button'; // Import the main Button component
import styles from './IconButton.module.css';

const IconButton = ({
  icon, // Name of the icon
  onClick,
  iconSize = 24, // Changed default to 24 to match Icon's default, was 'size'
  iconColor, // Was 'color', pass the actual color string e.g. "var(--primary-color)" or "red"
  'aria-label': ariaLabel,
  disabled = false,
  className = '',
  buttonVariant = 'outline', // To have a base transparent style, can be overridden by styles.iconButton
  ...rest
}) => {
  if (!ariaLabel && icon) {
    // console.warn(`IconButton with icon "${icon}" should have an aria-label for accessibility.`);
    // It's good practice but let's not make it a breaking change with a warning for now.
  }

  const effectiveIconColor = iconColor ? (iconColor.startsWith('--') ? `var(${iconColor})` : iconColor) : undefined;


  return (
    <Button
      type='button'
      isIconOnly={true}
      iconLeft={<Icon name={icon} size={iconSize} color={effectiveIconColor} />}
      className={[styles.iconButton, className].join(' ').trim()}
      onClick={onClick}
      aria-label={ariaLabel || `${icon} icon`} // Default aria-label if not provided
      disabled={disabled}
      variant={buttonVariant} // Use a variant that is visually minimal
      {...rest}
    >
      {/* Children are ignored in isIconOnly mode by Button, which is fine */}
    </Button>
  );
};

export default IconButton; 