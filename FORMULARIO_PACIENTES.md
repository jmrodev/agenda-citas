# Formulario de Pacientes - Agenda de Citas

## Descripción

Se ha completado el flujo completo para agregar nuevos pacientes en el frontend de la aplicación de agenda de citas. El formulario incluye todos los campos necesarios según la estructura de la base de datos y permite crear pacientes con información completa.

## Características Implementadas

### ✅ Campos del Formulario

#### Información Personal
- **Nombre** (requerido): Solo letras, mínimo 2 caracteres
- **Apellido** (requerido): Solo letras, mínimo 2 caracteres
- **DNI**: Validación de formato (7-8 dígitos)
- **Fecha de Nacimiento**: Validación de fecha
- **Email**: Validación de formato de email
- **Teléfono**: Validación de formato de teléfono
- **Dirección**: Máximo 255 caracteres

#### Información Médica
- **Obra Social**: Selector con lista de obras sociales disponibles
- **Métodos de Pago Preferidos**: Checkboxes para seleccionar múltiples métodos (Efectivo, Débito, Crédito, Transferencia)
- **Doctores Asignados**: Lista de checkboxes con doctores disponibles

#### Persona de Referencia
- **Nombre**: Solo letras
- **Apellido**: Solo letras
- **Teléfono**: Validación de formato
- **Relación**: Campo de texto libre
- **Dirección**: Máximo 255 caracteres

### ✅ Validaciones

- **Validación en tiempo real**: Los campos se validan al perder el foco
- **Validación de envío**: Se validan todos los campos antes de enviar
- **Mensajes de error**: Errores específicos por campo
- **Sanitización**: Los datos se limpian antes de enviar al backend

### ✅ Integración con Backend

- **Servicios creados**:
  - `patientService.js`: Manejo de pacientes
  - `doctorService.js`: Manejo de doctores
  - `healthInsuranceService.js`: Manejo de obras sociales

- **Endpoints utilizados**:
  - `POST /api/patients`: Crear paciente
  - `GET /api/doctors`: Obtener doctores
  - `GET /api/health-insurances`: Obtener obras sociales

### ✅ Componentes Creados/Actualizados

1. **PatientForm.jsx**: Formulario principal con lógica de envío
2. **PatientFormFields.jsx**: Campos del formulario con validaciones
3. **PatientFormModal.jsx**: Modal para mostrar el formulario
4. **PatientsList.jsx**: Lista de pacientes con botón "Nuevo Paciente"

### ✅ Estilos y UX

- **Diseño responsive**: Se adapta a diferentes tamaños de pantalla
- **Secciones organizadas**: Información agrupada lógicamente
- **Estados de carga**: Indicadores de carga mientras se obtienen datos
- **Mensajes de éxito/error**: Feedback claro al usuario
- **Reset automático**: El formulario se resetea después de crear exitosamente

## Cómo Usar

### 1. Acceder al Formulario

1. Ir a la sección "Pacientes" en el menú
2. Hacer clic en el botón "Nuevo Paciente"
3. Se abrirá un modal con el formulario completo

### 2. Llenar el Formulario

1. **Información Personal** (obligatoria):
   - Nombre y apellido (requeridos)
   - DNI, fecha de nacimiento, email, teléfono, dirección (opcionales)

2. **Información Médica**:
   - Seleccionar obra social (opcional)
   - Especificar métodos de pago preferidos
   - Seleccionar al menos un doctor (requerido)

3. **Persona de Referencia** (opcional):
   - Completar datos de contacto de emergencia

### 3. Enviar el Formulario

1. Verificar que todos los campos requeridos estén completos
2. Hacer clic en "Guardar Paciente"
3. El sistema validará y enviará los datos
4. Se mostrará un mensaje de éxito o error
5. El formulario se reseteará automáticamente

## Estructura de Datos

### Datos Enviados al Backend

```javascript
{
  "first_name": "Juan Carlos",
  "last_name": "González",
  "email": "juan.gonzalez@email.com",
  "phone": "1234567890",
  "dni": "12345678",
  "date_of_birth": "1990-05-15",
  "address": "Av. San Martín 123, Buenos Aires",
  "preferred_payment_methods": "efectivo, tarjeta",
  "health_insurance_id": 1,
  "doctor_ids": [1, 2],
  "reference_person": {
    "name": "María",
    "last_name": "González",
    "phone": "0987654321",
    "relationship": "Esposa",
    "address": "Av. San Martín 123, Buenos Aires"
  }
}
```

## Archivos de Prueba

Se ha creado el archivo `http/test-patient-form.http` con ejemplos de peticiones para probar:

- Login como admin
- Crear un nuevo paciente
- Obtener lista de pacientes
- Obtener doctores disponibles
- Obtener obras sociales disponibles

## Notas Técnicas

### Validaciones Implementadas

- **Nombre/Apellido**: Solo letras, mínimo 2 caracteres
- **Email**: Formato válido de email
- **Teléfono**: Formato de teléfono argentino
- **DNI**: 7-8 dígitos numéricos
- **Fecha**: Formato YYYY-MM-DD
- **Doctores**: Al menos uno seleccionado
- **Campos de texto**: Límites de caracteres según la base de datos

### Manejo de Errores

- **Errores de validación**: Mostrados por campo
- **Errores de red**: Mensajes genéricos de error
- **Errores del backend**: Mensajes específicos del servidor
- **Estados de carga**: Indicadores durante operaciones

### Seguridad

- **Sanitización**: Los datos se limpian antes de enviar
- **Autenticación**: Todas las peticiones incluyen token JWT
- **Autorización**: Solo usuarios autorizados pueden crear pacientes
- **Validación**: Doble validación (frontend y backend)

## Próximos Pasos

1. **Edición de pacientes**: Implementar formulario de edición
2. **Vista detallada**: Página de detalles del paciente
3. **Historial médico**: Integración con historial médico
4. **Citas**: Asociación con citas médicas
5. **Reportes**: Generación de reportes de pacientes

## Credenciales de Prueba

- **Admin**: admin / Admin1234
- **Secretaria**: ana_garcia / Admin1234
- **Doctor**: roberto_hernandez / Admin1234

## URLs de Acceso

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **Pacientes**: http://localhost:3000/desktop/patients 