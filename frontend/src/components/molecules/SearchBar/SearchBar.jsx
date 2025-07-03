import React from 'react';
import styles from './SearchBar.module.css';
import Input from '../../atoms/Input/Input';
import IconButton from '../../atoms/IconButton/IconButton';
import Icon from '../../atoms/Icon/Icon';

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
        <Icon name="search" size={18} />
      </IconButton>
      {value && onClear && (
        <IconButton aria-label='Limpiar' onClick={onClear} className={styles.clearBtn}>
          <Icon name="close" size={18} />
        </IconButton>
      )}
    </div>
  );
};

export default SearchBar; 