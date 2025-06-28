# 📅 Agenda de Citas

Una aplicación moderna y elegante para gestionar citas y eventos, construida con React y Node.js.

## ✨ Características

- **Calendario interactivo** con vista mensual, semanal y diaria
- **Navegación inteligente** entre vistas de mes y día
- **Vista detallada del día** con slots de hora
- **Edición completa de citas** (editar, eliminar, mover)
- **Persistencia de datos** usando localStorage y archivo JSON con backend
- **Estadísticas en tiempo real** de citas
- **Diseño moderno** con gradientes y animaciones
- **Modal intuitivo** para crear y editar citas
- **Responsive design** para todos los dispositivos
- **Backend REST API** para persistencia de datos

## 🚀 Instalación y Configuración

### Prerrequisitos
- **Node.js** (versión 14 o superior)
- **npm** o **yarn**
- **Git** (para clonar el repositorio)

### Instalación Rápida

```bash
# Clonar el repositorio
git clone <tu-repositorio>
cd agenda-citas
npm install
```

### Iniciar la aplicación

```bash
node start-app.js
```
Esto:
- Limpia procesos previos.
- Inicia backend y frontend.
- Abre el navegador automáticamente.

### Acceso directo desde el escritorio (Linux)
- Crea el archivo `agenda-citas.desktop` con este contenido (ajusta la ruta):
  ```ini
  [Desktop Entry]
  Name=Agenda de Citas
  Comment=Gestor de turnos médicos
  Exec=node /ruta/completa/a/agenda-citas/start-app.js
  Icon=/ruta/completa/a/agenda-citas/public/favicon.ico
  Terminal=true
  Type=Application
  Categories=Utility;
  ```
- Hazlo ejecutable:
  ```bash
  chmod +x agenda-citas.desktop
  ```
- Mueve a tu escritorio o menú de aplicaciones para acceso rápido.

---

## Notas
- El script `start-app.js` es el único necesario para iniciar la app.
- Los scripts antiguos de setup y bash han sido eliminados para simplificar el uso.
- Si tienes dudas, revisa los mensajes en la terminal al iniciar la app.

## 🎯 Cómo Usar la Aplicación

### 1. **Navegación Principal**

La aplicación tiene tres vistas principales:

#### 📅 **Vista Calendario** (Página Principal)
- **Vista mensual** con todas las citas del mes
- **Hacer clic en un día** para ir a la vista detallada
- **Navegación entre meses** con botones de flecha
- **Indicadores visuales** para días con citas

#### 📊 **Vista Estadísticas**
- **Total de citas** en el sistema
- **Citas de hoy** (día actual)
- **Citas de esta semana** (semana actual)
- **Citas de este mes** (mes actual)
- **Próxima cita** programada

#### 🗂️ **Gestión de Datos**
- **Exportar citas** a JSON
- **Importar citas** desde archivo
- **Limpiar datos** del sistema

### 2. **Crear una Cita**

#### Desde Vista Mensual:
1. **Haz clic en un día** del calendario
2. **Se abrirá la vista diaria** de ese día
3. **Haz clic en un horario vacío** (8:00 AM - 8:00 PM)
4. **Completa el formulario** en el modal:
   - Nombre de la cita
   - Fecha y hora
   - Duración (por defecto 1 hora)
5. **Guarda la cita**

#### Desde Vista Diaria:
1. **Haz clic directamente** en un slot de hora
2. **Completa el formulario**
3. **Guarda la cita**

### 3. **Editar una Cita**

1. **Haz clic en una cita existente** (en cualquier vista)
2. **Se abrirá el modal** con los datos actuales
3. **Modifica los campos** que necesites
4. **Guarda los cambios**

### 4. **Opciones Avanzadas**

En el modal de edición tienes tres opciones:

#### ✏️ **Editar Cita**
- Modificar nombre, fecha y hora
- Mantener el ID original

#### 📅 **Mover Cita**
- Cambiar fecha y hora completamente
- Útil para reprogramar citas

#### 🗑️ **Eliminar Cita**
- Eliminar permanentemente la cita
- Requiere confirmación

### 5. **Vista Diaria Detallada**

- **Slots de hora** de 8:00 AM a 8:00 PM
- **Citas organizadas** por hora
- **Indicadores de estado**:
  - 🟢 **Disponible**: Hora libre
  - 🔴 **Ocupado**: Cita programada
  - ⚫ **Pasado**: Hora ya transcurrió

## 🛠️ Scripts Disponibles

```bash
# Iniciar la aplicación completa (frontend + backend)
node start-app.js
```

# Otros scripts antiguos han sido eliminados para simplificar el uso.

## 📁 Estructura del Proyecto

