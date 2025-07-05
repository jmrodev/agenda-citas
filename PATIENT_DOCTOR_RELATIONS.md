# Gestión de Relaciones Paciente-Doctor

## Descripción General

Se ha implementado un sistema completo de gestión de relaciones muchos a muchos entre pacientes y doctores en la aplicación de agenda de citas médicas. Esta funcionalidad permite asignar múltiples doctores a un paciente y viceversa, con interfaces de usuario intuitivas y APIs RESTful robustas.

## Estructura de Base de Datos

### Tabla `patient_doctors`
```sql
CREATE TABLE patient_doctors (
  patient_id INT(6) UNSIGNED NOT NULL,
  doctor_id INT(6) UNSIGNED NOT NULL,
  PRIMARY KEY (patient_id, doctor_id),
  FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## Backend - APIs Implementadas

### Endpoints Principales

#### 1. Obtener Relaciones
- `GET /api/patient-doctors/patient/:patient_id/doctors` - Obtener doctores de un paciente
- `GET /api/patient-doctors/doctor/:doctor_id/patients` - Obtener pacientes de un doctor

#### 2. Asignar Múltiples Relaciones (Reemplazar)
- `PUT /api/patient-doctors/patient/:patient_id/doctors` - Asignar múltiples doctores a un paciente
- `PUT /api/patient-doctors/doctor/:doctor_id/patients` - Asignar múltiples pacientes a un doctor

#### 3. Agregar Relaciones Individuales
- `POST /api/patient-doctors/patient/:patient_id/doctors/:doctor_id` - Agregar un doctor a un paciente
- `POST /api/patient-doctors/doctor/:doctor_id/patients/:patient_id` - Agregar un paciente a un doctor

#### 4. Eliminar Relaciones
- `DELETE /api/patient-doctors/patient/:patient_id/doctors/:doctor_id` - Eliminar doctor de paciente
- `DELETE /api/patient-doctors/doctor/:doctor_id/patients/:patient_id` - Eliminar paciente de doctor

#### 5. Estadísticas y Búsqueda
- `GET /api/patient-doctors/stats` - Estadísticas de relaciones
- `GET /api/patient-doctors/doctor/:doctor_id/patients/search` - Buscar pacientes por doctor
- `GET /api/patient-doctors/patient/:patient_id/doctors/search` - Buscar doctores por paciente

### Ejemplos de Uso

#### Asignar múltiples doctores a un paciente
```bash
PUT /api/patient-doctors/patient/1/doctors
Content-Type: application/json
Authorization: Bearer <token>

