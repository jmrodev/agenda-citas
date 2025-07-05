import React, { useCallback } from 'react';
import FormField from '../FormField/FormField';
import styles from './PatientFormFields.module.css';

const PatientFormFields = React.memo(({
  values,
  errors,
  touched,
  onChange,
  onBlur
}) => {
  const handleFieldChange = useCallback((e) => {
    onChange(e);
  }, [onChange]);

  const handleFieldBlur = useCallback((e) => {
    onBlur(e);
  }, [onBlur]);

  return (
    <div className={styles.patientFormFields}>
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

      <FormField
        label="Dirección"
        name="address"
        type="text"
        value={values.address || ''}
        onChange={handleFieldChange}
        onBlur={handleFieldBlur}
        error={touched.address && errors.address ? errors.address : ''}
        placeholder="Ingrese la dirección completa"
        validationRules={['maxLength:200']}
        sanitizeType="text"
        className={styles.fullWidth}
      />

      <FormField
        label="Notas"
        name="notes"
        type="textarea"
        value={values.notes || ''}
        onChange={handleFieldChange}
        onBlur={handleFieldBlur}
        error={touched.notes && errors.notes ? errors.notes : ''}
        placeholder="Notas adicionales sobre el paciente"
        validationRules={['maxLength:500']}
        sanitizeType="text"
        className={styles.fullWidth}
      />
    </div>
  );
});

PatientFormFields.displayName = 'PatientFormFields';

export default PatientFormFields; 