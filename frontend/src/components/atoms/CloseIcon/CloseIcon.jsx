import React from 'react';
import Icon from '../Icon/Icon'; // Import the generic Icon component
import styles from './CloseIcon.module.css';

const CloseIcon = ({ onClick, className = '', ...rest }) => (
  <button
    type="button" // Good practice for buttons not submitting forms
    className={[styles.closeButton, className].join(' ').trim()}
    onClick={onClick}
    aria-label='Cerrar' // Retain specific aria-label for this context
    {...rest}
  >
    <Icon name='close' /> {/* Use the generic Icon component, default size is 24 */}
  </button>
);

export default CloseIcon; 