{
  "doctor_ids": [1, 2, 3]
}
```

#### Agregar un doctor específico
```bash
POST /api/patient-doctors/patient/1/doctors/4
Authorization: Bearer <token>
```

#### Obtener doctores de un paciente
```bash
GET /api/patient-doctors/patient/1/doctors
Authorization: Bearer <token>
```

## Frontend - Componentes Implementados

### 1. PatientDoctorsList
**Ubicación:** `frontend/src/components/molecules/PatientDoctorsList/`

**Funcionalidad:**
- Muestra lista de doctores asignados a un paciente
- Permite eliminar doctores individualmente
- Incluye información detallada de cada doctor (especialidad, email)
- Estados de carga y error
- Confirmación antes de eliminar

**Props:**
- `patientId`: ID del paciente
- `onUpdate`: Callback cuando se actualiza la lista

### 2. AddDoctorToPatient
**Ubicación:** `frontend/src/components/molecules/AddDoctorToPatient/`

**Funcionalidad:**
- Selector de doctores disponibles
- Filtra doctores ya asignados
- Validación de selección
- Estados de carga y éxito/error
- Notificación al componente padre

**Props:**
- `patientId`: ID del paciente
- `currentDoctors`: Array de doctores ya asignados
- `onDoctorAdded`: Callback cuando se agrega un doctor

### 3. DoctorPatientsList
**Ubicación:** `frontend/src/components/molecules/DoctorPatientsList/`

**Funcionalidad:**
- Muestra lista de pacientes asignados a un doctor
- Permite eliminar pacientes individualmente
- Incluye información detallada de cada paciente (DNI, email, teléfono, fecha de nacimiento)
- Estados de carga y error
- Confirmación antes de eliminar

**Props:**
- `doctorId`: ID del doctor
- `onUpdate`: Callback cuando se actualiza la lista

### 4. PatientView Mejorado
**Ubicación:** `frontend/src/components/pages/patients/PatientView.jsx`

**Nuevas Funcionalidades:**
- Sección dedicada a doctores asignados
- Botón para agregar nuevos doctores
- Integración con PatientDoctorsList y AddDoctorToPatient
- Control de permisos por rol de usuario
- Información completa del paciente incluyendo doctores

## Características de Seguridad

### Autenticación y Autorización
- Todos los endpoints requieren autenticación JWT
- Control de acceso basado en roles:
  - **Admin/Secretary**: Acceso completo a todas las operaciones
  - **Doctor**: Solo puede ver sus propios pacientes
  - **Patient**: Acceso limitado a su propia información

### Validaciones
- Verificación de existencia de pacientes y doctores
- Prevención de relaciones duplicadas
- Validación de datos de entrada
- Manejo de errores robusto

### Reglas de Negocio
- Un paciente puede tener múltiples doctores
- Un doctor puede tener múltiples pacientes
- No se permiten relaciones duplicadas
- Eliminación en cascada cuando se elimina paciente o doctor

## Mejoras en Servicios Existentes

### PatientService
- Incluye doctores asignados en todas las respuestas
- Filtrado por doctor en listados
- Nueva función `getDoctorsForPatient()`

### DoctorModel
- Nuevos métodos para gestión de relaciones
- `getPatientsByDoctorId()`
- `addPatientsToDoctor()`
- `removeAllPatientsFromDoctor()`
- `getDoctorsWithPatientCount()`

## Interfaz de Usuario

### Vista de Paciente
- Sección "Doctores Asignados" con lista completa
- Botón "Agregar Doctor" para admin/secretary
- Información detallada de cada doctor
- Acciones para eliminar doctores

### Responsive Design
- Adaptación para dispositivos móviles
- Layout flexible y accesible
- Estados de carga y error claros

## Archivos de Prueba

### patient-doctors.http
Archivo completo con ejemplos de todas las APIs implementadas, incluyendo:
- Casos de uso normales
- Pruebas de validación
- Manejo de errores
- Autenticación

## Instalación y Uso

### 1. Base de Datos
La tabla `patient_doctors` ya está creada en el esquema principal.

### 2. Backend
Los nuevos archivos se han agregado al proyecto:
- `backend/services/patientDoctorService.js`
- `backend/controllers/patientDoctorController.js`
- `backend/routes/patientDoctorRoutes.js`

### 3. Frontend
Los nuevos componentes están disponibles:
- `PatientDoctorsList`
- `AddDoctorToPatient`
- `DoctorPatientsList`

### 4. Pruebas
Usar el archivo `http/patient-doctors.http` para probar todas las funcionalidades.

## Consideraciones Futuras

### Posibles Mejoras
1. **Historial de Cambios**: Registrar cuándo se agregaron/eliminaron relaciones
2. **Notificaciones**: Alertar a doctores cuando se les asigna un nuevo paciente
3. **Filtros Avanzados**: Búsqueda por especialidad, fecha de asignación, etc.
4. **Reportes**: Estadísticas detalladas de relaciones
5. **Importación Masiva**: Asignar múltiples relaciones desde archivos CSV

### Escalabilidad
- La estructura actual soporta miles de relaciones
- Índices optimizados para consultas frecuentes
- Paginación en listados grandes
- Cache para consultas frecuentes

## Conclusión

La implementación proporciona una solución completa y robusta para la gestión de relaciones paciente-doctor, con interfaces intuitivas y APIs bien diseñadas. El sistema es escalable, seguro y fácil de mantener, siguiendo las mejores prácticas de desarrollo web moderno. 