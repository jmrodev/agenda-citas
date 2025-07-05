-- Script para agregar el campo de número de socio de obra social
-- Ejecutar en la base de datos agenda_citas

USE agenda_citas;

-- Agregar columna para número de socio de obra social
ALTER TABLE patients 
ADD COLUMN health_insurance_member_number VARCHAR(50) AFTER health_insurance_id;

-- Agregar índice para búsquedas por número de socio
CREATE INDEX idx_patients_health_insurance_member_number ON patients (health_insurance_member_number);

-- Comentario sobre el campo
-- health_insurance_member_number: Número de socio/carnet de la obra social del paciente 