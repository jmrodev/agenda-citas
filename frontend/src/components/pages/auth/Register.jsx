import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormGroup from '../../molecules/FormGroup/FormGroup';
import FormField from '../../molecules/FormField/FormField';
import Button from '../../atoms/Button/Button';
import Alert from '../../atoms/Alert/Alert';
import SuccessScreen from '../../organisms/SuccessScreen/SuccessScreen';
import DashboardLayout from '../../templates/DashboardLayout/DashboardLayout.jsx';
import { parseAndValidateDate } from '../../../utils/date';

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validatePassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}
function validateUsername(username) {
  return /^[a-zA-Z0-9_]{3,20}$/.test(username);
}
function validateName(nombre) {
  return nombre && nombre.trim().length >= 2 && nombre.trim().length <= 50;
}

const roles = [
  { value: 'admin', label: 'Administrador' },
  { value: 'doctor', label: 'Doctor' },
  { value: 'secretary', label: 'Secretaria' }
];

function RegisterForm({ defaultRole }) {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [role, setRole] = useState(defaultRole || 'admin');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  // Campos extra para doctor
  const [specialty, setSpecialty] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [doctorPhone, setDoctorPhone] = useState('');
  const [consultationFee, setConsultationFee] = useState('');
  const [prescriptionFee, setPrescriptionFee] = useState('');
  const [lastEarningsCollectionDate, setLastEarningsCollectionDate] = useState('');

  // Campos extra para secretaria
  const [shift, setShift] = useState('');
  const [entryTime, setEntryTime] = useState('');
  const [exitTime, setExitTime] = useState('');

  // Redirección automática si ya hay sesión
  useEffect(() => {
    if (success) return; // Si hay éxito, no redirigir automáticamente
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    // Solo redirigir si el usuario autenticado NO es admin
    // y solo si NO está en modo alta de doctor
    if (
      token &&
      role &&
      role !== 'admin' &&
      !(defaultRole === 'doctor')
    ) {
      if (role === 'doctor') navigate('/doctor', { replace: true });
      else if (role === 'secretary') navigate('/secretary', { replace: true });
      else if (role === 'patient') navigate('/patient', { replace: true });
      else navigate('/', { replace: true });
    }
  }, [navigate, success, defaultRole]);

  const validate = () => {
    const errors = {};
    if (!validateName(nombre)) errors.nombre = 'El nombre es obligatorio (2-50 caracteres)';
    if (!validateName(apellido)) errors.apellido = 'El apellido es obligatorio (2-50 caracteres)';
    if (!username) errors.username = 'El nombre de usuario es obligatorio';
    else if (!validateUsername(username)) errors.username = 'Solo letras, números y guion bajo (3-20 caracteres, sin espacios)';
    if (!email) errors.email = 'El email es obligatorio';
    else if (!validateEmail(email)) errors.email = 'Email no válido';
    if (!password) errors.password = 'La contraseña es obligatoria';
    else if (!validatePassword(password)) errors.password = 'Mínimo 8 caracteres, una mayúscula, una minúscula y un número';
    if (!confirm) errors.confirm = 'Confirma la contraseña';
    else if (password !== confirm) errors.confirm = 'Las contraseñas no coinciden';
    if (!role) errors.role = 'Selecciona un rol';
    // Validaciones extra
    if (role === 'doctor') {
      if (!specialty) errors.specialty = 'La especialidad es obligatoria';
      if (!licenseNumber) errors.licenseNumber = 'El número de licencia es obligatorio';
      if (!doctorPhone) errors.doctorPhone = 'El teléfono es obligatorio';
      if (!consultationFee) errors.consultationFee = 'El honorario de consulta es obligatorio';
      if (!prescriptionFee) errors.prescriptionFee = 'El honorario de receta es obligatorio';
    }
    if (role === 'secretary') {
      if (!shift) errors.shift = 'El turno es obligatorio';
      if (!entryTime) errors.entryTime = 'La hora de entrada es obligatoria';
      if (!exitTime) errors.exitTime = 'La hora de salida es obligatoria';
    }
    return errors;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      let endpoint = '/api/auth/register';
      let body = { nombre, apellido, username, email, password, role };
      if (role === 'doctor') {
        endpoint = '/api/auth/register-doctor';
        let lastEarningsDateObj = null;
        if (lastEarningsCollectionDate) {
          const [year, month, day] = lastEarningsCollectionDate.split('-').map(Number);
          lastEarningsDateObj = { day, month, year };
          const dateError = parseAndValidateDate(lastEarningsDateObj, 'last_earnings_collection_date', true);
          if (dateError) {
            setFieldErrors({ lastEarningsCollectionDate: dateError });
            setLoading(false);
            return;
          }
        }
        body = {
          doctor: {
            first_name: nombre,
            last_name: apellido,
            specialty,
            license_number: licenseNumber,
            phone: doctorPhone,
            email,
            consultation_fee: consultationFee,
            prescription_fee: prescriptionFee,
            last_earnings_collection_date: lastEarningsDateObj
          },
          user: { username, email, password }
        };
      } else if (role === 'secretary') {
        endpoint = '/api/auth/register-secretary';
        body = {
          secretary: {
            first_name: nombre,
            last_name: apellido,
            shift,
            entry_time: entryTime,
            exit_time: exitTime,
            email
          },
          user: { username, email, password }
        };
      }
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || 'Error en el registro');
      setSuccess('Usuario creado correctamente');
      setTimeout(() => {
        navigate('/users');
      }, 1200);
    } catch (err) {
      setError(err.message || 'Error en el registro');
    } finally {
      setLoading(false);
    }
  };

  // Handlers con validación en tiempo real
  const handleNombreChange = e => {
    setNombre(e.target.value);
    setFieldErrors(prev => ({
      ...prev,
      nombre: !validateName(e.target.value) ? 'El nombre es obligatorio (2-50 caracteres)' : ''
    }));
  };
  const handleApellidoChange = e => {
    setApellido(e.target.value);
    setFieldErrors(prev => ({
      ...prev,
      apellido: !validateName(e.target.value) ? 'El apellido es obligatorio (2-50 caracteres)' : ''
    }));
  };
  const handleUsernameChange = e => {
    setUsername(e.target.value);
    setFieldErrors(prev => ({
      ...prev,
      username: !validateUsername(e.target.value) ? 'Solo letras, números y guion bajo (3-20 caracteres, sin espacios)' : ''
    }));
  };
  const handleEmailChange = e => {
    setEmail(e.target.value);
    setFieldErrors(prev => ({
      ...prev,
      email: !validateEmail(e.target.value) ? 'Email no válido' : ''
    }));
  };
  const handlePasswordChange = e => {
    setPassword(e.target.value);
    setFieldErrors(prev => ({
      ...prev,
      password: !validatePassword(e.target.value) ? 'Mínimo 8 caracteres, una mayúscula, una minúscula y un número' : ''
    }));
  };
  const handleConfirmChange = e => {
    setConfirm(e.target.value);
    setFieldErrors(prev => ({
      ...prev,
      confirm: e.target.value !== password ? 'Las contraseñas no coinciden' : ''
    }));
  };
  const handleRoleChange = e => {
    setRole(e.target.value);
    setFieldErrors(prev => ({
      ...prev,
      role: !e.target.value ? 'Selecciona un rol' : ''
    }));
  };

  return (
    <div style={{ background: 'var(--app-bg, #f9fafb)' }}>
      {success ? (
        <SuccessScreen message={success} redirectTo='/users' linkText='Ir a la lista de usuarios' delay={3000} />
      ) : (
        <form onSubmit={handleSubmit} style={{ minWidth: 320, maxWidth: 400, width: '100%', background: 'var(--surface, #fff)', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', margin: '2rem auto' }} noValidate>
          <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: 700, fontSize: '1.3rem', color: 'var(--primary, #2563eb)' }}>Agenda de Citas</span>
          </div>
          <h2 style={{ textAlign: 'center', fontWeight: 600, fontSize: '1.1rem', margin: 0 }}>Registrar usuario</h2>
          <FormGroup>
            <FormField
              label='Nombre'
              id='nombre'
              value={nombre}
              onChange={handleNombreChange}
              required
              error={fieldErrors.nombre}
            />
            <FormField
              label='Apellido'
              id='apellido'
              value={apellido}
              onChange={handleApellidoChange}
              required
              error={fieldErrors.apellido}
            />
            <FormField
              label='Nombre de usuario'
              id='username'
              value={username}
              onChange={handleUsernameChange}
              required
              error={fieldErrors.username}
            />
            <FormField
              label='Email'
              id='email'
              type='email'
              value={email}
              onChange={handleEmailChange}
              required
              error={fieldErrors.email}
            />
            <FormField
              label='Contraseña'
              id='password'
              type='password'
              value={password}
              onChange={handlePasswordChange}
              required
              error={fieldErrors.password}
              helperText='Mínimo 8 caracteres, una mayúscula, una minúscula y un número.'
            />
            <FormField
              label='Confirmar contraseña'
              id='confirm'
              type='password'
              value={confirm}
              onChange={handleConfirmChange}
              required
              error={fieldErrors.confirm}
            />
            <FormField
              label='Rol'
              id='role'
              type='select'
              value={role}
              onChange={handleRoleChange}
              required
              error={fieldErrors.role}
              options={roles}
            />
            {role === 'doctor' && (
              <>
                <FormField label='Especialidad' id='specialty' value={specialty} onChange={e => setSpecialty(e.target.value)} required error={fieldErrors.specialty} />
                <FormField label='N° de licencia' id='licenseNumber' value={licenseNumber} onChange={e => setLicenseNumber(e.target.value)} required error={fieldErrors.licenseNumber} />
                <FormField label='Teléfono' id='doctorPhone' value={doctorPhone} onChange={e => setDoctorPhone(e.target.value)} required error={fieldErrors.doctorPhone} />
                <FormField label='Honorario consulta' id='consultationFee' value={consultationFee} onChange={e => setConsultationFee(e.target.value)} type='number' required error={fieldErrors.consultationFee} />
                <FormField label='Honorario receta' id='prescriptionFee' value={prescriptionFee} onChange={e => setPrescriptionFee(e.target.value)} type='number' required error={fieldErrors.prescriptionFee} />
                <FormField label='Fecha última liquidación' id='lastEarningsCollectionDate' value={lastEarningsCollectionDate} onChange={e => setLastEarningsCollectionDate(e.target.value)} type='date' />
              </>
            )}
            {role === 'secretary' && (
              <>
                <FormField label='Turno' id='shift' value={shift} onChange={e => setShift(e.target.value)} required error={fieldErrors.shift} />
                <FormField label='Hora entrada' id='entryTime' value={entryTime} onChange={e => setEntryTime(e.target.value)} type='time' required error={fieldErrors.entryTime} />
                <FormField label='Hora salida' id='exitTime' value={exitTime} onChange={e => setExitTime(e.target.value)} type='time' required error={fieldErrors.exitTime} />
              </>
            )}
          </FormGroup>
          {error && <Alert type='error'>{error}</Alert>}
          <Button type='submit' loading={loading} style={{ width: '100%' }} disabled={loading || Object.values(fieldErrors).some(Boolean) || !nombre || !email || !password || !confirm || !role}>
            Registrar
          </Button>
        </form>
      )}
    </div>
  );
}

export default function Register(props) {
  return (
    <DashboardLayout>
      <RegisterForm {...props} />
    </DashboardLayout>
  );
} 