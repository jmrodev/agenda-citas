import React from 'react';

const FormGroup = ({ children, className = '', style = {}, ...rest }) => {
  return (
    <div className={className} style={style} {...rest}>
      {children}
    </div>
  );
};

export default FormGroup; 