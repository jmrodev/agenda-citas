-- Script para agregar columnas necesarias para los reportes y actualizar datos antiguos

-- 1. Agrega 'created_at' a la tabla patients si no existe
ALTER TABLE patients
  ADD COLUMN IF NOT EXISTS created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- 2. Inicializa los valores antiguos de created_at (opcional, si quieres una fecha fija para registros previos)
UPDATE patients SET created_at = '2023-01-01 00:00:00' WHERE created_at IS NULL OR created_at = '';

-- 3. Agrega 'status' a la tabla facility_payments si no existe
ALTER TABLE facility_payments
  ADD COLUMN IF NOT EXISTS status VARCHAR(32) NOT NULL DEFAULT 'COMPLETADO';

-- 4. Inicializa los valores antiguos de status (opcional, si todos deben ser completados)
UPDATE facility_payments SET status = 'COMPLETADO' WHERE status IS NULL OR status = '';

-- NOTA: IF NOT EXISTS solo es soportado en MariaDB 10.2+ y MySQL 8.0+.
-- Si tu versión no lo soporta, ejecuta DESCRIBE antes y luego el ALTER TABLE manualmente.

-- (Opcional) Si necesitas registrar actualizaciones, puedes agregar:
-- ALTER TABLE patients ADD COLUMN updated_at DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP; 