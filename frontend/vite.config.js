import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3002,
    proxy: {
      '/api': 'http://localhost:3001'
    },
    // Configuraciones para prevenir bloqueos
    hmr: {
      overlay: {
        // Mostrar errores como overlay en lugar de bloquear
        errors: true,
        warnings: false
      }
    }
  },
  // Configuraciones para desarrollo
  define: {
    // Habilitar detección de bucles infinitos en desarrollo
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development')
  },
  build: {
    // Configuraciones para producción
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar React en chunks para mejor debugging
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom']
        }
      }
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js', // Opcional, para jest-dom
  },
})
