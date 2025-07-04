import React, { useState, useRef } from 'react';
import MenuBar from '../../molecules/MenuBar/MenuBar';
import MenuDropdown from '../../molecules/MenuDropdown/MenuDropdown';

const DesktopMenuBar = ({ menuItems, onMenuSelect }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(null); // índice del menú con dropdown abierto
  const buttonRefs = useRef([]);

  const handleMenuClick = (idx) => {
    setActiveIndex(idx);
    if (menuItems[idx].onClick) {
      menuItems[idx].onClick();
    }
    if (menuItems[idx].dropdown) {
      setDropdownOpen(dropdownOpen === idx ? null : idx);
    } else {
      setDropdownOpen(null);
      if (onMenuSelect) onMenuSelect(idx);
    }
  };

  const handleDropdownOption = (menuIdx, optIdx) => {
    setDropdownOpen(null);
    if (menuItems[menuIdx].dropdown[optIdx].onClick) {
      menuItems[menuIdx].dropdown[optIdx].onClick();
    }
    if (onMenuSelect) onMenuSelect(menuIdx, optIdx);
  };

  return (
    <div style={{ position: 'relative' }}>
      <MenuBar
        items={menuItems}
        activeIndex={activeIndex}
        onMenuClick={handleMenuClick}
        buttonRefs={buttonRefs}
      />
      {menuItems.map((item, idx) =>
        item.dropdown ? (
          <MenuDropdown
            key={item.label}
            options={item.dropdown}
            open={dropdownOpen === idx}
            anchorRef={buttonRefs.current[idx]}
            onOptionClick={(optIdx) => handleDropdownOption(idx, optIdx)}
          />
        ) : null
      )}
    </div>
  );
};

export default DesktopMenuBar; 