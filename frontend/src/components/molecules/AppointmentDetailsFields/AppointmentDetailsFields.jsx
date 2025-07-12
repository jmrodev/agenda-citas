import React from 'react';
import FormField from '../FormField/FormField';
import Input from '../../atoms/Input/Input';
import Select from '../../atoms/Select/Select';
import TextArea from '../../atoms/Textarea/Textarea';
import styles from './AppointmentDetailsFields.module.css';

const AppointmentDetailsFields = ({
  formData,
  onChange,
  onBlur,
  errors = {},
  touched = {}
}) => {
  return (
    <>
      <div className={styles.row}>
        <FormField
          label="Motivo de la consulta"
          name="reason"
          error={touched.reason && errors.reason ? errors.reason : undefined}
          required
        >
          <TextArea
            name="reason"
            value={formData.reason}
            onChange={onChange}
            onBlur={onBlur}
            placeholder="Describa el motivo de la consulta..."
            rows={3}
          />
        </FormField>

        <FormField
          label="Tipo de consulta"
          name="type"
          error={touched.type && errors.type ? errors.type : undefined}
        >
          <Select
            name="type"
            value={formData.type}
            onChange={onChange}
            onBlur={onBlur}
            options={[
              { value: 'consulta', label: 'Consulta' },
              { value: 'control', label: 'Control' },
              { value: 'emergencia', label: 'Emergencia' },
              { value: 'seguimiento', label: 'Seguimiento' }
            ]}
          />
        </FormField>
      </div>

      <div className={styles.row}>
        <FormField
          label="Estado"
          name="status"
          error={touched.status && errors.status ? errors.status : undefined}
        >
          <Select
            name="status"
            value={formData.status}
            onChange={onChange}
            onBlur={onBlur}
            options={[
              { value: 'pendiente', label: 'Pendiente' },
              { value: 'confirmada', label: 'Confirmada' },
              { value: 'cancelada', label: 'Cancelada' },
              { value: 'completada', label: 'Completada' }
            ]}
          />
        </FormField>

        <FormField
          label="Tipo de servicio"
          name="service_type"
          error={touched.service_type && errors.service_type ? errors.service_type : undefined}
        >
          <Input
            type="text"
            name="service_type"
            value={formData.service_type}
            onChange={onChange}
            onBlur={onBlur}
            placeholder="Ej: consulta_cardiológica"
            maxLength={100}
          />
        </FormField>
      </div>
    </>
  );
};

export default AppointmentDetailsFields; 