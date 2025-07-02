# 🚨🚨 PRIMER USO: REGISTRO DE USUARIOS (SOLO ADMIN) 🚨🚨

> 💡 **TIP:** Para pruebas rápidas del primer uso y registro de usuarios, consulta el archivo [`http/api-firstuse.rest`](http/api-firstuse.rest).

‼️ **IMPORTANTE:** SOLO EL USUARIO CON ROL `ADMIN` PUEDE CREAR NUEVOS USUARIOS ‼️

POST /api/auth/register
Authorization: Bearer <token_admin>
Content-Type: application/json

{
  "email": "nuevo@mail.com",
  "password": "123456",
  "role": "doctor|secretary|patient",
  "entity_id": 200001
}

- 🚫 Si el usuario autenticado NO es admin, recibirá un error 403.
- ℹ️ El campo `entity_id` debe referenciar el id correspondiente (doctor_id, secretary_id, patient_id) según el rol.
- 🔑 El admin inicial se define en la base de datos con contraseña conocida (ver sección SQL de ejemplo).

---

### ✅ EJEMPLO: Crear usuario (solo admin)
POST http://localhost:3001/api/auth/register
Authorization: Bearer {{token_admin}}
Content-Type: application/json

{
  "email": "nuevo.doctor@mail.com",
  "password": "123456",
  "role": "doctor",
  "entity_id": 200001
}

### ❌ EJEMPLO: Error al crear usuario sin ser admin
POST http://localhost:3001/api/auth/register
Authorization: Bearer {{token_secretary}}
Content-Type: application/json

{
  "email": "otro@mail.com",
  "password": "123456",
  "role": "secretary",
  "entity_id": 300001
}

---

# Agenda Citas – Sistema de Secretaría Médica

Sistema integral para la gestión de consultorios médicos, centralizando la administración de pacientes, turnos, médicos, pagos, historial clínico y más. Pensado para secretarías que desean optimizar la organización diaria.

## Tabla de Contenidos

