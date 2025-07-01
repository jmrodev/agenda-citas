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
    reference_name VARCHAR(100),
    reference_last_name VARCHAR(100),
    reference_address VARCHAR(255),
    reference_phone VARCHAR(20),
    reference_relationship VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE doctors (
    doctor_id INT(6) UNSIGNED PRIMARY KEY,
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
    secretary_id INT(6) UNSIGNED PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    shift VARCHAR(20),
    entry_time TIME,
    exit_time TIME,
    email VARCHAR(100) UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE health_insurances (
    insurance_id INT(6) UNSIGNED PRIMARY KEY,
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

SET FOREIGN_KEY_CHECKS = 1;

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

INSERT INTO patients (patient_id, first_name, last_name, date_of_birth, address, phone, email, preferred_payment_methods, health_insurance_id, reference_name, reference_last_name, reference_address, reference_phone, reference_relationship) VALUES
  (100001, 'Juan', 'Pérez', '1980-01-01', 'Calle Falsa 123', '111111111', 'juan.perez@mail.com', 'efectivo', NULL, 'Juan', 'Pérez', 'Calle Falsa 123', '111111111', 'Padre'),
  (100002, 'María', 'López', '1985-07-12', 'Calle 123', '123456789', 'maria.lopez@mail.com', 'efectivo', NULL, 'María', 'López', 'Calle 123', '123456789', 'Madre'),
  (100003, 'Carlos', 'Sánchez', '1990-03-22', 'Av. Siempre Viva 742', '987654321', 'carlos.sanchez@mail.com', 'transferencia', NULL, 'Carlos', 'Sánchez', 'Av. Siempre Viva 742', '987654321', 'Hermano');

INSERT INTO doctors (doctor_id, first_name, last_name, specialty, license_number, phone, email, consultation_fee, prescription_fee, last_earnings_collection_date) VALUES
  (200001, 'Ana', 'García', 'Clínica', 'LIC123', '222333444', 'ana.garcia@mail.com', 5000.00, 2000.00, '2024-06-01'),
  (200002, 'Pedro', 'Fernández', 'Cardiología', 'LIC456', '111222333', 'pedro.fernandez@mail.com', 6000.00, 2500.00, '2024-06-01'),
  (200003, 'Lucía', 'Martínez', 'Pediatría', 'LIC789', '444555666', 'lucia.martinez@mail.com', 5500.00, 2200.00, '2024-06-10');

INSERT INTO secretaries (secretary_id, first_name, last_name, shift, entry_time, exit_time, email) VALUES
  (300001, 'Laura', 'Martínez', 'tarde', '14:00:00', '20:00:00', 'laura.martinez@mail.com'),
  (300002, 'Miguel', 'Torres', 'mañana', '08:00:00', '14:00:00', 'miguel.torres@mail.com');

INSERT INTO appointments (appointment_id, patient_id, doctor_id, date, time, reason, type, status, recorded_by_secretary_id, service_type, amount, payment_method, payment_date) VALUES
  (400001, 100001, 200001, '2024-07-01', '10:00:00', 'Control general', 'en consultorio', 'confirmada', 300001, 'consulta', 5000.00, 'efectivo', '2024-07-01'),
  (400002, 100002, 200002, '2024-07-02', '11:30:00', 'Chequeo cardiológico', 'en consultorio', 'pendiente', 300002, 'consulta', 6000.00, 'transferencia', NULL);

INSERT INTO prescriptions (prescription_id, patient_id, doctor_id, date, issued_by_secretary_id, amount, payment_method, payment_date) VALUES
  (500001, 100001, 200001, '2024-07-01', 300001, 2000.00, 'efectivo', '2024-07-01'),
  (500002, 100002, 200002, '2024-07-02', 300002, 2500.00, 'transferencia', NULL);

INSERT INTO facility_payments (payment_id, doctor_id, payment_date, payment_period, hours_used, hourly_rate, total_amount, recorded_by_secretary_id) VALUES
  (600001, 200001, '2024-07-01', 'Julio 2024', 10, 1000.00, 10000.00, 300001),
  (600002, 200002, '2024-07-02', 'Julio 2024', 8, 1200.00, 9600.00, 300002);

INSERT INTO medical_history_records (record_id, patient_id, date, attending_doctor_id, diagnosis, treatment, observations) VALUES
  (700001, 100001, '2024-07-01', 200001, 'Hipertensión', 'Medicamentos antihipertensivos', 'Controlar presión semanalmente'),
  (700002, 100002, '2024-07-02', 200002, 'Arritmia', 'Beta bloqueantes', 'Revisar en 1 mes');

INSERT INTO secretary_activities (activity_id, secretary_id, date, time, activity_type, detail) VALUES
  (800001, 300001, '2024-07-01', '09:00:00', 'registro_cita', 'Registró cita para Juan Pérez'),
  (800002, 300002, '2024-07-02', '10:30:00', 'emision_receta', 'Emitió receta para María López');

INSERT INTO health_insurances (insurance_id, name, address, phone, email) VALUES
  (900001, 'OSDE', 'Av. Salud 100', '0800123456', 'contacto@osde.com'),
  (900002, 'PAMI', 'Calle Mayor 200', '0800654321', 'info@pami.com');

INSERT INTO doctor_consultation_hours (consultation_hour_id, doctor_id, day_of_week, start_time, end_time) VALUES
  (910001, 200001, 'lunes', '09:00:00', '12:00:00'),
  (910002, 200002, 'martes', '10:00:00', '13:00:00'),
  (910003, 200003, 'miércoles', '14:00:00', '18:00:00');

INSERT INTO prescription_medications (prescription_med_id, prescription_id, medication_name, dose, instructions) VALUES
  (920001, 500001, 'Enalapril', '10mg', '1 comprimido cada 12h'),
  (920002, 500002, 'Atenolol', '50mg', '1 comprimido diario');

INSERT INTO medical_record_prescribed_meds (med_record_med_id, record_id, medication_name, dose, instructions) VALUES
  (930001, 700001, 'Losartán', '50mg', '1 comprimido diario'),
  (930002, 700002, 'Bisoprolol', '5mg', '1 comprimido cada mañana');

INSERT INTO doctor_health_insurances (doctor_insurance_id, doctor_id, insurance_id, is_active) VALUES
  (940001, 200001, 900001, TRUE),
  (940002, 200002, 900002, TRUE),
  (940003, 200003, 900001, FALSE);