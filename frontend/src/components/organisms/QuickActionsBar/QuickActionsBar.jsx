import React from 'react';
import QuickAction from '../../molecules/QuickAction/QuickAction';
import styles from './QuickActionsBar.module.css';

const QuickActionsBar = ({ actions }) => (
  <div className={styles.bar}>
    {actions.map((action, idx) => (
      <QuickAction key={idx} {...action} />
    ))}
  </div>
);

export default QuickActionsBar; 