```
agenda-citas/
├── public/
│   ├── citas.json          # Archivo JSON para persistencia
│   ├── pacientes.json      # Archivo JSON para pacientes
│   └── index.html          # HTML principal
├── src/
│   ├── components/
│   │   ├── CalendarComponent.js    # Componente principal del calendario
│   │   ├── CitaModal.js           # Modal para crear/editar citas
│   │   ├── StatsComponent.js      # Componente de estadísticas
│   │   ├── DayViewComponent.js    # Vista detallada del día
│   │   ├── NavigationComponent.js # Navegación entre páginas
│   │   └── DataManagementComponent.js # Gestión de datos
│   ├── services/
│   │   └── citasService.js        # Servicio para persistencia de datos
│   ├── App.js                     # Componente principal
│   └── App.css                    # Estilos principales
├── server.js                      # Servidor backend Express
├── start-app.js                   # Script oficial de inicio (Node.js)
├── package.json                   # Dependencias y scripts
└── README.md                      # Este archivo
```

## 🔧 Configuración del Backend

### Endpoints API Disponibles

#### Citas
- `GET /api/citas` - Obtener todas las citas
- `POST /api/citas` - Guardar todas las citas
- `POST /api/citas/agregar` - Agregar una nueva cita
- `PUT /api/citas/:id` - Actualizar una cita
- `DELETE /api/citas/:id` - Eliminar una cita

#### Pacientes
- `GET /api/pacientes` - Obtener todos los pacientes
- `POST /api/pacientes` - Guardar todos los pacientes
- `POST /api/pacientes/agregar` - Agregar un nuevo paciente
- `PUT /api/pacientes/:id` - Actualizar un paciente
- `DELETE /api/pacientes/:id` - Eliminar un paciente

### Archivos de Datos
- `public/citas.json` - Almacena todas las citas
- `public/pacientes.json` - Almacena información de pacientes

## 💾 Sistema de Persistencia

### 1. **localStorage** (Frontend)
- **Datos en el navegador** del usuario
- **Persistencia entre sesiones**
- **Acceso rápido** y confiable
- **Respaldo automático** de datos

### 2. **Archivo JSON** (Backend)
- **Persistencia en servidor**
- **Datos compartidos** entre usuarios
- **Fácil exportación/importación**
- **Respaldo de seguridad**

### 3. **Sincronización**
- **Datos sincronizados** entre frontend y backend
- **Fallback automático** si el servidor no está disponible
- **Consistencia de datos** garantizada

## 🎨 Personalización

### Colores y Estilos
Los colores principales se pueden modificar en `src/App.css`:

```css
/* Gradiente principal */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Colores de estadísticas */
--stats-green: #10b981;
--stats-yellow: #f59e0b;
--stats-red: #ef4444;
```

### Configuración del Servidor
Modificar `server.js` para cambiar:
- **Puerto del servidor** (por defecto 3001)
- **Rutas de archivos** de datos
- **Configuración CORS**
- **Middleware adicional**

## 🚨 Solución de Problemas

### Error: "Puerto 3000/3001 en uso"
```bash
# Terminar procesos en puertos
sudo lsof -ti:3000 | xargs kill -9
sudo lsof -ti:3001 | xargs kill -9

# O usar el launcher que lo hace automáticamente
node launcher.js
```

### Error: "Module not found"
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error: "Cannot read property of undefined"
- **Verificar** que el servidor backend esté corriendo
- **Comprobar** que los archivos JSON existan
- **Revisar** la consola del navegador para errores

### La aplicación no se abre automáticamente
```bash
# Abrir manualmente en el navegador
http://localhost:3000
```

## 📱 Compatibilidad

### Navegadores Soportados
- ✅ **Chrome** (recomendado)
- ✅ **Firefox**
- ✅ **Safari**
- ✅ **Edge**

### Sistemas Operativos
- ✅ **Windows**
- ✅ **macOS**
- ✅ **Linux** (Manjaro, Ubuntu, etc.)

### Dispositivos
- ✅ **Desktop** - Vista completa
- ✅ **Tablet** - Diseño adaptativo
- ✅ **Mobile** - Interfaz táctil

## 🔒 Seguridad

### Consideraciones
- **Datos locales** en el navegador del usuario
- **Sin autenticación** (aplicación de demostración)
- **Archivos JSON** accesibles públicamente
- **CORS habilitado** para desarrollo

### Para Producción
- Implementar **autenticación de usuarios**
- Usar **base de datos** en lugar de archivos JSON
- Configurar **HTTPS**
- Implementar **validación de datos**

## 📊 Estructura de Datos

### Formato de Citas
```json
{
  "citas": [
    {
      "id": "unique-id",
      "title": "Nombre de la cita",
      "start": "2024-01-01T10:00:00.000Z",
      "end": "2024-01-01T11:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Formato de Pacientes
```json
{
  "pacientes": [
    {
      "id": "unique-id",
      "nombre": "Nombre del paciente",
      "email": "email@ejemplo.com",
      "telefono": "123456789",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## 🎯 Contribuir

1. **Fork** el repositorio
2. **Crea** una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Crea** un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. **Revisa** la sección de solución de problemas
2. **Consulta** los logs del servidor
3. **Verifica** la consola del navegador
4. **Abre un issue** en el repositorio

---

**¡Disfruta gestionando tus citas de manera eficiente! 🎉**
