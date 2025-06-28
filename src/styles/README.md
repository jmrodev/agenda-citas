# 🎨 Estructura CSS Modular

Esta aplicación utiliza un sistema CSS modular con soporte para modo oscuro y variables CSS personalizadas.

## 📁 Estructura de Archivos

```
src/styles/
├── main.css                    # Archivo principal que importa todo
├── utils/
│   ├── variables.css           # Variables CSS (colores, espaciado, etc.)
│   └── utilities.css           # Clases helper (flexbox, espaciado, etc.)
├── components/
│   ├── calendar.css            # Estilos específicos del calendario
│   ├── modal.css               # Estilos del modal
│   ├── navigation.css          # Estilos de navegación y header
│   └── aside.css               # Estilos del aside lateral
└── README.md                   # Esta documentación
```

## 🎯 Enfoque Modular

### 1. **Variables CSS (variables.css)**
- **Colores**: Definidos para modo claro y oscuro
- **Espaciado**: Sistema consistente de márgenes y padding
- **Tipografía**: Tamaños de fuente y familias
- **Sombras**: Diferentes niveles de sombra
- **Transiciones**: Duración y timing de animaciones

### 2. **Utilidades CSS (utilities.css)**
- **Clases helper**: `.d-flex`, `.justify-center`, `.p-3`, etc.
- **Sistema de espaciado**: `.m-1`, `.p-2`, `.mt-3`, etc.
- **Colores de texto**: `.text-primary`, `.text-success`, etc.
- **Responsive**: Clases específicas para móvil

### 3. **Componentes Específicos**
- **calendar.css**: Estilos para react-big-calendar
- **modal.css**: Estilos para react-modal
- **navigation.css**: Header, alertas y selector de tema
- **aside.css**: Aside lateral con información y acciones rápidas

## 🌙 Modo Oscuro

### Implementación
```css
/* Variables para modo claro */
:root {
  --bg-primary: #ffffff;
  --text-primary: #2c3e50;
}

/* Variables para modo oscuro */
[data-theme="dark"] {
  --bg-primary: #1e293b;
  --text-primary: #f1f5f9;
}
```

### Cambio de Tema
```javascript
// Cambiar a modo oscuro
document.documentElement.setAttribute('data-theme', 'dark');

// Cambiar a modo claro
document.documentElement.setAttribute('data-theme', 'light');
```

## 🎨 Variables Principales

### Colores
```css
--primary-color: #667eea;
--secondary-color: #764ba2;
--success-color: #10b981;
--warning-color: #f59e0b;
--error-color: #ef4444;
```

### Espaciado
```css
--spacing-xs: 0.25rem;   /* 4px */
--spacing-sm: 0.5rem;    /* 8px */
--spacing-md: 1rem;      /* 16px */
--spacing-lg: 1.5rem;    /* 24px */
--spacing-xl: 2rem;      /* 32px */
```

### Tipografía
```css
--font-size-xs: 0.75rem;   /* 12px */
--font-size-sm: 0.875rem;  /* 14px */
--font-size-base: 1rem;    /* 16px */
--font-size-lg: 1.125rem;  /* 18px */
--font-size-xl: 1.25rem;   /* 20px */
```

## 🛠️ Clases Utilitarias

### Flexbox
```css
.d-flex { display: flex; }
.flex-column { flex-direction: column; }
.justify-center { justify-content: center; }
.align-center { align-items: center; }
```

### Espaciado
```css
.m-3 { margin: 1rem; }
.p-2 { padding: 0.5rem; }
.mt-4 { margin-top: 1.5rem; }
.pb-1 { padding-bottom: 0.25rem; }
```

### Colores
```css
.text-primary { color: var(--text-primary); }
.bg-secondary { background-color: var(--bg-secondary); }
.text-success { color: var(--success-color); }
```

## �� Responsive Design

### Breakpoints
```css
@media (max-width: 768px) {
  /* Estilos para móvil */
  .d-md-none { display: none; }
  .text-md-center { text-align: center; }
}
```

### Clases Responsive
- `.d-md-none`: Ocultar en móvil
- `.d-md-flex`: Mostrar como flex en móvil
- `.p-md-0`: Sin padding en móvil

## 🎯 Layout de la Aplicación

### Estructura Principal
```jsx
<div className="app-container">
  <header className="app-header">
    {/* Header con título, botón agendar cita y alertas */}
  </header>
  
  <div className="d-flex min-h-100vh">
    <aside className="app-aside">
      {/* Aside lateral con información y acciones */}
    </aside>
    
    <main className="app-main">
      {/* Contenido principal */}
    </main>
  </div>
</div>
```

### Header Principal
El header incluye:

#### **📋 Información Principal**
- Título: "Sistema de Gestión"
- Subtítulo: "Gestiona citas y pacientes de manera profesional"

#### **📅 Botón Agendar Cita**
- Botón prominente que lleva directamente a la vista de día
- Permite agendar una nueva cita rápidamente

