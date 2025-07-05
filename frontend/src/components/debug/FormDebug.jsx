import React from 'react';

const FormDebug = ({ values, errors, touched }) => {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: '#f0f0f0',
      border: '1px solid #ccc',
      padding: '10px',
      fontSize: '12px',
      maxWidth: '300px',
      maxHeight: '400px',
      overflow: 'auto',
      zIndex: 9999
    }}>
      <h4>Debug del Formulario</h4>
      <div>
        <strong>Valores:</strong>
        <pre>{JSON.stringify(values, null, 2)}</pre>
      </div>
      <div>
        <strong>Errores:</strong>
        <pre>{JSON.stringify(errors, null, 2)}</pre>
      </div>
      <div>
        <strong>Touched:</strong>
        <pre>{JSON.stringify(touched, null, 2)}</pre>
      </div>
    </div>
  );
};

export default FormDebug; 