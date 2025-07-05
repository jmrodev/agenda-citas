DROP DATABASE IF EXISTS agenda_citas;
CREATE DATABASE IF NOT EXISTS agenda_citas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE agenda_citas;

SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE patients (
    patient_id INT(6) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE,
    address VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    preferred_payment_methods VARCHAR(255),
    health_insurance_id INT(6) UNSIGNED,
    doctor_id INT(6) UNSIGNED,
    dni VARCHAR(20) UNIQUE,
    reference_name VARCHAR(100),
    reference_last_name VARCHAR(100),
    reference_address VARCHAR(255),
    reference_phone VARCHAR(20),
    reference_relationship VARCHAR(50),
    FOREIGN KEY (health_insurance_id) REFERENCES health_insurances(insurance_id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE doctors (
    doctor_id INT(6) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
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

CREATE TABLE secretaries (
    secretary_id INT(6) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    shift VARCHAR(20),
    entry_time TIME,
    exit_time TIME,
    email VARCHAR(100) UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE health_insurances (
    insurance_id INT(6) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    address VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(100) UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE doctor_consultation_hours (
    consultation_hour_id INT(6) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    doctor_id INT(6) UNSIGNED NOT NULL,
    day_of_week VARCHAR(15) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE appointments (
    appointment_id INT(6) UNSIGNED PRIMARY KEY,
    patient_id INT(6) UNSIGNED NOT NULL,
    doctor_id INT(6) UNSIGNED NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    reason TEXT,
    type VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    recorded_by_secretary_id INT(6) UNSIGNED,
    service_type VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50),
    payment_date DATE,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id),
    FOREIGN KEY (recorded_by_secretary_id) REFERENCES secretaries(secretary_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE prescriptions (
    prescription_id INT(6) UNSIGNED PRIMARY KEY,
    patient_id INT(6) UNSIGNED NOT NULL,
    doctor_id INT(6) UNSIGNED NOT NULL,
    date DATE NOT NULL,
    issued_by_secretary_id INT(6) UNSIGNED,
    amount DECIMAL(10, 2),
    payment_method VARCHAR(50),
    payment_date DATE,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id),
    FOREIGN KEY (issued_by_secretary_id) REFERENCES secretaries(secretary_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE prescription_medications (
    prescription_med_id INT(6) UNSIGNED PRIMARY KEY,
    prescription_id INT(6) UNSIGNED NOT NULL,
    medication_name VARCHAR(100) NOT NULL,
    dose VARCHAR(50),
    instructions TEXT,
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(prescription_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE facility_payments (
    payment_id INT(6) UNSIGNED PRIMARY KEY,
    doctor_id INT(6) UNSIGNED NOT NULL,
    payment_date DATE NOT NULL,
    payment_period VARCHAR(50),
    hours_used DECIMAL(5, 2) NOT NULL,
    hourly_rate DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    recorded_by_secretary_id INT(6) UNSIGNED,
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id),
    FOREIGN KEY (recorded_by_secretary_id) REFERENCES secretaries(secretary_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE medical_history_records (
    record_id INT(6) UNSIGNED PRIMARY KEY,
    patient_id INT(6) UNSIGNED NOT NULL,
    date DATE NOT NULL,
    attending_doctor_id INT(6) UNSIGNED NOT NULL,
    diagnosis TEXT,
    treatment TEXT,
    observations TEXT,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
    FOREIGN KEY (attending_doctor_id) REFERENCES doctors(doctor_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE medical_record_prescribed_meds (
    med_record_med_id INT(6) UNSIGNED PRIMARY KEY,
    record_id INT(6) UNSIGNED NOT NULL,
    medication_name VARCHAR(100) NOT NULL,
    dose VARCHAR(50),
    instructions TEXT,
    FOREIGN KEY (record_id) REFERENCES medical_history_records(record_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE secretary_activities (
    activity_id INT(6) UNSIGNED PRIMARY KEY,
    secretary_id INT(6) UNSIGNED NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    activity_type VARCHAR(50) NOT NULL,
    detail TEXT,
    FOREIGN KEY (secretary_id) REFERENCES secretaries(secretary_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE doctor_health_insurances (
    doctor_insurance_id INT(6) UNSIGNED PRIMARY KEY,
    doctor_id INT(6) UNSIGNED NOT NULL,
    insurance_id INT(6) UNSIGNED NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE (doctor_id, insurance_id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id),
    FOREIGN KEY (insurance_id) REFERENCES health_insurances(insurance_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de usuarios para autenticación
CREATE TABLE users (
  user_id INT(6) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL, -- admin, doctor, secretary
  entity_id INT(6) UNSIGNED, -- referencia opcional a doctor_id, secretary_id, etc.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE patient_references (
  reference_id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  patient_id INT(6) UNSIGNED NOT NULL,
  dni VARCHAR(20) NOT NULL,
  name VARCHAR(100),
  last_name VARCHAR(100),
  address VARCHAR(255),
  phone VARCHAR(20),
  relationship VARCHAR(50),
  FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
  UNIQUE (patient_id, dni)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE patient_doctors (
  patient_id INT(6) UNSIGNED NOT NULL,
  doctor_id INT(6) UNSIGNED NOT NULL,
  PRIMARY KEY (patient_id, doctor_id),
  FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE user_config (
  config_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT(6) UNSIGNED NOT NULL,
  session_timeout_minutes INT DEFAULT 15,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;

CREATE INDEX idx_patients_health_insurance_id ON patients (health_insurance_id);
CREATE INDEX idx_patients_dni ON patients (dni);
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

-- Poblar datos de prueba para obras sociales
INSERT INTO health_insurances (name, address, phone, email) VALUES
('Sanitas', 'Calle de la Salud 1, Madrid', '+34 900 123 456', 'info@sanitas.es'),
('Adeslas', 'Avenida de la Medicina 2, Barcelona', '+34 900 234 567', 'contacto@adeslas.es'),
('DKV', 'Plaza de la Seguridad 3, Valencia', '+34 900 345 678', 'atencion@dkv.es');

-- Poblar datos de prueba para doctores
INSERT INTO doctors (first_name, last_name, specialty, license_number, phone, email, consultation_fee, prescription_fee) VALUES
('Dr. Roberto', 'Hernández', 'Cardiología', 'MED001', '+34 600 111 111', 'roberto.hernandez@clinic.com', 80.00, 25.00),
('Dra. Laura', 'Díaz', 'Dermatología', 'MED002', '+34 600 222 222', 'laura.diaz@clinic.com', 75.00, 20.00),
('Dr. Francisco', 'Ruiz', 'Ortopedia', 'MED003', '+34 600 333 333', 'francisco.ruiz@clinic.com', 85.00, 30.00),
('Dra. Patricia', 'Vega', 'Ginecología', 'MED004', '+34 600 444 444', 'patricia.vega@clinic.com', 90.00, 25.00),
('Dr. Manuel', 'Torres', 'Neurología', 'MED005', '+34 600 555 555', 'manuel.torres@clinic.com', 95.00, 35.00);

-- Poblar datos de prueba para pacientes
INSERT INTO patients (first_name, last_name, date_of_birth, address, phone, email, preferred_payment_methods, health_insurance_id, dni) VALUES
('Juan', 'García', '1990-05-15', 'Calle Mayor 123, Madrid', '+34 600 123 456', 'juan.garcia@email.com', 'efectivo, tarjeta', 1, '12345678A'),
('María', 'López', '1985-08-22', 'Avenida Principal 45, Barcelona', '+34 600 234 567', 'maria.lopez@email.com', 'transferencia', 2, '23456789B'),
('Carlos', 'Martínez', '1992-03-10', 'Plaza España 67, Valencia', '+34 600 345 678', 'carlos.martinez@email.com', 'efectivo', 1, '34567890C'),
('Ana', 'Rodríguez', '1988-11-30', 'Calle Real 89, Sevilla', '+34 600 456 789', 'ana.rodriguez@email.com', 'tarjeta', 3, '45678901D'),
('Luis', 'Fernández', '1995-07-12', 'Gran Vía 12, Bilbao', '+34 600 567 890', 'luis.fernandez@email.com', 'efectivo, transferencia', 2, '56789012E'),
('Carmen', 'González', '1983-12-05', 'Calle Nueva 34, Málaga', '+34 600 678 901', 'carmen.gonzalez@email.com', 'tarjeta', 1, '67890123F'),
('Pedro', 'Pérez', '1991-04-18', 'Avenida Central 56, Zaragoza', '+34 600 789 012', 'pedro.perez@email.com', 'efectivo', 3, '78901234G'),
('Isabel', 'Sánchez', '1987-09-25', 'Plaza Mayor 78, Granada', '+34 600 890 123', 'isabel.sanchez@email.com', 'transferencia', 2, '89012345H'),
('Miguel', 'Jiménez', '1993-01-08', 'Calle Ancha 90, Alicante', '+34 600 901 234', 'miguel.jimenez@email.com', 'efectivo, tarjeta', 1, '90123456I'),
('Elena', 'Moreno', '1986-06-14', 'Avenida del Mar 23, Cádiz', '+34 600 012 345', 'elena.moreno@email.com', 'tarjeta', 3, '01234567J');

-- Asignar doctores a pacientes (relación muchos a muchos)
INSERT INTO patient_doctors (patient_id, doctor_id) VALUES
(1, 1), (1, 2),           -- Juan García tiene 2 doctores
(2, 1),                   -- María López tiene 1 doctor
(3, 3), (3, 4),           -- Carlos Martínez tiene 2 doctores
(4, 2),                   -- Ana Rodríguez tiene 1 doctor
(5, 1), (5, 3), (5, 5),   -- Luis Fernández tiene 3 doctores
(6, 4),                   -- Carmen González tiene 1 doctor
(7, 5),                   -- Pedro Pérez tiene 1 doctor
(8, 1), (8, 2),           -- Isabel Sánchez tiene 2 doctores
(9, 3),                   -- Miguel Jiménez tiene 1 doctor
(10, 4), (10, 5);         -- Elena Moreno tiene 2 doctores

-- Poblar datos de prueba para referencias de pacientes
INSERT INTO patient_references (patient_id, dni, name, last_name, address, phone, relationship) VALUES
(1, 'REF001', 'Antonio', 'García', 'Calle Mayor 123, Madrid', '+34 600 111 001', 'Padre'),
(2, 'REF002', 'Carmen', 'López', 'Avenida Principal 45, Barcelona', '+34 600 111 002', 'Madre'),
(3, 'REF003', 'Roberto', 'Martínez', 'Plaza España 67, Valencia', '+34 600 111 003', 'Hermano'),
(4, 'REF004', 'Isabel', 'Rodríguez', 'Calle Real 89, Sevilla', '+34 600 111 004', 'Hermana'),
(5, 'REF005', 'Francisco', 'Fernández', 'Gran Vía 12, Bilbao', '+34 600 111 005', 'Padre'),
(6, 'REF006', 'Ana', 'González', 'Calle Nueva 34, Málaga', '+34 600 111 006', 'Madre'),
(7, 'REF007', 'Miguel', 'Pérez', 'Avenida Central 56, Zaragoza', '+34 600 111 007', 'Hermano'),
(8, 'REF008', 'Elena', 'Sánchez', 'Plaza Mayor 78, Granada', '+34 600 111 008', 'Hermana'),
(9, 'REF009', 'Carlos', 'Jiménez', 'Calle Ancha 90, Alicante', '+34 600 111 009', 'Padre'),
(10, 'REF010', 'Patricia', 'Moreno', 'Avenida del Mar 23, Cádiz', '+34 600 111 010', 'Madre');

-- Usuario admin inicial para autenticación (password: 123456)
-- MANTENER ESTA CONTRASEÑA HASHEDA - NO CAMBIAR
INSERT INTO users (username, email, password, role, entity_id) VALUES
  ('admin', 'admin@mail.com', '$2b$10$4SK82qr1w/lcuE/hibBGdOZuV2td0KKrmCXMLsGs/RKSJGPSB3VoK', 'admin', NULL);