- [Características](#características)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
  - [1. Base de Datos](#1-base-de-datos)
  - [2. Backend](#2-backend)
  - [3. Frontend](#3-frontend)
- [Despliegue](#despliegue)
- [Licencia](#licencia)
- [Seguridad y Doble Verificación de Pertenencia en Endpoints](#seguridad-y-doble-verificación-de-pertenencia-en-endpoints)
- [Gestión de Personas de Referencia](#gestión-de-personas-de-referencia)
- [Actividades de secretarias (log inmutable)](#actividades-de-secretarias-log-inmutable)

---

## Características

- Registro y administración de pacientes y médicos.
- Gestión de turnos y pagos.
- Manejo de recetas, historial clínico y obras sociales.
- Backend con Node.js/Express y Sequelize.
- Frontend con React + Vite.
- Seguridad y autenticación JWT.
- Listo para deploy en Vercel.

---

## Estructura del Proyecto

```
agenda-citas/
├── backend/
│   └── src/
│       ├── config/         # Configuración DB y JWT
│       ├── middleware/     # Autenticación, permisos, errores
│       ├── models/         # Modelos Sequelize
│       ├── services/       # Lógica de negocio
│       ├── controllers/    # Manejo de solicitudes HTTP
│       ├── routes/         # Rutas API
│       ├── utils/          # Utilidades backend
│       └── server.js       # Entrada de la app Express
├── frontend/
│   └── src/
│       ├── assets/         # Recursos estáticos
│       ├── styles/         # CSS centralizado
│       ├── hooks/          # React Hooks personalizados
│       ├── contexts/       # Contextos globales
│       ├── services/       # Clientes API
│       ├── utils/          # Utilidades frontend
│       ├── components/     # Componentes Atomic Design
│       ├── router/         # Configuración React Router
│       └── App.jsx         # Componente principal
└── .pnpm-workspace.yaml
```

---

## Instalación

### Requisitos

- Node.js (versión LTS recomendada)
- pnpm
- MySQL Server

### 1. Base de Datos

Asegúrate de tener MySQL en ejecución. Ejecuta el siguiente esquema SQL para crear las tablas necesarias.  
Puedes copiar y pegar este bloque directamente en tu cliente MySQL:

```sql
-- Tabla de Pacientes
CREATE TABLE patients (
    patient_id VARCHAR(10) PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE,
    address VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    preferred_payment_methods VARCHAR(255),
    health_insurance_id VARCHAR(10)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de Médicos
CREATE TABLE doctors (
    doctor_id VARCHAR(10) PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    specialty VARCHAR(100),
    license_number VARCHAR(20) UNIQUE NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    consultation_fee DECIMAL(10, 2) NOT NULL,
    prescription_fee DECIMAL(10, 2) NOT NULL,
    last_earnings_collection_date DATE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de Secretarias
CREATE TABLE secretaries (
    secretary_id VARCHAR(10) PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    shift VARCHAR(20),
    entry_time TIME,
    exit_time TIME,
    email VARCHAR(100) UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de Obras Sociales
CREATE TABLE health_insurances (
    insurance_id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    address VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(100) UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de Horarios de Consulta del Doctor
CREATE TABLE doctor_consultation_hours (
    consultation_hour_id VARCHAR(10) PRIMARY KEY,
    doctor_id VARCHAR(10) NOT NULL,
    day_of_week VARCHAR(15) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de Citas
CREATE TABLE appointments (
    appointment_id VARCHAR(10) PRIMARY KEY,
    patient_id VARCHAR(10) NOT NULL,
    doctor_id VARCHAR(10) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    reason TEXT,
    type VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    recorded_by_secretary_id VARCHAR(10),
    service_type VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50),
    payment_date DATE,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id),
    FOREIGN KEY (recorded_by_secretary_id) REFERENCES secretaries(secretary_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de Recetas
CREATE TABLE prescriptions (
    prescription_id VARCHAR(10) PRIMARY KEY,
    patient_id VARCHAR(10) NOT NULL,
    doctor_id VARCHAR(10) NOT NULL,
    date DATE NOT NULL,
    issued_by_secretary_id VARCHAR(10),
    amount DECIMAL(10, 2),
    payment_method VARCHAR(50),
    payment_date DATE,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id),
    FOREIGN KEY (issued_by_secretary_id) REFERENCES secretaries(secretary_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de Medicamentos en Recetas (detalle de cada receta)
CREATE TABLE prescription_medications (
    prescription_med_id VARCHAR(10) PRIMARY KEY,
    prescription_id VARCHAR(10) NOT NULL,
    medication_name VARCHAR(100) NOT NULL,
    dose VARCHAR(50),
    instructions TEXT,
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(prescription_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de Pagos de Instalaciones
CREATE TABLE facility_payments (
    payment_id VARCHAR(10) PRIMARY KEY,
    doctor_id VARCHAR(10) NOT NULL,
    payment_date DATE NOT NULL,
    payment_period VARCHAR(50),
    hours_used DECIMAL(5, 2) NOT NULL,
    hourly_rate DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    recorded_by_secretary_id VARCHAR(10),
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id),
    FOREIGN KEY (recorded_by_secretary_id) REFERENCES secretaries(secretary_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de Registros de Historial Médico
CREATE TABLE medical_history_records (
    record_id VARCHAR(10) PRIMARY KEY,
    patient_id VARCHAR(10) NOT NULL,
    date DATE NOT NULL,
    attending_doctor_id VARCHAR(10) NOT NULL,
    diagnosis TEXT,
    treatment TEXT,
    observations TEXT,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (attending_doctor_id) REFERENCES doctors(doctor_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de Medicamentos Recetados en Historial Médico (detalle de cada registro de historial)
CREATE TABLE medical_record_prescribed_meds (
    med_record_med_id VARCHAR(10) PRIMARY KEY,
    record_id VARCHAR(10) NOT NULL,
    medication_name VARCHAR(100) NOT NULL,
    dose VARCHAR(50),
    instructions TEXT,
    FOREIGN KEY (record_id) REFERENCES medical_history_records(record_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de Actividades de Secretarias
CREATE TABLE secretary_activities (
    activity_id VARCHAR(10) PRIMARY KEY,
    secretary_id VARCHAR(10) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    activity_type VARCHAR(50) NOT NULL,
    detail TEXT,
    FOREIGN KEY (secretary_id) REFERENCES secretaries(secretary_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de Unión para Médicos y Obras Sociales
CREATE TABLE doctor_health_insurances (
    doctor_insurance_id VARCHAR(10) PRIMARY KEY,
    doctor_id VARCHAR(10) NOT NULL,
    insurance_id VARCHAR(10) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE (doctor_id, insurance_id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id),
    FOREIGN KEY (insurance_id) REFERENCES health_insurances(insurance_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;

-- Creación de Índices
CREATE INDEX idx_patients_health_insurance_id ON patients (health_insurance_id);
CREATE INDEX idx_appointments_patient_id ON appointments (patient_id);
CREATE INDEX idx_appointments_doctor_id ON appointments (doctor_id);
CREATE INDEX idx_appointments_recorded_by_secretary_id ON appointments (recorded_by_secretary_id);
CREATE INDEX idx_prescriptions_patient_id ON prescriptions (patient_id);
CREATE INDEX idx_prescriptions_doctor_id ON prescriptions (doctor_id);
CREATE INDEX idx_prescriptions_issued_by_secretary_id ON prescriptions (issued_by_secretary_id);
CREATE INDEX idx_prescription_meds_prescription_id ON prescription_medications (prescription_id);
CREATE INDEX idx_facility_payments_doctor_id ON facility_payments (doctor_id);
CREATE INDEX idx_facility_payments_recorded_by_secretary_id ON facility_payments (recorded_by_secretary_id);
CREATE INDEX idx_medical_history_records_patient_id ON medical_history_records (patient_id);
CREATE INDEX idx_medical_history_records_attending_doctor_id ON medical_history_records (attending_doctor_id);
CREATE INDEX idx_medical_record_prescribed_meds_record_id ON medical_record_prescribed_meds (record_id);
CREATE INDEX idx_doctor_consultation_hours_doctor_id ON doctor_consultation_hours (doctor_id);
CREATE INDEX idx_secretary_activities_secretary_id ON secretary_activities (secretary_id);
CREATE INDEX idx_doctor_health_insurances_doctor_id ON doctor_health_insurances (doctor_id);
CREATE INDEX idx_doctor_health_insurances_insurance_id ON doctor_health_insurances (insurance_id);
CREATE INDEX idx_patients_last_name ON patients (last_name);
CREATE INDEX idx_doctors_last_name ON doctors (last_name);
CREATE INDEX idx_health_insurances_name ON health_insurances (name);
CREATE INDEX idx_appointments_date_time ON appointments (date, time);
CREATE INDEX idx_appointments_type ON appointments (type);
CREATE INDEX idx_appointments_status ON appointments (status);
CREATE INDEX idx_prescriptions_date ON prescriptions (date);
CREATE INDEX idx_medical_history_records_date ON medical_history_records (date);
```

### 2. Backend

```bash
cd backend
pnpm install
cp .env.example .env
# Edita .env para configurar tu string de conexión y JWT_SECRET
# Ejemplo: DATABASE_URL="mysql://usuario:contraseña@localhost:3306/basededatos"
pnpm dev
```
El backend estará disponible por defecto en http://localhost:3001

### 3. Frontend

```bash
cd frontend
pnpm install
cp .env.example .env
# Edita .env para configurar la URL de la API backend
# Ejemplo: VITE_API_BASE_URL="http://localhost:3001/api"
pnpm dev
```
El frontend estará disponible por defecto en http://localhost:5173

---

## Despliegue

- Preparado para ser desplegado en Vercel (frontend + backend).
- Configura tus variables de entorno para producción según corresponda.

---

## Licencia

Este proyecto está bajo licencia MIT.

---

## Seguridad y Doble Verificación de Pertenencia en Endpoints

Para garantizar la integridad y seguridad de los datos, este sistema implementa el patrón de **doble verificación de pertenencia** en todas las operaciones de actualización y eliminación de entidades hijas (por ejemplo, medicamentos de recetas, personas de referencia, pagos, etc.).

### ¿Qué significa esto?

- **Siempre que modifiques o elimines un recurso hijo, la ruta requiere el ID del padre y del hijo.**
- El backend valida que el hijo realmente pertenezca al padre antes de permitir la operación.
- Esto evita accesos indebidos, errores de lógica y mejora la trazabilidad.

---

### Ejemplos de Endpoints Seguros

#### Personas de referencia de paciente

- **Actualizar persona de referencia:**
  ```
  PUT /api/patient-references/:patient_id/:reference_id
  ```
- **Eliminar persona de referencia:**
  ```
  DELETE /api/patient-references/:patient_id/:reference_id
  ```

#### Medicamentos de receta

- **Actualizar medicamento:**
  ```
  PUT /api/prescriptions/:prescription_id/medications/:med_id
  ```
- **Eliminar medicamento:**
  ```
  DELETE /api/prescriptions/:prescription_id/medications/:med_id
  ```

#### Pagos de doctor

- **Actualizar pago:**
  ```
  PUT /api/facility-payments/:doctor_id/payments/:payment_id
  ```
- **Eliminar pago:**
  ```
  DELETE /api/facility-payments/:doctor_id/payments/:payment_id
  ```

#### Medicamentos de historial médico

- **Actualizar medicamento:**
  ```
  PUT /api/medical-history/:record_id/prescribed-meds/:med_id
  ```
- **Eliminar medicamento:**
  ```
  DELETE /api/medical-history/:record_id/prescribed-meds/:med_id
  ```

---

### ¿Qué ocurre si la relación no es válida?

Si intentas modificar o eliminar un recurso hijo que **no pertenece** al padre indicado, el backend responderá con un error 404 y un mensaje claro, por ejemplo:

```json
{
  "error": "El medicamento no pertenece a la receta"
}
```

---

### Ventajas de este patrón

- **Evita errores y accesos indebidos.**
- **Mejora la seguridad y la trazabilidad.**
- **Facilita la comprensión y el mantenimiento del API.**

---

### Recomendación

Sigue este patrón para cualquier entidad hija que dependa de una entidad padre en tu sistema.  
Consulta los archivos de ejemplos HTTP (`http/api-*.rest`) para ver cómo usar estos endpoints en la práctica.

## Gestión de Personas de Referencia

Cada paciente puede tener **múltiples personas de referencia** asociadas. Estas personas pueden ser familiares, tutores, responsables, etc. y se gestionan en la tabla `patient_references`.

### Campos de una persona de referencia
- `reference_id`: ID único de la referencia
- `dni`: Documento de identidad (obligatorio y único por paciente)
- `name`: Nombre
- `last_name`: Apellido
- `address`: Dirección
- `phone`: Teléfono
- `relationship`: Relación con el paciente

### Endpoints principales
- **Agregar referencia:**
  ```
  POST /api/patient-references/:patient_id
  {
    "dni": "12345678",
    "name": "Laura",
    "last_name": "Pérez",
    "address": "Calle Nueva 123",
    "phone": "555111222",
    "relationship": "Tía"
  }
  ```
- **Listar referencias:**
  ```
  GET /api/patient-references/:patient_id
  ```
- **Actualizar referencia:**
  ```
  PUT /api/patient-references/:patient_id/:reference_id
  ```
- **Eliminar referencia:**
  ```
  DELETE /api/patient-references/:patient_id/:reference_id
  ```

### Validaciones
- No se puede agregar una persona de referencia con el mismo DNI para el mismo paciente.
- El backend responde con error 409 si se intenta.
- Todas las operaciones de actualización/eliminación requieren ambos IDs y validan pertenencia.

### Ejemplo de respuesta al consultar un paciente
```json
{
  "patient_id": 100001,
  "first_name": "Juan",
  ...,
  "reference_persons": [
    {
      "reference_id": 1,
      "dni": "12345678",
      "name": "Laura",
      "last_name": "Pérez",
      "address": "Calle Nueva 123",
      "phone": "555111222",
      "relationship": "Tía"
    }
  ]
}
```

## Actividades de secretarias (log inmutable)

Las actividades de secretarias se gestionan como un log inmutable: **solo se permite crear y listar actividades**. No es posible editar ni eliminar registros, garantizando la integridad del historial.

### Filtros disponibles en el endpoint de listado
El filtrado se realiza en el backend para eficiencia y seguridad. Se pueden usar los siguientes parámetros de query:
- `secretary_id`: filtra por secretaria
- `date`: filtra por fecha exacta (YYYY-MM-DD)
- `date_from`: filtra desde una fecha (inclusive)
- `date_to`: filtra hasta una fecha (inclusive)
- `activity_type`: filtra por tipo de actividad (uno solo)
- `activity_types`: filtra por varios tipos de actividad (separados por coma, ej: `registro_cita,emision_receta`)
- `activity_id`: filtra por ID exacto de actividad
- `detail`: busca palabra clave en el detalle de la actividad
- `time_from`: filtra desde una hora (inclusive, formato HH:MM:SS)
- `time_to`: filtra hasta una hora (inclusive, formato HH:MM:SS)

#### Ejemplos de uso:

```http
GET /api/secretary-activities?secretary_id=3&date_from=2024-06-01&date_to=2024-06-30&activity_types=registro_cita,emision_receta
Authorization: Bearer <token>
```

```http
GET /api/secretary-activities?detail=receta&time_from=08:00:00&time_to=12:00:00
Authorization: Bearer <token>
```

```http
GET /api/secretary-activities?activity_id=800001
Authorization: Bearer <token>
```

Esto permite búsquedas avanzadas y auditoría eficiente de las actividades de secretarias.

## Filtros, paginación y ordenamiento en endpoints de búsqueda avanzada

Todos los endpoints de búsqueda avanzada (filtros) soportan los siguientes parámetros adicionales:

- `limit`: cantidad máxima de resultados por página (ej: 20)
- `offset`: desde qué registro empezar (ej: 0 para la primera página, 20 para la segunda si limit=20)
- `order_by`: campo permitido por el que ordenar (ver lista por entidad)
- `order_dir`: dirección de orden ('asc' o 'desc')

### Ejemplo general:
```http
GET /api/entidad/filtros?nombre=Juan&limit=10&offset=20&order_by=apellido&order_dir=desc
Authorization: Bearer <token>
```

---

### Pacientes
- Endpoint: `/api/patients/filtros`
- Campos permitidos para `order_by`: `patient_id`, `first_name`, `last_name`, `dni`, `address`, `phone`, `email`, `date_of_birth`

### Citas médicas
- Endpoint: `/api/appointments/filtros`
- Campos permitidos para `order_by`: `appointment_id`, `patient_id`, `doctor_id`, `date`, `time`, `status`, `type`

### Recetas
- Endpoint: `/api/prescriptions/filtros`
- Campos permitidos para `order_by`: `prescription_id`, `patient_id`, `doctor_id`, `date`, `status`, `amount`

### Historial médico
- Endpoint: `/api/medical-histories/filtros`
- Campos permitidos para `order_by`: `historial_id`, `paciente_id`, `doctor_id`, `fecha`, `diagnostico`

### Personas de referencia
- Endpoint: `/api/patient-references/filtros`
- Campos permitidos para `order_by`: `reference_id`, `patient_id`, `dni`, `nombre`, `apellido`, `telefono`, `direccion`, `parentesco`

### Logs de secretarias
- Endpoint: `/api/secretary-activities`
- Campos permitidos para `order_by`: `activity_id`, `secretary_id`, `date`, `time`, `activity_type`

---

#### Ejemplo de uso con paginación y ordenamiento:
```http
GET /api/patients/filtros?nombre=Juan&limit=10&offset=0&order_by=last_name&order_dir=asc
Authorization: Bearer <token>
```

```http
GET /api/secretary-activities?activity_types=registro_cita,emision_receta&limit=5&offset=10&order_by=date&order_dir=desc
Authorization: Bearer <token>
```

Esto permite obtener resultados paginados y ordenados en todos los endpoints de búsqueda avanzada.