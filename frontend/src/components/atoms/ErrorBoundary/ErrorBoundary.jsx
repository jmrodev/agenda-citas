import React from 'react';
import styles from './ErrorBoundary.module.css';
import Button from '../Button/Button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      renderCount: 0
    };
    this.maxRenders = 100;
  }

  static getDerivedStateFromError(error) {
    // Actualizar el estado para que el siguiente render muestre el fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log del error para debugging (solo en desarrollo)
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary capturó un error:', error, errorInfo);
    }

    // Detectar posibles bucles infinitos
    this.setState(prevState => ({
      error: error,
      errorInfo: errorInfo,
      renderCount: prevState.renderCount + 1
    }));

    // Si hay demasiados errores, forzar reload
    if (this.state.renderCount > this.maxRenders) {
      console.error('Demasiados errores detectados. Recargando página...');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }

    // Aquí podrías enviar el error a un servicio de monitoreo
    // reportErrorToService(error, errorInfo);
  }

  componentDidUpdate(prevProps, prevState) {
    // Detectar bucles infinitos en el ErrorBoundary mismo
    if (this.state.renderCount > this.maxRenders) {
      console.error('ErrorBoundary en bucle infinito. Recargando...');
      window.location.reload();
    }
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      renderCount: 0
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <section className={styles.errorContainer}>
          <article className={styles.errorContent}>
            <span className={styles.errorIcon}>⚠️</span>
            <h2 className={styles.errorTitle}>Algo salió mal</h2>
            <p className={styles.errorMessage}>
              Ha ocurrido un error inesperado. Por favor, intenta de nuevo.
            </p>
            
            {typeof process !== 'undefined' && process.env.NODE_ENV === 'development' && this.state.error && (
              <details className={styles.errorDetails}>
                <summary>Detalles del error (solo desarrollo)</summary>
                <pre className={styles.errorStack}>
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <footer className={styles.errorActions}>
              <Button 
                onClick={this.handleRetry} 
                variant="primary"
                className={styles.retryButton}
              >
                Intentar de nuevo
              </Button>
              <Button 
                onClick={this.handleGoHome} 
                variant="secondary"
                className={styles.homeButton}
              >
                Ir al inicio
              </Button>
              <Button 
                onClick={this.handleReload} 
                variant="secondary"
                className={styles.reloadButton}
              >
                Recargar página
              </Button>
            </footer>
          </article>
        </section>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 