#### **⚠️ Alertas de Asistencia Tardía**
- Muestra el número de pacientes con asistencia tardía
- Botón "Ver" que lleva a la página de pacientes
- Animación de pulso en el ícono de advertencia

#### **🖥️ Estado del Servidor**
- Indicador visual del estado de conexión
- Colores: Verde (conectado), Amarillo (verificando), Rojo (desconectado)

### Aside Lateral
El aside incluye las siguientes secciones en orden:

#### **⚡ Acciones Rápidas** (Sección Superior)
- **Navegación Principal:**
  - 📅 Ver Calendario
  - 📊 Ver Estadísticas
  - 💾 Gestionar Datos
  
- **👥 Pacientes** (Subsección con divisor)
  - Ver Todos los Pacientes
  - Agregar Nuevo Paciente

#### **⏰ Próxima Cita**
- Muestra la próxima cita programada
- Fecha y hora formateada
- Botón para ver en calendario
- Si no hay citas, muestra opción para programar

#### **📊 Información**
- Total de citas en el sistema
- Citas de hoy
- Citas de esta semana

## 🔧 Cómo Usar

### 1. Importar en Componentes
```javascript
import '../styles/main.css';
```

### 2. Usar Clases Utilitarias
```jsx
<div className="d-flex justify-center align-center p-3">
  <h1 className="text-primary font-bold">Título</h1>
</div>
```

### 3. Usar Variables CSS
```css
.mi-componente {
  background: var(--bg-primary);
  color: var(--text-primary);
  padding: var(--spacing-md);
}
```

## 🎯 Ventajas del Sistema

### ✅ **Consistencia**
- Variables centralizadas para colores y espaciado
- Sistema de diseño unificado

### ✅ **Mantenibilidad**
- Cambios globales desde un solo archivo
- Estructura modular y organizada

### ✅ **Modo Oscuro**
- Transición suave entre temas
- Colores optimizados para cada modo

### ✅ **Responsive**
- Clases específicas para móvil
- Breakpoints consistentes

### ✅ **Performance**
- CSS optimizado y modular
- Solo se carga lo necesario

## 🚀 Agregar Nuevos Componentes

### 1. Crear archivo CSS
```css
/* src/styles/components/mi-componente.css */
.mi-componente {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
}
```

### 2. Importar en main.css
```css
@import './components/mi-componente.css';
```

### 3. Usar en componente
```jsx
import React from 'react';
import '../styles/main.css';

const MiComponente = () => {
  return <div className="mi-componente">Contenido</div>;
};
```

## 🎨 Personalización

### Cambiar Colores
Edita `variables.css`:
```css
:root {
  --primary-color: #tu-color;
  --secondary-color: #tu-color-secundario;
}
```

### Agregar Nuevas Utilidades
Edita `utilities.css`:
```css
.mi-utilidad {
  /* tus estilos */
}
```

### Modificar Breakpoints
Cambia los media queries en los archivos correspondientes.

## 📱 Responsive del Header

### Desktop (>1024px)
- Header con layout horizontal
- Botón agendar cita prominente
- Alertas y estado del servidor visibles

### Tablet (768px - 1024px)
- Elementos más compactos
- Texto más pequeño
- Mantiene funcionalidad completa

### Mobile (<768px)
- Layout vertical
- Botón agendar cita a ancho completo
- Alertas apiladas verticalmente

## 📱 Responsive del Aside

### Desktop (>1024px)
- Aside fijo a la izquierda
- Ancho de 280px
- Todas las secciones visibles

### Tablet (768px - 1024px)
- Aside más compacto (250px)
- Texto más pequeño
- Mantiene funcionalidad completa

### Mobile (<768px)
- Aside oculto por defecto
- Se puede mostrar con botón de menú
- Overlay sobre el contenido principal

## 🎨 Elementos Específicos del Header

### Botón Agendar Cita
```css
.btn-lg {
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-size-base);
  font-weight: 600;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
}
```

### Alertas de Asistencia Tardía
```css
.alert-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: var(--bg-secondary);
  border: 1px solid var(--warning-color);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
}

.alert-icon {
  animation: pulse 2s infinite;
}
```

### Divisor de Acciones Rápidas
```css
.actions-divider {
  position: relative;
  text-align: center;
  margin: var(--spacing-md) 0;
}

.actions-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--border-color);
  z-index: 1;
}

.divider-text {
  background: var(--bg-overlay);
  padding: 0 var(--spacing-sm);
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-secondary);
  position: relative;
  z-index: 2;
}
```

### Próxima Cita
```css
.proxima-cita {
  background: var(--bg-secondary);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
}
```

### Botones de Acción
```css
.btn-warning {
  background: var(--warning-color);
  color: var(--text-inverse);
}
```

---

**¡Este sistema te permite mantener un código CSS limpio, organizado y fácil de mantener!** 🎉 