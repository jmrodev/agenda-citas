import React, { useCallback, useState, useEffect } from 'react';
import FormField from '../FormField/FormField';
import Select from '../../atoms/Select/Select';
import Checkbox from '../../atoms/Checkbox/Checkbox';
import { doctorService } from '../../../services/doctorService';
import { healthInsuranceService } from '../../../services/healthInsuranceService';
import styles from './PatientFormFields.module.css';

const PatientFormFields = React.memo(({
  values,
  errors,
  touched,
  onChange,
  onBlur
}) => {
  // Debug temporal
  console.log('PatientFormFields recibió valores:', values);
  // Componente de campos del formulario de pacientes - Versión actualizada
  const [doctors, setDoctors] = useState([]);
  const [healthInsurances, setHealthInsurances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Cargar doctores y obras sociales
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadError('');
        const [doctorsData, insurancesData] = await Promise.all([
          doctorService.getAll(),
          healthInsuranceService.getAll()
        ]);
        setDoctors(doctorsData.doctors || doctorsData || []);
        setHealthInsurances(insurancesData.health_insurances || insurancesData || []);
      } catch (error) {
        console.error('Error cargando datos:', error);
        setLoadError('Error al cargar datos. Por favor, recargue la página.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleFieldChange = useCallback((e) => {
    onChange(e.target.name, e.target.value);
  }, [onChange]);

  const handleFieldBlur = useCallback((e) => {
    onBlur(e.target.name);
  }, [onBlur]);

  const handleSelectChange = useCallback((name, value) => {
    onChange(name, value);
  }, [onChange]);

  const handleMultiSelectChange = useCallback((name, selectedValues) => {
    onChange(name, selectedValues);
  }, [onChange]);

  const handleReferenceChange = useCallback((field, value) => {
    const currentReference = values.reference_person || {};
    const updatedReference = { ...currentReference, [field]: value };
    onChange('reference_person', updatedReference);
  }, [values.reference_person, onChange]);

  if (loading) {
    return <div className={styles.loading}>Cargando formulario...</div>;
  }

  if (loadError) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>{loadError}</div>
        <button 
          onClick={() => window.location.reload()} 
          className={styles.retryButton}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className={styles.patientFormFields}>
      {/* Información Personal del Paciente */}
      <h3 className={styles.sectionTitle}>Información Personal</h3>
      
      <div className={styles.row}>
        <FormField
          label="Nombre"
          name="first_name"
          type="text"
          value={values.first_name || ''}
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
          error={touched.first_name && errors.first_name ? errors.first_name : ''}
          placeholder="Ingrese el nombre"
          required
          validationRules={['required', 'onlyLetters', 'minLength:2']}
          sanitizeType="text"
          className={styles.field}
        />

        <FormField
          label="Apellido"
          name="last_name"
          type="text"
          value={values.last_name || ''}
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
          error={touched.last_name && errors.last_name ? errors.last_name : ''}
          placeholder="Ingrese el apellido"
          required
          validationRules={['required', 'onlyLetters', 'minLength:2']}
          sanitizeType="text"
          className={styles.field}
        />
      </div>

      <div className={styles.row}>
        <FormField
          label="DNI"
          name="dni"
          type="text"
          value={values.dni || ''}
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
          error={touched.dni && errors.dni ? errors.dni : ''}
          placeholder="12345678"
          validationRules={['dni']}
          sanitizeType="dni"
          className={styles.field}
        />

        <FormField
          label="Fecha de Nacimiento"
          name="date_of_birth"
          type="date"
          value={values.date_of_birth || ''}
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
          error={touched.date_of_birth && errors.date_of_birth ? errors.date_of_birth : ''}
          validationRules={['date']}
          sanitizeType="date"
          className={styles.field}
        />
      </div>

      <div className={styles.row}>
        <FormField
          label="Email"
          name="email"
          type="email"
          value={values.email || ''}
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
          error={touched.email && errors.email ? errors.email : ''}
          placeholder="ejemplo@email.com"
          validationRules={['email']}
          sanitizeType="email"
          className={styles.field}
        />

        <FormField
          label="Teléfono"
          name="phone"
          type="tel"
          value={values.phone || ''}
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
          error={touched.phone && errors.phone ? errors.phone : ''}
          placeholder="(123) 456-7890"
          validationRules={['phone']}
          sanitizeType="phone"
          className={styles.field}
        />
      </div>

      <FormField
        label="Dirección"
        name="address"
        type="text"
        value={values.address || ''}
        onChange={handleFieldChange}
        onBlur={handleFieldBlur}
        error={touched.address && errors.address ? errors.address : ''}
        placeholder="Ingrese la dirección completa"
        validationRules={['maxLength:255']}
        sanitizeType="text"
        className={styles.fullWidth}
      />

      {/* Información Médica */}
      <h3 className={styles.sectionTitle}>Información Médica</h3>
      
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Obra Social</label>
          {loading ? (
            <div className={styles.loadingSelect}>Cargando obras sociales...</div>
          ) : (
            <Select
              name="health_insurance_id"
              value={values.health_insurance_id || ''}

              onChange={(e) => {
                const value = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                handleSelectChange('health_insurance_id', value);
              }}
              options={[
                { value: '', label: 'Seleccione una obra social' },
                ...healthInsurances.map(insurance => ({
                  value: insurance.insurance_id,
                  label: insurance.name
                }))
              ]}
              placeholder="Seleccione una obra social"
            />
          )}
          {touched.health_insurance_id && errors.health_insurance_id && (
            <span className={styles.error}>{errors.health_insurance_id}</span>
          )}
          {!loading && healthInsurances.length === 0 && (
            <span className={styles.warning}>No hay obras sociales disponibles</span>
          )}
          
          {/* Campo para número de socio */}
          {values.health_insurance_id && (
            <FormField
              label="Número de Socio"
              name="health_insurance_member_number"
              type="text"
              value={values.health_insurance_member_number || ''}
              onChange={handleFieldChange}
              onBlur={handleFieldBlur}
              error={touched.health_insurance_member_number && errors.health_insurance_member_number ? errors.health_insurance_member_number : ''}
              placeholder="Ingrese el número de socio/carnet"
              validationRules={['maxLength:50']}
              sanitizeType="text"
              className={styles.field}
            />
          )}

          {/* Mostrar información completa de la obra social seleccionada */}
          {values.health_insurance_id && !loading && (
            (() => {
              const selectedInsurance = healthInsurances.find(
                insurance => insurance.insurance_id === values.health_insurance_id
              );
              if (selectedInsurance) {
                return (
                  <div className={styles.insuranceInfo}>
                    <h4 className={styles.insuranceTitle}>Información de la Obra Social</h4>
                    <div className={styles.insuranceDetails}>
                      <div className={styles.insuranceField}>
                        <strong>Nombre:</strong> {selectedInsurance.name}
                      </div>
                      {selectedInsurance.address && (
                        <div className={styles.insuranceField}>
                          <strong>Dirección:</strong> {selectedInsurance.address}
                        </div>
                      )}
                      {selectedInsurance.phone && (
                        <div className={styles.insuranceField}>
                          <strong>Teléfono:</strong> {selectedInsurance.phone}
                        </div>
                      )}
                      {selectedInsurance.email && (
                        <div className={styles.insuranceField}>
                          <strong>Email:</strong> {selectedInsurance.email}
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
              return null;
            })()
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Métodos de Pago Preferidos</label>
          <div className={styles.paymentMethodsList}>
            {[
              { id: 'efectivo', label: 'Efectivo' },
              { id: 'débito', label: 'Débito' },
              { id: 'crédito', label: 'Crédito' },
              { id: 'transferencia', label: 'Transferencia' }
            ].map(method => (
              <div key={method.id} className={styles.checkboxItem}>
                <Checkbox
                  id={`payment_${method.id}`}
                  name={`payment_${method.id}`}
                  checked={values.preferred_payment_methods?.includes(method.id) || false}
                  onChange={(e) => {
                    const currentMethods = values.preferred_payment_methods?.split(',').filter(m => m.trim()) || [];
                    const updatedMethods = e.target.checked
                      ? [...currentMethods, method.id]
                      : currentMethods.filter(m => m !== method.id);
                    handleSelectChange('preferred_payment_methods', updatedMethods.join(','));
                  }}
                />
                <label htmlFor={`payment_${method.id}`} className={styles.checkboxLabel}>
                  {method.label}
                </label>
              </div>
            ))}
          </div>
          {touched.preferred_payment_methods && errors.preferred_payment_methods && (
            <span className={styles.error}>{errors.preferred_payment_methods}</span>
          )}
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Doctores Asignados</label>
        <div className={styles.doctorsList}>
          {doctors.map(doctor => (
            <div key={doctor.doctor_id} className={styles.checkboxItem}>
              <Checkbox
                id={`doctor_${doctor.doctor_id}`}
                name={`doctor_${doctor.doctor_id}`}
                checked={values.doctor_ids?.includes(doctor.doctor_id) || false}
                onChange={(e) => {
                  const currentDoctors = values.doctor_ids || [];
                  const updatedDoctors = e.target.checked
                    ? [...currentDoctors, doctor.doctor_id]
                    : currentDoctors.filter(id => id !== doctor.doctor_id);
                  handleMultiSelectChange('doctor_ids', updatedDoctors);
                }}
              />
              <label htmlFor={`doctor_${doctor.doctor_id}`} className={styles.checkboxLabel}>
                {doctor.first_name} {doctor.last_name} - {doctor.specialty}
              </label>
            </div>
          ))}
        </div>
        {touched.doctor_ids && errors.doctor_ids && (
          <span className={styles.error}>{errors.doctor_ids}</span>
        )}
      </div>

      {/* Persona de Referencia */}
      <h3 className={styles.sectionTitle}>Persona de Referencia</h3>
      
      <div className={styles.row}>
        <FormField
          label="Nombre"
          name="reference_name"
          type="text"
          value={values.reference_person?.name || ''}
          onChange={(e) => handleReferenceChange('name', e.target.value)}
          onBlur={() => onBlur('reference_person')}
          error={touched.reference_person && errors.reference_person ? errors.reference_person : ''}
          placeholder="Nombre de la persona de referencia"
          validationRules={['onlyLetters']}
          sanitizeType="text"
          className={styles.field}
        />

        <FormField
          label="Apellido"
          name="reference_last_name"
          type="text"
          value={values.reference_person?.last_name || ''}
          onChange={(e) => handleReferenceChange('last_name', e.target.value)}
          onBlur={() => onBlur('reference_person')}
          error={touched.reference_person && errors.reference_person ? errors.reference_person : ''}
          placeholder="Apellido de la persona de referencia"
          validationRules={['onlyLetters']}
          sanitizeType="text"
          className={styles.field}
        />
      </div>

      <div className={styles.row}>
        <FormField
          label="Teléfono"
          name="reference_phone"
          type="tel"
          value={values.reference_person?.phone || ''}
          onChange={(e) => handleReferenceChange('phone', e.target.value)}
          onBlur={() => onBlur('reference_person')}
          error={touched.reference_person && errors.reference_person ? errors.reference_person : ''}
          placeholder="(123) 456-7890"
          validationRules={['phone']}
          sanitizeType="phone"
          className={styles.field}
        />

        <FormField
          label="Relación"
          name="reference_relationship"
          type="text"
          value={values.reference_person?.relationship || ''}
          onChange={(e) => handleReferenceChange('relationship', e.target.value)}
          onBlur={() => onBlur('reference_person')}
          error={touched.reference_person && errors.reference_person ? errors.reference_person : ''}
          placeholder="Familiar, amigo, etc."
          validationRules={['maxLength:50']}
          sanitizeType="text"
          className={styles.field}
        />
      </div>

      <FormField
        label="Dirección de Referencia"
        name="reference_address"
        type="text"
        value={values.reference_person?.address || ''}
        onChange={(e) => handleReferenceChange('address', e.target.value)}
        onBlur={() => onBlur('reference_person')}
        error={touched.reference_person && errors.reference_person ? errors.reference_person : ''}
        placeholder="Dirección de la persona de referencia"
        validationRules={['maxLength:255']}
        sanitizeType="text"
        className={styles.fullWidth}
      />
    </div>
  );
});

PatientFormFields.displayName = 'PatientFormFields';

export default PatientFormFields; 