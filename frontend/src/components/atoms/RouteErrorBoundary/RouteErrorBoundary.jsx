import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RouteErrorBoundary.module.css';
import Button from '../Button/Button';

class RouteErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log del error para debugging (solo en desarrollo)
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.error('RouteErrorBoundary capturó un error:', error, errorInfo);
    }

    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  handleGoBack = () => {
    if (this.props.navigate) {
      this.props.navigate(-1);
    } else {
      window.history.back();
    }
  };

  handleGoHome = () => {
    if (this.props.navigate) {
      this.props.navigate('/');
    } else {
      window.location.href = '/';
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <section className={styles.routeErrorContainer}>
          <article className={styles.routeErrorContent}>
            <span className={styles.routeErrorIcon}>🚧</span>
            <h2 className={styles.routeErrorTitle}>Error en la página</h2>
            <p className={styles.routeErrorMessage}>
              Ha ocurrido un error al cargar esta página. Esto puede ser temporal.
            </p>
            
            {typeof process !== 'undefined' && process.env.NODE_ENV === 'development' && this.state.error && (
              <details className={styles.routeErrorDetails}>
                <summary>Detalles del error (solo desarrollo)</summary>
                <pre className={styles.routeErrorStack}>
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <footer className={styles.routeErrorActions}>
              <Button 
                onClick={this.handleRetry} 
                variant="primary"
                className={styles.retryButton}
              >
                Intentar de nuevo
              </Button>
              <Button 
                onClick={this.handleGoBack} 
                variant="secondary"
                className={styles.backButton}
              >
                Volver
              </Button>
              <Button 
                onClick={this.handleGoHome} 
                variant="secondary"
                className={styles.homeButton}
              >
                Ir al inicio
              </Button>
            </footer>
          </article>
        </section>
      );
    }

    return this.props.children;
  }
}

// Wrapper para usar con hooks de React Router
const RouteErrorBoundaryWrapper = ({ children }) => {
  const navigate = useNavigate();
  
  return (
    <RouteErrorBoundary navigate={navigate}>
      {children}
    </RouteErrorBoundary>
  );
};

export default RouteErrorBoundaryWrapper; 