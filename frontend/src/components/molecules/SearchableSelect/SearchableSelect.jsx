import React, { useState, useMemo, useEffect, useRef } from 'react';
import styles from './SearchableSelect.module.css';
import Select from '../../atoms/Select/Select';
import Input from '../../atoms/Input/Input';
import Icon from '../../atoms/Icon/Icon';

const SearchableSelect = ({
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Buscar...',
  searchFields = ['label'], // campos para buscar
  className = '',
  required = false,
  disabled = false,
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Filtrar opciones basado en el término de búsqueda
  const filteredOptionsMemo = useMemo(() => {
    if (!searchTerm.trim()) {
      return options;
    }

    const searchLower = searchTerm.toLowerCase();
    return options.filter(option => {
      // Buscar en todos los campos especificados
      return searchFields.some(field => {
        const fieldValue = option[field];
        if (typeof fieldValue === 'string') {
          return fieldValue.toLowerCase().includes(searchLower);
        }
        return false;
      });
    });
  }, [options, searchTerm, searchFields]);

  // Actualizar opciones filtradas cuando cambien
  useEffect(() => {
    setFilteredOptions(filteredOptionsMemo);
  }, [filteredOptionsMemo]);

  const handleSelectChange = (e) => {
    onChange(e);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTriggerClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        // Focus en el input de búsqueda cuando se abre
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 100);
      }
    }
  };

  const handleSearchInputFocus = () => {
    setIsOpen(true);
  };

  const handleSearchInputBlur = (e) => {
    // Solo cerrar si el focus no está dentro del contenedor
    setTimeout(() => {
      if (containerRef.current && !containerRef.current.contains(document.activeElement)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    }, 150);
  };

  // Manejar clicks fuera del componente
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  const handleEscapeKey = (event) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const selectedOption = options.find(option => option.value === value);

  return (
    <div className={`${styles.searchableSelect} ${className}`} ref={containerRef}>
      <div 
        className={styles.selectTrigger}
        onClick={handleTriggerClick}
        tabIndex={disabled ? -1 : 0}
        data-disabled={disabled}
        role="button"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className={styles.selectedValue}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <Icon 
          name="chevron-down" 
          className={`${styles.chevron} ${isOpen ? styles.rotated : ''}`}
        />
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
                  <div className={styles.searchContainer}>
          <Input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={handleSearchInputFocus}
            onBlur={handleSearchInputBlur}
            placeholder={placeholder}
            className={styles.searchInput}
            autoFocus
          />
        </div>
          
          <div className={styles.optionsContainer} role="listbox">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={`${styles.option} ${value === option.value ? styles.selected : ''}`}
                  onClick={() => handleSelectChange({ target: { name, value: option.value } })}
                  role="option"
                  aria-selected={value === option.value}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className={styles.noResults}>
                No se encontraron resultados
              </div>
            )}
          </div>
        </div>
      )}

      {/* Input oculto para mantener la funcionalidad del formulario */}
      <input
        type="hidden"
        name={name}
        value={value || ''}
        required={required}
        disabled={disabled}
      />
    </div>
  );
};

export default SearchableSelect; 