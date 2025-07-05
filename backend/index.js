const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

// Configuración de CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3002', 'http://127.0.0.1:3000', 'http://127.0.0.1:3002'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const patientRoutes = require('./routes/patientRoutes');
app.use('/api/patients', patientRoutes);

const doctorRoutes = require('./routes/doctorRoutes');
app.use('/api/doctors', doctorRoutes);

const appointmentRoutes = require('./routes/appointmentRoutes');
app.use('/api/appointments', appointmentRoutes);

const prescriptionRoutes = require('./routes/prescriptionRoutes');
app.use('/api/prescriptions', prescriptionRoutes);

const medicalHistoryRoutes = require('./routes/medicalHistoryRoutes');
app.use('/api/medical-history', medicalHistoryRoutes);

const healthInsuranceRoutes = require('./routes/healthInsuranceRoutes');
app.use('/api/health-insurances', healthInsuranceRoutes);

const secretaryActivityRoutes = require('./routes/secretaryActivityRoutes');
app.use('/api/secretary-activities', secretaryActivityRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
const { authenticateToken } = require('./middleware/authMiddleware');

const doctorConsultationHourRoutes = require('./routes/doctorConsultationHourRoutes');
app.use('/api/doctor-consultation-hours', doctorConsultationHourRoutes);

const patientReferenceRoutes = require('./routes/patientReferenceRoutes');
app.use('/api/patient-references', patientReferenceRoutes);

const secretaryRoutes = require('./routes/secretaryRoutes');
app.use('/api/secretaries', secretaryRoutes);

const facilityPaymentRoutes = require('./routes/facilityPaymentRoutes');
app.use('/api/facility-payments', facilityPaymentRoutes);

const calendarRoutes = require('./routes/calendarRoutes');
app.use('/api/calendar', calendarRoutes);

// Nuevas rutas para relaciones paciente-doctor
const patientDoctorRoutes = require('./routes/patientDoctorRoutes');
app.use('/api/patient-doctors', patientDoctorRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Acceso permitido', user: req.user });
});

app.listen(PORT, () => {
  console.log(`Backend escuchando en puerto ${PORT}`);
}); 