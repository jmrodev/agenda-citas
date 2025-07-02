import React, { useState, useEffect } from 'react';
import Radio from '../atoms/Radio/Radio';
import Label from '../atoms/Label/Label';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [selected, setSelected] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const handleRadioChange = e => {
    setSelected(e.target.value);
    setError(false);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!selected) setError(true);
    else alert('Seleccionado: ' + selected);
  };

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 400 }}>
      <button onClick={() => setDarkMode(dm => !dm)} style={{ alignSelf: 'flex-end' }}>
        {darkMode ? 'Modo Claro' : 'Modo Oscuro'}
      </button>
      <h2>Ejemplo de Radio (Átomo)</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Radio
            id='opcion1'
            name='opciones'
            value='opcion1'
            checked={selected === 'opcion1'}
            onChange={handleRadioChange}
            error={error && !selected}
          />
          <Label htmlFor='opcion1'>Opción 1</Label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Radio
            id='opcion2'
            name='opciones'
            value='opcion2'
            checked={selected === 'opcion2'}
            onChange={handleRadioChange}
            error={error && !selected}
          />
          <Label htmlFor='opcion2'>Opción 2</Label>
        </div>
        {error && <span style={{ color: 'var(--danger-color)' }}>Debes seleccionar una opción</span>}
        <button type='submit' style={{ marginTop: '1rem' }}>Enviar</button>
      </form>
    </div>
  );
};

export default App; 