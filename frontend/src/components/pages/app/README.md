# AppPage - Estructura Modular

Esta carpeta contiene la aplicación principal separada en componentes modulares para mejorar la mantenibilidad y escalabilidad.

## 🎨 **Estilo y CSS**

Todos los componentes utilizan **CSS Modules** y **variables CSS centralizadas** siguiendo las mejores prácticas del proyecto:

- ✅ **CSS Modules**: Cada componente tiene su archivo `.module.css` correspondiente
- ✅ **Variables CSS**: Uso de variables centralizadas desde `@/styles/abstracts/_variables.css`
- ✅ **Mobile First**: Diseño responsive con breakpoints definidos
- ✅ **Consistencia**: Colores, espaciados y tipografía unificados
- ✅ **Accesibilidad**: Estados focus, hover y transiciones suaves

## Archivos

### `AppPage.jsx` + `AppPage.module.css`
- **Propósito**: Componente principal que orquesta toda la aplicación
- **Responsabilidades**: 
  - Proporcionar los context providers (DoctorProvider, ViewModeProvider)
  - Manejar el estado de estadísticas
  - Renderizar el layout principal
- **Estilos**: CSS Module con variables centralizadas para el contenedor principal

### `AppHeader.jsx` + `AppHeader.module.css`
- **Propósito**: Header de la aplicación con información del usuario
- **Responsabilidades**:
  - Mostrar información del usuario logueado
  - Selector de doctor (solo para secretarias)
  - Botón de logout
- **Estilos**: CSS Module con diseño responsive, estados hover/focus y transiciones

### `AppSideMenu.jsx` + `AppSideMenu.module.css`
- **Propósito**: Menú lateral de navegación
- **Responsabilidades**:
  - Renderizar menú según el rol del usuario
  - Manejar navegación entre rutas
  - Indicar ruta activa
- **Estilos**: CSS Module con estados activos, hover y diseño responsive

### `DashboardContent.jsx` + `DashboardContent.module.css`
- **Propósito**: Contenido del dashboard según el rol
- **Responsabilidades**:
  - Renderizar estadísticas específicas por rol
  - Mostrar acciones rápidas personalizadas
  - Adaptar contenido según permisos
- **Estilos**: CSS Module con tipografía jerárquica y espaciado consistente

### `AppMenu.jsx`
- **Propósito**: Lógica de menús y utilidades
- **Responsabilidades**:
  - Definir menús por rol de usuario
  - Definir acciones rápidas por rol
  - Utilidades para obtener información del usuario
  - Funciones helper para nombres de roles
- **Estilos**: No requiere CSS Module (solo lógica y JSX)

### `index.js`
- **Propósito**: Punto de entrada y exportaciones
- **Responsabilidades**:
  - Exportar el componente principal
  - Exportar componentes individuales
  - Exportar utilidades

## Ventajas de esta estructura

1. **Separación de responsabilidades**: Cada archivo tiene una función específica
2. **Reutilización**: Los componentes pueden usarse independientemente
3. **Mantenibilidad**: Es más fácil encontrar y modificar código específico
4. **Testabilidad**: Cada componente puede testearse de forma aislada
5. **Escalabilidad**: Fácil agregar nuevas funcionalidades sin afectar el resto
6. **Consistencia visual**: CSS Modules y variables centralizadas garantizan uniformidad
7. **Responsive design**: Mobile-first con breakpoints definidos
8. **Accesibilidad**: Estados focus, hover y transiciones suaves

## Uso

```jsx
// Importar el componente principal
import AppPage from './components/pages/app';

// Importar componentes individuales
import { AppHeader, AppSideMenu } from './components/pages/app';

// Importar utilidades
import { getMenuByRole, getUserInfo } from './components/pages/app';
``` 