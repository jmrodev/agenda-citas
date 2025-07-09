-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 08-07-2025 a las 22:10:57
-- Versión del servidor: 11.8.2-MariaDB
-- Versión de PHP: 8.4.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `agenda_citas`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `appointments`
--

CREATE TABLE `appointments` (
  `appointment_id` int(6) UNSIGNED NOT NULL,
  `patient_id` int(6) UNSIGNED NOT NULL,
  `doctor_id` int(6) UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `reason` text DEFAULT NULL,
  `type` varchar(20) NOT NULL,
  `status` varchar(20) NOT NULL,
  `recorded_by_secretary_id` int(6) UNSIGNED DEFAULT NULL,
  `service_type` varchar(50) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `payment_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Volcado de datos para la tabla `appointments`
--

INSERT INTO `appointments` (`appointment_id`, `patient_id`, `doctor_id`, `date`, `time`, `reason`, `type`, `status`, `recorded_by_secretary_id`, `service_type`, `amount`, `payment_method`, `payment_date`) VALUES
(1, 1, 1, '2025-01-07', '09:00:00', 'Test appointment', 'consulta', 'pendiente', NULL, 'consulta_general', 50.00, NULL, NULL),
(2, 3, 3, '2025-07-09', '08:00:00', 'fgdsg', 'consulta', 'pendiente', NULL, 'psicologia', 44.00, 'transferencia', NULL),
(3, 2, 5, '2025-07-11', '09:30:00', 'ghkjgkh', 'seguimiento', 'pendiente', NULL, 'psicologia', 44.00, 'transferencia', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `doctors`
--

CREATE TABLE `doctors` (
  `doctor_id` int(6) UNSIGNED NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `specialty` varchar(100) DEFAULT NULL,
  `license_number` varchar(20) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `consultation_fee` decimal(10,2) NOT NULL,
  `prescription_fee` decimal(10,2) NOT NULL,
  `last_earnings_collection_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Volcado de datos para la tabla `doctors`
--

INSERT INTO `doctors` (`doctor_id`, `first_name`, `last_name`, `specialty`, `license_number`, `phone`, `email`, `consultation_fee`, `prescription_fee`, `last_earnings_collection_date`) VALUES
(1, 'Dr. Roberto', 'Hernández', 'Cardiología', 'MED001', '+34 600 111 111', 'roberto.hernandez@clinic.com', 80.00, 25.00, NULL),
(2, 'Dra. Laura', 'Díaz', 'Dermatología', 'MED002', '+34 600 222 222', 'laura.diaz@clinic.com', 75.00, 20.00, NULL),
(3, 'Dr. Francisco', 'Ruiz', 'Ortopedia', 'MED003', '+34 600 333 333', 'francisco.ruiz@clinic.com', 85.00, 30.00, NULL),
(4, 'Dra. Patricia', 'Vega', 'Ginecología', 'MED004', '+34 600 444 444', 'patricia.vega@clinic.com', 90.00, 25.00, NULL),
(5, 'Dr. Manuel', 'Torres', 'Neurología', 'MED005', '+34 600 555 555', 'manuel.torres@clinic.com', 95.00, 35.00, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `doctor_consultation_hours`
--

CREATE TABLE `doctor_consultation_hours` (
  `consultation_hour_id` int(6) UNSIGNED NOT NULL,
  `doctor_id` int(6) UNSIGNED NOT NULL,
  `day_of_week` varchar(15) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Volcado de datos para la tabla `doctor_consultation_hours`
--

INSERT INTO `doctor_consultation_hours` (`consultation_hour_id`, `doctor_id`, `day_of_week`, `start_time`, `end_time`) VALUES
(1, 1, 'lunes', '09:00:00', '13:00:00'),
(2, 1, 'miércoles', '09:00:00', '13:00:00'),
(3, 1, 'viernes', '09:00:00', '13:00:00'),
(4, 2, 'martes', '14:00:00', '18:00:00'),
(5, 2, 'jueves', '14:00:00', '18:00:00'),
(6, 1, 'lunes', '09:00:00', '13:00:00'),
(7, 1, 'lunes', '15:00:00', '18:00:00'),
(8, 1, 'martes', '09:00:00', '13:00:00'),
(9, 1, 'martes', '15:00:00', '18:00:00'),
(10, 1, 'miércoles', '09:00:00', '13:00:00'),
(11, 1, 'jueves', '09:00:00', '13:00:00'),
(12, 1, 'jueves', '15:00:00', '18:00:00'),
(13, 1, 'viernes', '09:00:00', '13:00:00'),
(14, 2, 'lunes', '10:00:00', '14:00:00'),
(15, 2, 'lunes', '16:00:00', '19:00:00'),
(16, 2, 'martes', '10:00:00', '14:00:00'),
(17, 2, 'miércoles', '10:00:00', '14:00:00'),
(18, 2, 'miércoles', '16:00:00', '19:00:00'),
(19, 2, 'jueves', '10:00:00', '14:00:00'),
(20, 2, 'viernes', '10:00:00', '14:00:00'),
(21, 2, 'viernes', '16:00:00', '19:00:00'),
(22, 3, 'lunes', '08:00:00', '12:00:00'),
(23, 3, 'lunes', '14:00:00', '17:00:00'),
(24, 3, 'martes', '08:00:00', '12:00:00'),
(25, 3, 'martes', '14:00:00', '17:00:00'),
(26, 3, 'miércoles', '08:00:00', '12:00:00'),
(27, 3, 'jueves', '08:00:00', '12:00:00'),
(28, 3, 'jueves', '14:00:00', '17:00:00'),
(29, 3, 'viernes', '08:00:00', '12:00:00'),
(30, 4, 'lunes', '11:00:00', '15:00:00'),
(31, 4, 'lunes', '17:00:00', '20:00:00'),
(32, 4, 'martes', '11:00:00', '15:00:00'),
(33, 4, 'martes', '17:00:00', '20:00:00'),
(34, 4, 'miércoles', '11:00:00', '15:00:00'),
(35, 4, 'jueves', '11:00:00', '15:00:00'),
(36, 4, 'jueves', '17:00:00', '20:00:00'),
(37, 4, 'viernes', '11:00:00', '15:00:00'),
(38, 5, 'lunes', '09:30:00', '13:30:00'),
(39, 5, 'lunes', '15:30:00', '18:30:00'),
(40, 5, 'martes', '09:30:00', '13:30:00'),
(41, 5, 'martes', '15:30:00', '18:30:00'),
(42, 5, 'miércoles', '09:30:00', '13:30:00'),
(43, 5, 'jueves', '09:30:00', '13:30:00'),
(44, 5, 'jueves', '15:30:00', '18:30:00'),
(45, 5, 'viernes', '09:30:00', '13:30:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `doctor_health_insurances`
--

CREATE TABLE `doctor_health_insurances` (
  `doctor_insurance_id` int(6) UNSIGNED NOT NULL,
  `doctor_id` int(6) UNSIGNED NOT NULL,
  `insurance_id` int(6) UNSIGNED NOT NULL,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `facility_payments`
--

CREATE TABLE `facility_payments` (
  `payment_id` int(6) UNSIGNED NOT NULL,
  `doctor_id` int(6) UNSIGNED NOT NULL,
  `payment_date` date NOT NULL,
  `payment_period` varchar(50) DEFAULT NULL,
  `hours_used` decimal(5,2) NOT NULL,
  `hourly_rate` decimal(10,2) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `recorded_by_secretary_id` int(6) UNSIGNED DEFAULT NULL,
  `status` varchar(32) NOT NULL DEFAULT 'COMPLETADO',
  `payment_method` varchar(32) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `health_insurances`
--

CREATE TABLE `health_insurances` (
  `insurance_id` int(6) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Volcado de datos para la tabla `health_insurances`
--

INSERT INTO `health_insurances` (`insurance_id`, `name`, `address`, `phone`, `email`) VALUES
(3, 'DKV', 'Plaza de la Seguridad 3, Valencia', '+34 900 345 644', 'atencion@dkv.es'),
(4, 'Sin Obra Social', 'Sin dirección', 'Sin teléfono', 'sin.obra.social@clinica.com'),
(5, 'nueva salud', 'salud 3994', '02494523129', 'nuevasalud@gmail.com'),
(6, 'OSDE', 'Av. Corrientes 1234, CABA', '0800-333-6733', 'info@osde.com.ar'),
(7, 'Swiss Medical', 'Av. Santa Fe 1234, CABA', '0810-777-7796', 'info@swissmedical.com.ar'),
(8, 'Galeno', 'Av. Córdoba 5678, CABA', '0810-888-4253', 'info@galeno.com.ar'),
(9, 'Medicus', 'Av. Callao 9012, CABA', '0810-333-6334', 'info@medicus.com.ar'),
(10, 'Prevención Salud', 'Av. Belgrano 3456, CABA', '0810-333-7738', 'info@prevencionsalud.com.ar');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medical_history_records`
--

CREATE TABLE `medical_history_records` (
  `record_id` int(6) UNSIGNED NOT NULL,
  `patient_id` int(6) UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `attending_doctor_id` int(6) UNSIGNED NOT NULL,
  `diagnosis` text DEFAULT NULL,
  `treatment` text DEFAULT NULL,
  `observations` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medical_record_prescribed_meds`
--

CREATE TABLE `medical_record_prescribed_meds` (
  `med_record_med_id` int(6) UNSIGNED NOT NULL,
  `record_id` int(6) UNSIGNED NOT NULL,
  `medication_name` varchar(100) NOT NULL,
  `dose` varchar(50) DEFAULT NULL,
  `instructions` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `patients`
--

CREATE TABLE `patients` (
  `patient_id` int(6) UNSIGNED NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `preferred_payment_methods` varchar(255) DEFAULT NULL,
  `health_insurance_id` int(6) UNSIGNED DEFAULT NULL,
  `health_insurance_member_number` varchar(50) DEFAULT NULL,
  `doctor_id` int(6) UNSIGNED DEFAULT NULL,
  `dni` varchar(20) DEFAULT NULL,
  `reference_name` varchar(100) DEFAULT NULL,
  `reference_last_name` varchar(100) DEFAULT NULL,
  `reference_address` varchar(255) DEFAULT NULL,
  `reference_phone` varchar(20) DEFAULT NULL,
  `reference_relationship` varchar(50) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Volcado de datos para la tabla `patients`
--

INSERT INTO `patients` (`patient_id`, `first_name`, `last_name`, `date_of_birth`, `address`, `phone`, `email`, `preferred_payment_methods`, `health_insurance_id`, `health_insurance_member_number`, `doctor_id`, `dni`, `reference_name`, `reference_last_name`, `reference_address`, `reference_phone`, `reference_relationship`, `created_at`) VALUES
(1, 'Juan', 'García', '2000-01-01', 'Calle Mayor 123, Madrid', '+34 600 123 456', 'juan.garcia@email.com', 'efectivo, tarjeta', 7, '12544554', NULL, '12345678', NULL, NULL, NULL, NULL, NULL, '2023-01-01 00:00:00'),
(2, 'María', 'López', '1985-08-22', 'Avenida Principal 45, Barcelona', '+34 600 234 567', 'maria.lopez@email.com', 'transferencia', 5, '1235465', NULL, '23456789B', NULL, NULL, NULL, NULL, NULL, '2023-01-01 00:00:00'),
(3, 'Carlos', 'Martínez', '1992-03-10', 'Plaza España 67, Valencia', '+34 600 345 678', 'carlos.martinez@email.com', 'efectivo', 4, NULL, NULL, '34567890C', NULL, NULL, NULL, NULL, NULL, '2023-01-01 00:00:00'),
(4, 'Ana', 'Rodríguez', '1988-11-30', 'Calle Real 89, Sevilla', '+34 600 456 789', 'ana.rodriguez@email.com', 'tarjeta', 3, NULL, NULL, '45678901D', NULL, NULL, NULL, NULL, NULL, '2023-01-01 00:00:00'),
(5, 'Luis', 'Fernández', '1995-07-12', 'Gran Vía 12, Bilbao', '+34 600 567 890', 'luis.fernandez@email.com', 'efectivo, transferencia', 4, NULL, NULL, '56789012E', NULL, NULL, NULL, NULL, NULL, '2023-01-01 00:00:00'),
(6, 'Carmen', 'González', '1983-12-05', 'Calle Nueva 34, Málaga', '+34 600 678 901', 'carmen.gonzalez@email.com', 'tarjeta', 4, NULL, NULL, '67890123F', NULL, NULL, NULL, NULL, NULL, '2023-01-01 00:00:00'),
(7, 'Pedro', 'Pérez', '1991-04-18', 'Avenida Central 56, Zaragoza', '+34 600 789 012', 'pedro.perez@email.com', 'efectivo', 3, NULL, NULL, '78901234G', NULL, NULL, NULL, NULL, NULL, '2023-01-01 00:00:00'),
(8, 'Isabel', 'Sánchez', '1987-09-25', 'Plaza Mayor 78, Granada', '+34 600 890 123', 'isabel.sanchez@email.com', 'transferencia', 4, NULL, NULL, '89012345H', NULL, NULL, NULL, NULL, NULL, '2023-01-01 00:00:00'),
(9, 'Miguel', 'Jiménez', '1993-01-08', 'Calle Ancha 90, Alicante', '+34 600 901 234', 'miguel.jimenez@email.com', 'efectivo, tarjeta', 4, NULL, NULL, '90123456I', NULL, NULL, NULL, NULL, NULL, '2023-01-01 00:00:00'),
(10, 'Elena', 'Moreno', '1986-06-14', 'Avenida del Mar 23, Cádiz', '+34 600 012 345', 'elena.moreno@email.com', 'tarjeta', 3, NULL, NULL, '01234567J', NULL, NULL, NULL, NULL, NULL, '2023-01-01 00:00:00'),
(11, 'JUAN', 'RODRIGUEZ', '2000-01-01', 'Salta 1961', '02494523129', 'juanmarcelo.rodrigueztandil@gmail.com', 'efectivo,débito', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2023-01-01 00:00:00'),
(13, 'JUA', 'RODRIGUEZ', '2000-01-01', 'Salta 1961', '02494523129', 'juanmarcelo.rodrigueztil@gmail.com', 'efectivo,débito', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2023-01-01 00:00:00'),
(14, 'luis', 'lucero', '2000-01-01', 'Salta 1966', '02494523164', 'luis@mail.com', 'efectivo,débito,transferencia', NULL, '12363544/00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2023-01-01 00:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `patient_doctors`
--

CREATE TABLE `patient_doctors` (
  `patient_id` int(6) UNSIGNED NOT NULL,
  `doctor_id` int(6) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Volcado de datos para la tabla `patient_doctors`
--

INSERT INTO `patient_doctors` (`patient_id`, `doctor_id`) VALUES
(1, 1),
(2, 1),
(8, 1),
(13, 1),
(1, 2),
(4, 2),
(8, 2),
(1, 3),
(3, 3),
(5, 3),
(9, 3),
(3, 4),
(6, 4),
(10, 4),
(1, 5),
(5, 5),
(7, 5),
(10, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `patient_health_insurances`
--

CREATE TABLE `patient_health_insurances` (
  `patient_insurance_id` int(6) UNSIGNED NOT NULL,
  `patient_id` int(6) UNSIGNED NOT NULL,
  `insurance_id` int(6) UNSIGNED NOT NULL,
  `member_number` varchar(50) DEFAULT NULL,
  `is_primary` tinyint(1) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Volcado de datos para la tabla `patient_health_insurances`
--

INSERT INTO `patient_health_insurances` (`patient_insurance_id`, `patient_id`, `insurance_id`, `member_number`, `is_primary`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 1, 7, '12544554', 1, 1, '2025-07-07 22:09:24', '2025-07-07 22:09:24'),
(2, 2, 5, '1235465', 1, 1, '2025-07-07 22:09:24', '2025-07-07 22:09:24'),
(3, 3, 4, NULL, 1, 1, '2025-07-07 22:09:24', '2025-07-07 22:09:24'),
(4, 4, 3, NULL, 1, 1, '2025-07-07 22:09:24', '2025-07-07 22:09:24'),
(5, 5, 4, NULL, 1, 1, '2025-07-07 22:09:24', '2025-07-07 22:09:24'),
(6, 6, 4, NULL, 1, 1, '2025-07-07 22:09:24', '2025-07-07 22:09:24'),
(7, 7, 3, NULL, 1, 1, '2025-07-07 22:09:24', '2025-07-07 22:09:24'),
(8, 8, 4, NULL, 1, 1, '2025-07-07 22:09:24', '2025-07-07 22:09:24'),
(9, 9, 4, NULL, 1, 1, '2025-07-07 22:09:24', '2025-07-07 22:09:24'),
(10, 10, 3, NULL, 1, 1, '2025-07-07 22:09:24', '2025-07-07 22:09:24'),
(16, 1, 5, '12544554', 0, 1, '2025-07-07 22:13:31', '2025-07-07 22:13:31'),
(17, 1, 3, '12544554', 0, 1, '2025-07-07 22:13:40', '2025-07-07 22:13:40');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `patient_references`
--

CREATE TABLE `patient_references` (
  `reference_id` int(10) UNSIGNED NOT NULL,
  `patient_id` int(6) UNSIGNED NOT NULL,
  `dni` varchar(20) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `relationship` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Volcado de datos para la tabla `patient_references`
--

INSERT INTO `patient_references` (`reference_id`, `patient_id`, `dni`, `name`, `last_name`, `address`, `phone`, `relationship`) VALUES
(1, 1, 'REF001', 'Antonio', 'García', 'Calle Mayor 123, Madrid', '+34 600 111 001', 'Padre'),
(2, 2, 'REF002', 'Carmen', 'López', 'Avenida Principal 45, Barcelona', '+34 600 111 002', 'Madre'),
(3, 3, 'REF003', 'Roberto', 'Martínez', 'Plaza España 67, Valencia', '+34 600 111 003', 'Hermano'),
(4, 4, 'REF004', 'Isabel', 'Rodríguez', 'Calle Real 89, Sevilla', '+34 600 111 004', 'Hermana'),
(5, 5, 'REF005', 'Francisco', 'Fernández', 'Gran Vía 12, Bilbao', '+34 600 111 005', 'Padre'),
(6, 6, 'REF006', 'Ana', 'González', 'Calle Nueva 34, Málaga', '+34 600 111 006', 'Madre'),
(7, 7, 'REF007', 'Miguel', 'Pérez', 'Avenida Central 56, Zaragoza', '+34 600 111 007', 'Hermano'),
(8, 8, 'REF008', 'Elena', 'Sánchez', 'Plaza Mayor 78, Granada', '+34 600 111 008', 'Hermana'),
(9, 9, 'REF009', 'Carlos', 'Jiménez', 'Calle Ancha 90, Alicante', '+34 600 111 009', 'Padre'),
(10, 10, 'REF010', 'Patricia', 'Moreno', 'Avenida del Mar 23, Cádiz', '+34 600 111 010', 'Madre');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prescriptions`
--

CREATE TABLE `prescriptions` (
  `prescription_id` int(6) UNSIGNED NOT NULL,
  `patient_id` int(6) UNSIGNED NOT NULL,
  `doctor_id` int(6) UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `issued_by_secretary_id` int(6) UNSIGNED DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `payment_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prescription_medications`
--

CREATE TABLE `prescription_medications` (
  `prescription_med_id` int(6) UNSIGNED NOT NULL,
  `prescription_id` int(6) UNSIGNED NOT NULL,
  `medication_name` varchar(100) NOT NULL,
  `dose` varchar(50) DEFAULT NULL,
  `instructions` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `secretaries`
--

CREATE TABLE `secretaries` (
  `secretary_id` int(6) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `shift` varchar(20) DEFAULT NULL,
  `entry_time` time DEFAULT NULL,
  `exit_time` time DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `phone` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Volcado de datos para la tabla `secretaries`
--

INSERT INTO `secretaries` (`secretary_id`, `name`, `first_name`, `last_name`, `shift`, `entry_time`, `exit_time`, `email`, `username`, `password`, `created_at`, `updated_at`, `phone`) VALUES
(1, 'Carmen Rodríguez', 'Carmen', 'Rodríguez', 'tarde', '14:00:00', '22:00:00', 'carmen.rodriguez@clinic.com', 'secretary_1', '$2b$10$defaultpasswordhash', '2025-07-06 23:01:51', '2025-07-06 23:01:51', '123456789'),
(2, 'stella ibarra', 'stella', 'ibarra', 'mañana', '07:43:00', '01:44:00', 'stella@mail.com', 'secretary_2', '$2b$10$defaultpasswordhash', '2025-07-06 23:01:51', '2025-07-06 23:01:51', '12345678'),
(3, 'Test Secretary', 'Test', 'Secretary', 'mañana', '08:00:00', '16:00:00', 'test@example.com', NULL, NULL, '2025-07-07 00:10:58', '2025-07-07 00:10:58', '123456789');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `secretary_activities`
--

CREATE TABLE `secretary_activities` (
  `activity_id` int(6) UNSIGNED NOT NULL,
  `secretary_id` int(6) UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `activity_type` varchar(50) NOT NULL,
  `detail` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `user_id` int(6) UNSIGNED NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(20) NOT NULL,
  `entity_id` int(6) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password`, `role`, `entity_id`, `created_at`) VALUES
(1, 'admin', 'admin@mail.com', '$2b$10$NQo8wkog32svec35OzbwQO6jpF8nxMZQjL7dz/SAHApgT0h52dnuW', 'admin', NULL, '2025-07-05 14:42:36'),
(2, 'ana_garcia', 'ana.garcia@clinic.com', '$2b$10$Y6zgfK9iSwkMVda6cnkhCuwM.WpQUmfv0i9u5H0XugXbcZQ8m94uO', 'secretary', NULL, '2025-07-05 16:36:37'),
(3, 'maria_lopez', 'maria.lopez@clinic.com', '$2b$10$gWC0ZZuTov/H/s9H7RWd9.y1Z7QhWgFRlKBR3qNY4Fh040iVyBL.e', 'secretary', NULL, '2025-07-05 16:36:38'),
(4, 'roberto_hernandez', 'roberto.hernandez@clinic.com', '$2b$10$8DLJeRswQsOxSqvn9s1wA.0oYBcY1EBx14c07pSKu/ly9eJzuqQhi', 'doctor', 1, '2025-07-05 16:36:39'),
(5, 'laura_diaz', 'laura.diaz@clinic.com', '$2b$10$7zQ/QydCHhYoa.OHxR6kLeVrl2HxdU/oJHu1ieOsNqfhrrP.CqDU6', 'doctor', 2, '2025-07-05 16:36:40');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_config`
--

CREATE TABLE `user_config` (
  `config_id` int(11) NOT NULL,
  `user_id` int(6) UNSIGNED NOT NULL,
  `session_timeout_minutes` int(11) DEFAULT 15
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Volcado de datos para la tabla `user_config`
--

INSERT INTO `user_config` (`config_id`, `user_id`, `session_timeout_minutes`) VALUES
(1, 1, 15);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`appointment_id`),
  ADD KEY `idx_appointments_patient_id` (`patient_id`),
  ADD KEY `idx_appointments_doctor_id` (`doctor_id`),
  ADD KEY `idx_appointments_recorded_by_secretary_id` (`recorded_by_secretary_id`),
  ADD KEY `idx_appointments_date_time` (`date`,`time`),
  ADD KEY `idx_appointments_type` (`type`),
  ADD KEY `idx_appointments_status` (`status`);

--
-- Indices de la tabla `doctors`
--
ALTER TABLE `doctors`
  ADD PRIMARY KEY (`doctor_id`),
  ADD UNIQUE KEY `license_number` (`license_number`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_doctors_last_name` (`last_name`);

--
-- Indices de la tabla `doctor_consultation_hours`
--
ALTER TABLE `doctor_consultation_hours`
  ADD PRIMARY KEY (`consultation_hour_id`),
  ADD KEY `idx_doctor_consultation_hours_doctor_id` (`doctor_id`);

--
-- Indices de la tabla `doctor_health_insurances`
--
ALTER TABLE `doctor_health_insurances`
  ADD PRIMARY KEY (`doctor_insurance_id`),
  ADD UNIQUE KEY `doctor_id` (`doctor_id`,`insurance_id`),
  ADD KEY `idx_doctor_health_insurances_doctor_id` (`doctor_id`),
  ADD KEY `idx_doctor_health_insurances_insurance_id` (`insurance_id`);

--
-- Indices de la tabla `facility_payments`
--
ALTER TABLE `facility_payments`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `idx_facility_payments_doctor_id` (`doctor_id`),
  ADD KEY `idx_facility_payments_recorded_by_secretary_id` (`recorded_by_secretary_id`);

--
-- Indices de la tabla `health_insurances`
--
ALTER TABLE `health_insurances`
  ADD PRIMARY KEY (`insurance_id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_health_insurances_name` (`name`);

--
-- Indices de la tabla `medical_history_records`
--
ALTER TABLE `medical_history_records`
  ADD PRIMARY KEY (`record_id`),
  ADD KEY `idx_medical_history_records_patient_id` (`patient_id`),
  ADD KEY `idx_medical_history_records_attending_doctor_id` (`attending_doctor_id`),
  ADD KEY `idx_medical_history_records_date` (`date`);

--
-- Indices de la tabla `medical_record_prescribed_meds`
--
ALTER TABLE `medical_record_prescribed_meds`
  ADD PRIMARY KEY (`med_record_med_id`),
  ADD KEY `idx_medical_record_prescribed_meds_record_id` (`record_id`);

--
-- Indices de la tabla `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`patient_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `dni` (`dni`),
  ADD KEY `doctor_id` (`doctor_id`),
  ADD KEY `idx_patients_health_insurance_id` (`health_insurance_id`),
  ADD KEY `idx_patients_dni` (`dni`),
  ADD KEY `idx_patients_last_name` (`last_name`),
  ADD KEY `idx_patients_health_insurance_member_number` (`health_insurance_member_number`);

--
-- Indices de la tabla `patient_doctors`
--
ALTER TABLE `patient_doctors`
  ADD PRIMARY KEY (`patient_id`,`doctor_id`),
  ADD KEY `doctor_id` (`doctor_id`);

--
-- Indices de la tabla `patient_health_insurances`
--
ALTER TABLE `patient_health_insurances`
  ADD PRIMARY KEY (`patient_insurance_id`),
  ADD UNIQUE KEY `unique_patient_insurance` (`patient_id`,`insurance_id`),
  ADD KEY `idx_patient_health_insurances_patient_id` (`patient_id`),
  ADD KEY `idx_patient_health_insurances_insurance_id` (`insurance_id`),
  ADD KEY `idx_patient_health_insurances_is_primary` (`is_primary`),
  ADD KEY `idx_patient_health_insurances_is_active` (`is_active`);

--
-- Indices de la tabla `patient_references`
--
ALTER TABLE `patient_references`
  ADD PRIMARY KEY (`reference_id`),
  ADD UNIQUE KEY `patient_id` (`patient_id`,`dni`);

--
-- Indices de la tabla `prescriptions`
--
ALTER TABLE `prescriptions`
  ADD PRIMARY KEY (`prescription_id`),
  ADD KEY `idx_prescriptions_patient_id` (`patient_id`),
  ADD KEY `idx_prescriptions_doctor_id` (`doctor_id`),
  ADD KEY `idx_prescriptions_issued_by_secretary_id` (`issued_by_secretary_id`),
  ADD KEY `idx_prescriptions_date` (`date`);

--
-- Indices de la tabla `prescription_medications`
--
ALTER TABLE `prescription_medications`
  ADD PRIMARY KEY (`prescription_med_id`),
  ADD KEY `idx_prescription_meds_prescription_id` (`prescription_id`);

--
-- Indices de la tabla `secretaries`
--
ALTER TABLE `secretaries`
  ADD PRIMARY KEY (`secretary_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `idx_secretaries_name` (`name`),
  ADD KEY `idx_secretaries_username` (`username`),
  ADD KEY `idx_secretaries_email` (`email`);

--
-- Indices de la tabla `secretary_activities`
--
ALTER TABLE `secretary_activities`
  ADD PRIMARY KEY (`activity_id`),
  ADD KEY `idx_secretary_activities_secretary_id` (`secretary_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `user_config`
--
ALTER TABLE `user_config`
  ADD PRIMARY KEY (`config_id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `appointments`
--
ALTER TABLE `appointments`
  MODIFY `appointment_id` int(6) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `doctors`
--
ALTER TABLE `doctors`
  MODIFY `doctor_id` int(6) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `doctor_consultation_hours`
--
ALTER TABLE `doctor_consultation_hours`
  MODIFY `consultation_hour_id` int(6) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT de la tabla `health_insurances`
--
ALTER TABLE `health_insurances`
  MODIFY `insurance_id` int(6) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `patients`
--
ALTER TABLE `patients`
  MODIFY `patient_id` int(6) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `patient_health_insurances`
--
ALTER TABLE `patient_health_insurances`
  MODIFY `patient_insurance_id` int(6) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `patient_references`
--
ALTER TABLE `patient_references`
  MODIFY `reference_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `secretaries`
--
ALTER TABLE `secretaries`
  MODIFY `secretary_id` int(6) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(6) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `user_config`
--
ALTER TABLE `user_config`
  MODIFY `config_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`),
  ADD CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`doctor_id`),
  ADD CONSTRAINT `appointments_ibfk_3` FOREIGN KEY (`recorded_by_secretary_id`) REFERENCES `secretaries` (`secretary_id`);

--
-- Filtros para la tabla `doctor_consultation_hours`
--
ALTER TABLE `doctor_consultation_hours`
  ADD CONSTRAINT `doctor_consultation_hours_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`doctor_id`);

--
-- Filtros para la tabla `doctor_health_insurances`
--
ALTER TABLE `doctor_health_insurances`
  ADD CONSTRAINT `doctor_health_insurances_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`doctor_id`),
  ADD CONSTRAINT `doctor_health_insurances_ibfk_2` FOREIGN KEY (`insurance_id`) REFERENCES `health_insurances` (`insurance_id`);

--
-- Filtros para la tabla `facility_payments`
--
ALTER TABLE `facility_payments`
  ADD CONSTRAINT `facility_payments_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`doctor_id`),
  ADD CONSTRAINT `facility_payments_ibfk_2` FOREIGN KEY (`recorded_by_secretary_id`) REFERENCES `secretaries` (`secretary_id`);

--
-- Filtros para la tabla `medical_history_records`
--
ALTER TABLE `medical_history_records`
  ADD CONSTRAINT `medical_history_records_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`),
  ADD CONSTRAINT `medical_history_records_ibfk_2` FOREIGN KEY (`attending_doctor_id`) REFERENCES `doctors` (`doctor_id`);

--
-- Filtros para la tabla `medical_record_prescribed_meds`
--
ALTER TABLE `medical_record_prescribed_meds`
  ADD CONSTRAINT `medical_record_prescribed_meds_ibfk_1` FOREIGN KEY (`record_id`) REFERENCES `medical_history_records` (`record_id`);

--
-- Filtros para la tabla `patients`
--
ALTER TABLE `patients`
  ADD CONSTRAINT `patients_ibfk_1` FOREIGN KEY (`health_insurance_id`) REFERENCES `health_insurances` (`insurance_id`),
  ADD CONSTRAINT `patients_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`doctor_id`);

--
-- Filtros para la tabla `patient_doctors`
--
ALTER TABLE `patient_doctors`
  ADD CONSTRAINT `patient_doctors_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `patient_doctors_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`doctor_id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `patient_health_insurances`
--
ALTER TABLE `patient_health_insurances`
  ADD CONSTRAINT `patient_health_insurances_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `patient_health_insurances_ibfk_2` FOREIGN KEY (`insurance_id`) REFERENCES `health_insurances` (`insurance_id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `patient_references`
--
ALTER TABLE `patient_references`
  ADD CONSTRAINT `patient_references_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `prescriptions`
--
ALTER TABLE `prescriptions`
  ADD CONSTRAINT `prescriptions_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`),
  ADD CONSTRAINT `prescriptions_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`doctor_id`),
  ADD CONSTRAINT `prescriptions_ibfk_3` FOREIGN KEY (`issued_by_secretary_id`) REFERENCES `secretaries` (`secretary_id`);

--
-- Filtros para la tabla `prescription_medications`
--
ALTER TABLE `prescription_medications`
  ADD CONSTRAINT `prescription_medications_ibfk_1` FOREIGN KEY (`prescription_id`) REFERENCES `prescriptions` (`prescription_id`);

--
-- Filtros para la tabla `secretary_activities`
--
ALTER TABLE `secretary_activities`
  ADD CONSTRAINT `secretary_activities_ibfk_1` FOREIGN KEY (`secretary_id`) REFERENCES `secretaries` (`secretary_id`);

--
-- Filtros para la tabla `user_config`
--
ALTER TABLE `user_config`
  ADD CONSTRAINT `user_config_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
