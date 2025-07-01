Medical Consultation Secretary SystemProject OverviewThis project is a comprehensive management system designed for a medical consultation secretary, streamlining the process of managing patients, doctors, appointments, prescriptions, and financial aspects related to medical office operations. It aims to provide an efficient and organized platform for medical practices.Key FeaturesUser Management: Patients, Doctors, and Secretaries with distinct roles and permissions.Appointment Management:Schedule and track appointments with various consultation types (in-office, virtual, home visit).Calendar view with monthly, weekly, and daily selections.CRUD operations primarily on the daily calendar view.Filtering appointments by doctor.Patient Management:Detailed patient records, including personal information and medical history.Tracking of overdue consultations (patients who haven't attended within a configurable time frame).Medical Records: Comprehensive medical history records for patients, including diagnoses, treatments, and prescribed medications.Prescription Management: Issue and track prescriptions, including medication details.Health Insurance Integration: Manage health insurance companies and associate them with patients and doctors (doctors can attend through specific insurance providers).Financial Tracking:Overview of doctor earnings (consultations, prescriptions).Management and tracking of facility usage payments by doctors.Partial and total financial summaries per doctor.Secretary Activity Log: Detailed log of actions performed by secretaries, providing accountability and oversight.Role-Based Access Control (RBAC): Secure access to features based on user roles (admin, secretary, doctor).Technologies UsedThis project is built with a modern and robust technology stack, prioritizing performance, scalability, and maintainability.BackendNode.js: JavaScript runtime environment.Express.js: Fast, unopinionated, minimalist web framework.Sequelize (ORM): Object-Relational Mapper for interacting with MySQL database (or raw SQL when preferred).JWT (JSON Web Tokens): For secure authentication and authorization.pnpm: Fast, disk space efficient package manager.nodemon: For automatic server restarts during development (--watch).FrontendReact: A JavaScript library for building user interfaces.Vite: Next-generation frontend tooling for a fast development experience.pnpm: For package management.React Router DOM: For declarative routing.CSS Modules: For scoped component-level styling.Global CSS Variables: Centralized styling defined in src/styles/abstracts/_variables.css.DatabaseMySQL: A powerful, open-source relational database management system.Project StructureThe project adopts a monorepo structure with clear separation of concerns between backend and frontend./your-project/
├── .pnpm-workspace.yaml
├── /backend/
│   ├── src/
│   │   ├── config/              # DB, JWT config
│   │   ├── middleware/          # Auth, permissions, error handling
│   │   ├── models/              # DB interaction (Sequelize models)
│   │   ├── services/            # Business logic
│   │   ├── controllers/         # HTTP request handling
│   │   ├── routes/              # API endpoint definitions
│   │   ├── utils/               # Utility functions
│   │   └── server.js            # Express app entry point
│   └── ...
│
├── /frontend/
│   ├── src/
│   │   ├── assets/              # Static assets
│   │   ├── styles/              # Centralized CSS (base, abstracts, components, layout, utilities)
│   │   │   └── main.css         # Main stylesheet importing others
│   │   ├── hooks/               # Custom React Hooks
│   │   ├── contexts/            # React Context API for global state
│   │   ├── services/            # API clients for backend communication
│   │   ├── utils/               # Frontend utility functions
│   │   ├── components/          # Reusable components following Atomic Design
│   │   │   ├── atoms/           # Basic HTML elements (Button, Input)
│   │   │   ├── molecules/       # Groups of atoms (AppointmentCard, CalendarHeader)
│   │   │   ├── organisms/       # Groups of molecules/atoms (AppointmentList, MonthlyCalendar)
│   │   │   ├── templates/       # Page layouts (DashboardTemplate)
│   │   │   └── pages/           # Application views
│   │   ├── router/              # React Router configuration
│   │   └── App.jsx              # Main React component
│   └── ...
Setup and InstallationPrerequisitesNode.js (LTS version recommended)pnpmMySQL Server1. Database SetupFirst, ensure your MySQL server is running. Then, execute the SQL schema to create the necessary tables and indices:SET FOREIGN_KEY_CHECKS = 0;

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
2. Backend Setup# Navigate to the backend directory
cd backend

# Install dependencies
pnpm install

# Create a .env file from the example
cp .env.example .env

# Open .env and configure your MySQL database connection string and JWT_SECRET
# Example: DATABASE_URL="mysql://user:password@host:port/database"
#          JWT_SECRET="your_very_secret_jwt_key"

# Start the backend in development mode
pnpm dev
The backend server should now be running, typically on http://localhost:3001 (or configured port).3. Frontend Setup# Navigate to the frontend directory
cd frontend

# Install dependencies
pnpm install

# Create a .env file from the example
cp .env.example .env

# Open .env and configure your backend API URL
# Example: VITE_API_BASE_URL="http://localhost:3001/api" (for development)

# Start the frontend development server
pnpm dev
The frontend application should now be running, typically on http://localhost:5173 (or configured port).DeploymentThe project is designed for deployment on Vercel.Frontend: Deploy the React/Vite application directly to Vercel. Vercel automatically detects Vite projects.Backend: Deploy the Node.js/Express application as Vercel Functions. You'll need to configure your server.js (or a dedicated api/index.js) to export the Express app for Vercel's serverless environment.Database: The MySQL database will be hosted externally (e.g., PlanetScale, AWS RDS, Google Cloud SQL). You will configure environment variables in Vercel to allow your Vercel Functions to connect to this external database.Authentication and AuthorizationJWT (JSON Web Tokens): Used for stateless authentication.Roles: admin, secretary, doctor.Admin: Full access to all functionalities.Secretary: CRUD operations on patients, appointments, prescriptions, health insurances, and secretary activities.Doctor: Access to their own appointments, patient history, and financial summaries.Backend middleware handles JWT validation and role-based access control.Project StatusThis project is currently under active development.Contributing[Optional: Add guidelines for contributing if this is an open-source project or involves multiple developers.]License[Optional: Add license information.]