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
      <IconButton
        icon="search"
        iconSize={18}
        iconColor="currentColor" // Assuming default inherited color is desired
        aria-label='Buscar'
        className={styles.iconBtn}
        buttonVariant="outline" // Or choose another variant if 'outline' adds unwanted styles
      />
      {value && onClear && (
        <IconButton
          icon="close"
          iconSize={18}
          iconColor="currentColor" // Assuming default inherited color is desired
          aria-label='Limpiar'
          onClick={onClear}
          className={styles.clearBtn}
          buttonVariant="outline" // Or choose another variant
        />
      )}
    </div>
  );
};

export default SearchBar; 