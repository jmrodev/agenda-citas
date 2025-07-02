import React, { useState } from 'react';
import Button from '../atoms/Button/Button';

const App = () => {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 400 }}>
      <h1>Ejemplos de Button (Átomo)</h1>
      <Button variant='primary' size='md' onClick={handleClick} loading={loading}>
        Primario {loading ? '' : ' (Click para loading)'}
      </Button>
      <Button variant='secondary' size='sm'>Secundario Pequeño</Button>
      <Button variant='danger' size='lg' loading>Eliminando...</Button>
      <Button variant='success' disabled>Éxito (Deshabilitado)</Button>
    </div>
  );
};

export default App; 