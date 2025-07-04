import React from 'react';
import styles from './MenuDropdown.module.css';

const MenuDropdown = ({ options, open, anchorRef, onOptionClick }) => {
  if (!open) return null;
  return (
    <div className={styles.dropdown} style={{ left: anchorRef?.offsetLeft, top: anchorRef?.offsetTop + anchorRef?.offsetHeight }}>
      {options.map((opt, idx) => (
        <button
          key={opt.label}
          className={styles.dropdownItem}
          onClick={() => onOptionClick(idx)}
          type='button'
        >
          {opt.icon && <span className={styles.icon}>{opt.icon}</span>}
          <span className={styles.label}>{opt.label}</span>
        </button>
      ))}
    </div>
  );
};

export default MenuDropdown; 