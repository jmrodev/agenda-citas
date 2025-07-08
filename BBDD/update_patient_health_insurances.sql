-- ========================================
-- ACTUALIZACIÓN PARA MÚLTIPLES OBRAS SOCIALES POR PACIENTE
-- ========================================

USE agenda_citas;

-- 1. Crear tabla intermedia para relación paciente-obras sociales
CREATE TABLE patient_health_insurances (
    patient_insurance_id INT(6) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    patient_id INT(6) UNSIGNED NOT NULL,
    insurance_id INT(6) UNSIGNED NOT NULL,
    member_number VARCHAR(50), -- Número de socio/carnet de la obra social
    is_primary BOOLEAN DEFAULT FALSE, -- Indica si es la obra social principal
    is_active BOOLEAN DEFAULT TRUE, -- Indica si la relación está activa
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_patient_insurance (patient_id, insurance_id),
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (insurance_id) REFERENCES health_insurances(insurance_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Migrar datos existentes de la tabla patients a la nueva tabla
INSERT INTO patient_health_insurances (patient_id, insurance_id, member_number, is_primary, is_active)
SELECT 
    patient_id, 
    health_insurance_id, 
    health_insurance_member_number, 
    TRUE, -- Marcar como principal
    TRUE  -- Marcar como activa
FROM patients 
WHERE health_insurance_id IS NOT NULL;

-- 3. Crear índices para optimizar consultas
CREATE INDEX idx_patient_health_insurances_patient_id ON patient_health_insurances (patient_id);
CREATE INDEX idx_patient_health_insurances_insurance_id ON patient_health_insurances (insurance_id);
CREATE INDEX idx_patient_health_insurances_is_primary ON patient_health_insurances (is_primary);
CREATE INDEX idx_patient_health_insurances_is_active ON patient_health_insurances (is_active);

-- 4. Verificar la migración
SELECT 
    'Pacientes con obra social en tabla original' as description,
    COUNT(*) as count
FROM patients 
WHERE health_insurance_id IS NOT NULL
UNION ALL
SELECT 
    'Pacientes con obra social en nueva tabla' as description,
    COUNT(*) as count
FROM patient_health_insurances 
WHERE is_active = TRUE;

-- 5. Mostrar algunos ejemplos de la migración
SELECT 
    p.patient_id,
    p.first_name,
    p.last_name,
    p.health_insurance_id as original_insurance_id,
    p.health_insurance_member_number as original_member_number,
    phi.insurance_id as new_insurance_id,
    phi.member_number as new_member_number,
    phi.is_primary,
    phi.is_active
FROM patients p
LEFT JOIN patient_health_insurances phi ON p.patient_id = phi.patient_id
WHERE p.health_insurance_id IS NOT NULL
LIMIT 10; 