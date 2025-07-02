import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './SuccessScreen.module.css';

/**
 * SuccessScreen
 * @param {string} message - Mensaje de éxito a mostrar
 * @param {string} redirectTo - Ruta a la que redirigir automáticamente (opcional)
 * @param {number} delay - Milisegundos antes de redirigir (opcional, default 2000)
 * @param {string} linkText - Texto del botón/enlace manual (opcional)
 */
function SuccessScreen({ message, redirectTo, delay = 2000, linkText = 'Continuar' }) {
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (redirectTo) {
      timer = setTimeout(() => {
        navigate(redirectTo);
      }, delay);
    }
    return () => clearTimeout(timer);
  }, [redirectTo, delay, navigate]);

  return (
    <div className={styles.successScreen}>
      <div className={styles.icon} aria-hidden>
        <svg width='48' height='48' viewBox='0 0 48 48' fill='none'>
          <circle cx='24' cy='24' r='24' fill='var(--success-bg, #e6f9f0)' />
          <path d='M16 25l6 6 10-14' stroke='var(--success-color, #22c55e)' strokeWidth='3' strokeLinecap='round' strokeLinejoin='round' fill='none' />
        </svg>
      </div>
      <div className={styles.message}>{message}</div>
      {redirectTo && (
        <div className={styles.linkWrap}>
          <Link to={redirectTo} className={styles.link}>{linkText}</Link>
        </div>
      )}
    </div>
  );
}

export default SuccessScreen; 