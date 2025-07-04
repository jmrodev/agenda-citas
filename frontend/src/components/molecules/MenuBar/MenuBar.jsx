import React from 'react';
import MenuButton from '../../atoms/MenuButton/MenuButton';
import MenuSeparator from '../../atoms/MenuSeparator/MenuSeparator';
import styles from './MenuBar.module.css';

const MenuBar = ({ items, activeIndex, onMenuClick }) => (
  <nav className={styles.menuBar}>
    {items.map((item, idx) => (
      <React.Fragment key={item.label}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <MenuButton
            icon={item.icon}
            label={item.label}
            onClick={() => onMenuClick(idx)}
            active={activeIndex === idx}
          />
          {item.extra && <span style={{ marginLeft: 8 }}>{item.extra}</span>}
        </div>
        {idx < items.length - 1 && <MenuSeparator />}
      </React.Fragment>
    ))}
  </nav>
);

export default MenuBar; 