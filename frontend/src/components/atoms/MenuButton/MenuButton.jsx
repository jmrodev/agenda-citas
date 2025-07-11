import React, { forwardRef } from 'react';
import Button from '../Button/Button'; // Import the main Button component
import styles from './MenuButton.module.css';

const MenuButton = forwardRef(({ icon, label, onClick, active, className = '', ...rest }, ref) => (
  <Button
    ref={ref}
    className={[styles.menuButton, active ? styles.active : '', className].join(' ').trim()}
    onClick={onClick}
    // We are not using Button's variants or iconLeft/iconRight here.
    // The styling and structure are fully controlled by MenuButton.module.css
    // and the children structure defined below.
    {...rest} // type='button' is default in Button, pass other props like aria-label, disabled
  >
    {icon && <span className={styles.icon}>{icon}</span>} {/* Using styles.icon from MenuButton.module.css */}
    <span className={styles.label}>{label}</span>
  </Button>
));

MenuButton.displayName = 'MenuButton';

export default MenuButton; 