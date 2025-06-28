// NavigationComponent.js
import React, { useState, useEffect } from 'react';

const NavigationComponent = ({ currentPage, onPageChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');

  // Cargar tema desde localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Cambiar tema
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Cerrar menú móvil
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navItems = [
    { id: 'calendar', label: 'Calendario', icon: '📅' },
    { id: 'stats', label: 'Estadísticas', icon: '📊' },
    { id: 'data', label: 'Datos', icon: '🗂️' }
  ];

  return (
    <nav className="navigation">
      <div className="nav-container">
        {/* Logo/Brand */}
        <a href="#" className="nav-brand" onClick={(e) => { e.preventDefault(); onPageChange('calendar'); }}>
          <span className="nav-icon">📅</span>
          Agenda Citas
        </a>

        {/* Menú de navegación */}
        <ul className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
          {navItems.map((item) => (
            <li key={item.id} className="nav-item">
              <a
                href="#"
                className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(item.id);
                  closeMenu();
                }}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </a>
            </li>
          ))}
          
          {/* Botón de cambio de tema */}
          <li className="nav-item">
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              title={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
            >
              <span className="icon">
                {theme === 'light' ? '🌙' : '☀️'}
              </span>
            </button>
          </li>
        </ul>

        {/* Botón de menú móvil */}
        <button
          className="nav-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  );
};

export default NavigationComponent; 