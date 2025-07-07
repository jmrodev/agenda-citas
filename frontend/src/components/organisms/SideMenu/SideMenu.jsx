import React, { useState } from 'react';
import SideMenu from '../../molecules/SideMenu/SideMenu';

const SideMenuWrapper = ({ menuItems, onMenuSelect }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleMenuClick = idx => {
    setActiveIndex(idx);
    if (onMenuSelect) onMenuSelect(idx);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <SideMenu 
      items={menuItems} 
      activeIndex={activeIndex} 
      onMenuClick={handleMenuClick}
      isCollapsed={isCollapsed}
      onToggleCollapse={toggleCollapse}
    />
  );
};

export default SideMenuWrapper; 