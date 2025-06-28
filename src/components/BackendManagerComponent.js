import React, { useState, useEffect } from 'react';

const BackendManagerComponent = () => {
  const [backendStatus, setBackendStatus] = useState('unknown');
  const [backendConfig, setBackendConfig] = useState({
    port: 3001,
    dataPath: './public',
    autoStart: true,
    autoRestart: true
  });
  const [logs, setLogs] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  // Verificar estado del backend
  const checkBackendStatus = async () => {
    try {
      const response = await fetch(`http://localhost:${backendConfig.port}/api/status`);
      if (response.ok) {
        setBackendStatus('running');
        setIsConnected(true);
        addLog('Backend conectado correctamente', 'success');
      } else {
        setBackendStatus('error');
        setIsConnected(false);
        addLog('Backend respondió con error', 'error');
      }
    } catch (error) {
      setBackendStatus('stopped');
      setIsConnected(false);
      addLog('Backend no disponible', 'warning');
    }
  };

  // Iniciar backend
  const startBackend = async () => {
    addLog('Iniciando backend...', 'info');
    try {
      // Aquí podrías hacer una llamada a un script que inicie el backend
      // Por ahora simulamos el inicio
      setBackendStatus('starting');
      setTimeout(() => {
        checkBackendStatus();
      }, 3000);
    } catch (error) {
      addLog(`Error iniciando backend: ${error.message}`, 'error');
    }
  };

  // Detener backend
  const stopBackend = async () => {
    addLog('Deteniendo backend...', 'info');
    try {
      // Aquí podrías hacer una llamada para detener el backend
      setBackendStatus('stopping');
      setTimeout(() => {
        setBackendStatus('stopped');
        setIsConnected(false);
        addLog('Backend detenido', 'success');
      }, 2000);
    } catch (error) {
      addLog(`Error deteniendo backend: ${error.message}`, 'error');
    }
  };

  // Reiniciar backend
  const restartBackend = async () => {
    addLog('Reiniciando backend...', 'info');
    await stopBackend();
    setTimeout(() => {
      startBackend();
    }, 3000);
  };

  // Exportar datos
  const exportData = async () => {
    try {
      const response = await fetch(`http://localhost:${backendConfig.port}/api/export`);
      if (response.ok) {
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `agenda-citas-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        addLog('Datos exportados correctamente', 'success');
      }
    } catch (error) {
      addLog(`Error exportando datos: ${error.message}`, 'error');
    }
  };

  // Importar datos
  const importData = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      const response = await fetch(`http://localhost:${backendConfig.port}/api/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        addLog('Datos importados correctamente', 'success');
        window.location.reload(); // Recargar para ver los cambios
      } else {
        addLog('Error importando datos', 'error');
      }
    } catch (error) {
      addLog(`Error importando datos: ${error.message}`, 'error');
    }
  };

  // Agregar log
  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-9), { timestamp, message, type }]);
  };

  // Verificar estado inicial
  useEffect(() => {
    checkBackendStatus();
    const interval = setInterval(checkBackendStatus, 10000); // Verificar cada 10 segundos
    return () => clearInterval(interval);
  }, [backendConfig.port]);

  const getStatusColor = () => {
    switch (backendStatus) {
      case 'running': return '#28a745';
      case 'stopped': return '#dc3545';
      case 'starting': return '#ffc107';
      case 'stopping': return '#fd7e14';
      case 'error': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusText = () => {
    switch (backendStatus) {
      case 'running': return 'Ejecutándose';
      case 'stopped': return 'Detenido';
      case 'starting': return 'Iniciando...';
      case 'stopping': return 'Deteniendo...';
      case 'error': return 'Error';
      default: return 'Desconocido';
    }
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h1 style={{
          color: '#2c3e50',
          fontSize: '2rem',
          fontWeight: '700',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          ⚙️ Gestión del Backend
        </h1>

        {/* Estado del Backend */}
        <div style={{
          background: '#f8f9fa',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#495057' }}>Estado del Servidor</h3>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: getStatusColor(),
              animation: backendStatus === 'starting' || backendStatus === 'stopping' ? 'pulse 1s infinite' : 'none'
            }} />
            <span style={{ fontWeight: '600', color: '#495057' }}>
              {getStatusText()}
            </span>
            <span style={{ color: '#6c757d' }}>
              Puerto: {backendConfig.port}
            </span>
          </div>

          {/* Controles del Backend */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={startBackend}
              disabled={backendStatus === 'running' || backendStatus === 'starting'}
              style={{
                background: '#28a745',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: backendStatus === 'running' || backendStatus === 'starting' ? 'not-allowed' : 'pointer',
                opacity: backendStatus === 'running' || backendStatus === 'starting' ? 0.6 : 1
              }}
            >
              ▶️ Iniciar
            </button>

            <button
              onClick={stopBackend}
              disabled={backendStatus === 'stopped' || backendStatus === 'stopping'}
              style={{
                background: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: backendStatus === 'stopped' || backendStatus === 'stopping' ? 'not-allowed' : 'pointer',
                opacity: backendStatus === 'stopped' || backendStatus === 'stopping' ? 0.6 : 1
              }}
            >
              ⏹️ Detener
            </button>

            <button
              onClick={restartBackend}
              disabled={backendStatus === 'stopped'}
              style={{
                background: '#ffc107',
                color: '#212529',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: backendStatus === 'stopped' ? 'not-allowed' : 'pointer',
                opacity: backendStatus === 'stopped' ? 0.6 : 1
              }}
            >
              🔄 Reiniciar
            </button>

            <button
              onClick={checkBackendStatus}
              style={{
                background: '#17a2b8',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              🔍 Verificar
            </button>
          </div>
        </div>

        {/* Configuración */}
        <div style={{
          background: '#f8f9fa',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#495057' }}>Configuración</h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem'
          }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Puerto del Backend:
              </label>
              <input
                type="number"
                value={backendConfig.port}
                onChange={(e) => setBackendConfig(prev => ({ ...prev, port: parseInt(e.target.value) }))}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Ruta de Datos:
              </label>
              <input
                type="text"
                value={backendConfig.dataPath}
                onChange={(e) => setBackendConfig(prev => ({ ...prev, dataPath: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                <input
                  type="checkbox"
                  checked={backendConfig.autoStart}
                  onChange={(e) => setBackendConfig(prev => ({ ...prev, autoStart: e.target.checked }))}
                  style={{ marginRight: '0.5rem' }}
                />
                Inicio Automático
              </label>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                <input
                  type="checkbox"
                  checked={backendConfig.autoRestart}
                  onChange={(e) => setBackendConfig(prev => ({ ...prev, autoRestart: e.target.checked }))}
                  style={{ marginRight: '0.5rem' }}
                />
                Reinicio Automático
              </label>
            </div>
          </div>
        </div>

        {/* Gestión de Datos */}
        <div style={{
          background: '#f8f9fa',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#495057' }}>Gestión de Datos</h3>
          
          <div style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={exportData}
              disabled={!isConnected}
              style={{
                background: '#28a745',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: isConnected ? 'pointer' : 'not-allowed',
                opacity: isConnected ? 1 : 0.6
              }}
            >
              📤 Exportar Datos
            </button>

            <label style={{
              background: '#17a2b8',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: isConnected ? 'pointer' : 'not-allowed',
              opacity: isConnected ? 1 : 0.6,
              display: 'inline-block'
            }}>
              📥 Importar Datos
              <input
                type="file"
                accept=".json"
                onChange={importData}
                disabled={!isConnected}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>

        {/* Logs */}
        <div style={{
          background: '#f8f9fa',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#495057' }}>Logs del Sistema</h3>
          
          <div style={{
            background: '#212529',
            color: '#f8f9fa',
            borderRadius: '8px',
            padding: '1rem',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            maxHeight: '300px',
            overflowY: 'auto'
          }}>
            {logs.length === 0 ? (
              <div style={{ color: '#6c757d', fontStyle: 'italic' }}>
                No hay logs disponibles
              </div>
            ) : (
              logs.map((log, index) => (
                <div key={index} style={{
                  marginBottom: '0.5rem',
                  color: log.type === 'error' ? '#ff6b6b' : 
                         log.type === 'warning' ? '#ffd93d' : 
                         log.type === 'success' ? '#6bcf7f' : '#f8f9fa'
                }}>
                  [{log.timestamp}] {log.message}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default BackendManagerComponent; 