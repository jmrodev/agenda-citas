import React, { useState } from 'react';
import styles from './Tooltip.module.css';

const Tooltip = ({
  children,
  text,
  position = 'top',
  className = '',
  ...rest
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <span
      className={[styles.wrapper, className].join(' ').trim()}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      tabIndex={0}
      {...rest}
    >
      {children}
      {visible && (
        <span className={[styles.tooltip, styles[position]].join(' ')} role='tooltip'>
          {text}
        </span>
      )}
    </span>
  );
};

export default Tooltip; 