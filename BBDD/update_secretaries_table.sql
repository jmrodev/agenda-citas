-- Script para actualizar la estructura de la tabla secretaries
-- Ejecutar este script en la base de datos existente

USE agenda_citas;

-- Agregar nuevos campos a la tabla secretaries
ALTER TABLE secretaries 
ADD COLUMN name VARCHAR(100) AFTER secretary_id,
ADD COLUMN username VARCHAR(50) UNIQUE AFTER email,
ADD COLUMN password VARCHAR(255) AFTER username,
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER password,
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at;

-- Actualizar el campo name combinando first_name y last_name para registros existentes
UPDATE secretaries 
SET name = CONCAT(first_name, ' ', last_name) 
WHERE name IS NULL AND first_name IS NOT NULL AND last_name IS NOT NULL;

-- Establecer valores por defecto para campos que pueden estar vacíos
UPDATE secretaries 
SET name = 'Secretaria Sin Nombre' 
WHERE name IS NULL OR name = '';

UPDATE secretaries 
SET username = CONCAT('secretary_', secretary_id) 
WHERE username IS NULL;

UPDATE secretaries 
SET password = '$2b$10$defaultpasswordhash' 
WHERE password IS NULL;

-- Hacer el campo name NOT NULL después de poblarlo
ALTER TABLE secretaries MODIFY COLUMN name VARCHAR(100) NOT NULL;

-- Crear índices para optimización
CREATE INDEX idx_secretaries_name ON secretaries (name);
CREATE INDEX idx_secretaries_username ON secretaries (username);
CREATE INDEX idx_secretaries_email ON secretaries (email);

-- Comentario: Los campos first_name, last_name, shift, entry_time, exit_time se mantienen
-- para compatibilidad con datos existentes, pero el nuevo código usará name, username, password 