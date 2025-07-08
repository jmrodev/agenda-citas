import React from 'react';

const FileInput = ({ label, onChange, accept, multiple, disabled, error, className = '', ...rest }) => {
  return (
    <label className={className}>
      {label && <span>{label}</span>}
      <input
        type='file'
        onChange={onChange}
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        aria-invalid={error}
        data-testid={rest['data-testid'] || 'file-input'} // Ensure a default testid if none passed
        {...rest}
      />
    </label>
  );
};

export default FileInput; 