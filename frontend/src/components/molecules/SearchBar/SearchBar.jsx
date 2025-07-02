import React from 'react';
import styles from './SearchBar.module.css';
import Input from '../../atoms/Input/Input';
import IconButton from '../../atoms/IconButton/IconButton';

const SearchBar = ({
  value,
  onChange,
  placeholder = 'Buscar...',
  onClear,
  className = '',
  style = {},
  ...rest
}) => {
  return (
    <div className={[styles.searchBar, className].join(' ').trim()} style={style} {...rest}>
      <Input
        type='search'
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={styles.input}
      />
      <IconButton aria-label='Buscar' className={styles.iconBtn}>
        <span role='img' aria-label='lupa'>🔍</span>
      </IconButton>
      {value && onClear && (
        <IconButton aria-label='Limpiar' onClick={onClear} className={styles.clearBtn}>
          <span role='img' aria-label='limpiar'>✖️</span>
        </IconButton>
      )}
    </div>
  );
};

export default SearchBar; 