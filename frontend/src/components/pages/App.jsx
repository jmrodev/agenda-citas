import React, { useState, useEffect } from 'react';
import Image from '../atoms/Image/Image';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: 500 }}>
      <button onClick={() => setDarkMode(dm => !dm)} style={{ alignSelf: 'flex-end' }}>
        {darkMode ? 'Modo Claro' : 'Modo Oscuro'}
      </button>
      <h2>Ejemplo de Image (Átomo)</h2>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <Image src='https://randomuser.me/api/portraits/men/32.jpg' alt='Usuario' width={80} height={80} />
        <Image src='https://noexiste.com/imagen.jpg' alt='No existe' width={80} height={80} />
        <Image src='https://noexiste.com/imagen.jpg' alt='No existe' width={80} height={80} fallback='https://randomuser.me/api/portraits/women/44.jpg' />
        <Image src='https://noexiste.com/imagen.jpg' alt='No existe' width={80} height={80} fallback='Sin imagen' />
      </div>
    </div>
  );
};

export default App; 