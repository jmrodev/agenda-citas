import React, { useState, useEffect } from 'react';
import CalendarDay from '../atoms/CalendarDay/CalendarDay';
import CalendarDot from '../atoms/CalendarDot/CalendarDot';
import CalendarWeekday from '../atoms/CalendarWeekday/CalendarWeekday';
import CalendarButton from '../atoms/CalendarButton/CalendarButton';
import FileInput from '../atoms/FileInput/FileInput';
import FormGroup from '../atoms/FormGroup/FormGroup';
import FormErrorIcon from '../atoms/FormErrorIcon/FormErrorIcon';

const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [disabled, setDisabled] = useState(false);
  const today = 15;
  const selected = 12;
  const days = Array.from({ length: 28 }, (_, i) => i + 1);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const handleFileChange = e => {
    const f = e.target.files[0];
    setFile(f);
    if (f && f.size > 1024 * 1024) {
      setError('El archivo es demasiado grande (máx 1MB)');
    } else {
      setError('');
    }
  };

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: 500 }}>
      <button onClick={() => setDarkMode(dm => !dm)} style={{ alignSelf: 'flex-end' }}>
        {darkMode ? 'Modo Claro' : 'Modo Oscuro'}
      </button>
      <h2>Átomos de Calendario</h2>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <CalendarButton>&lt;</CalendarButton>
        <span style={{ flex: 1, textAlign: 'center' }}>Abril 2025</span>
        <CalendarButton>&gt;</CalendarButton>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.3em', marginBottom: '0.5em' }}>
        {weekDays.map(d => (
          <CalendarWeekday key={d}>{d}</CalendarWeekday>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.3em' }}>
        {days.map(d => (
          <CalendarDay
            key={d}
            date={d}
            today={d === today}
            selected={d === selected}
            disabled={d < 3 || d > 26}
            hasEvent={d % 5 === 0}
            className={[
              'calendarDay',
              d === today ? 'today' : '',
              d === selected ? 'selected' : '',
              d < 3 || d > 26 ? 'disabled' : ''
            ].join(' ').trim()}
          />
        ))}
      </div>
      <div style={{ display: 'flex', gap: '1.5em', alignItems: 'center', marginTop: '1em' }}>
        <CalendarDot color='primary' />
        <CalendarDot color='success' />
        <CalendarDot color='danger' />
        <CalendarDot color='warning' />
      </div>
      <h2>Átomos de Formulario</h2>
      <FormGroup className='formGroup'>
        <FileInput
          label='Subir archivo'
          onChange={handleFileChange}
          accept='.jpg,.png,.pdf'
          disabled={disabled}
          error={!!error}
          className='fileInputLabel'
        />
        {file && !error && <span>Archivo seleccionado: {file.name}</span>}
        {error && (
          <span style={{ color: 'var(--danger-color)', display: 'flex', alignItems: 'center' }}>
            <FormErrorIcon className='formErrorIcon' />
            {error}
          </span>
        )}
      </FormGroup>
      <FormGroup className='formGroup'>
        <label>
          <input type='checkbox' checked={disabled} onChange={e => setDisabled(e.target.checked)} />
          Deshabilitar input de archivo
        </label>
      </FormGroup>
    </div>
  );
};

export default App; 