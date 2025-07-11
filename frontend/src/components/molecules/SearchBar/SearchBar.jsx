import React from 'react';
import styles from './SearchBar.module.css';
import Input from '../../atoms/Input/Input';
import IconButton from '../../atoms/IconButton/IconButton';
// Icon atom is used by IconButton, not directly here unless SearchBar itself had a standalone icon.

/**
 * SearchBar is a molecule that provides a text input field with a search icon
 * and an optional clear button that appears when there is input.
 *
 * @param {object} props - The component's props.
 * @param {string} props.value - The current value of the search input.
 * @param {function} props.onChange - Callback function invoked when the search input value changes. Receives the native event.
 * @param {string} [props.placeholder='Buscar...'] - Placeholder text for the search input.
 * @param {function} [props.onClear] - Callback function invoked when the clear button is clicked. If not provided, the clear button is not shown.
 * @param {string} [props.className=''] - Additional CSS classes to apply to the SearchBar's root div.
 * @param {object} [props.style={}] - Inline styles to apply to the SearchBar's root div.
 * @param {object} [props.rest] - Any other props will be spread onto the SearchBar's root div.
 * @returns {JSX.Element} The rendered search bar component.
 */
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
        iconColor="currentColor"
        aria-label='Buscar'
        // className={styles.iconBtn} // Removed to rely on IconButton's default styling
        // buttonVariant="outline" // IconButton default variant should be neutral enough
      />
      {value && onClear && (
        <IconButton
          icon="close"
          iconSize={18}
          iconColor="var(--error-color)" // Use error color for clear button
          aria-label='Limpiar'
          onClick={onClear}
          // className={styles.clearBtn} // Removed
          // buttonVariant="outline"
        />
      )}
    </div>
  );
};

export default SearchBar; 