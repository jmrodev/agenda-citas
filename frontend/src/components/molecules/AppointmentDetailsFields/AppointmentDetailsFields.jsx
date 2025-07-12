import React from 'react';
import FormGroup from '../FormGroup/FormGroup';
import Input from '../../atoms/Input/Input';
import Select from '../../atoms/Select/Select';
import TextArea from '../../atoms/Textarea/Textarea';
import styles from './AppointmentDetailsFields.module.css';

const AppointmentDetailsFields = ({
  formData,
  onChange,
  errors = {},
  touched = {}
}) => {
  return (
    <>
      <div className={styles.row}>
        <TextArea
          name="reason"
          value={formData.reason}
          onChange={onChange}
          errors={errors}
          touched={touched}
        />

        <FormGroup title="Tipo de consulta">
          <Select
            name="type"
            value={formData.type}
            onChange={onChange}
            options={[
              { value: 'consulta', label: 'Consulta' },
              { value: 'control', label: 'Control' },
              { value: 'emergencia', label: 'Emergencia' },
              { value: 'seguimiento', label: 'Seguimiento' }
            ]}
          />
        </FormGroup>
      </div>

      <div className={styles.row}>
        <FormGroup title="Estado">
          <Select
            name="status"
            value={formData.status}
            onChange={onChange}
            options={[
              { value: 'pendiente', label: 'Pendiente' },
              { value: 'confirmada', label: 'Confirmada' },
              { value: 'cancelada', label: 'Cancelada' },
              { value: 'completada', label: 'Completada' }
            ]}
          />
        </FormGroup>

        <FormGroup title="Tipo de servicio">
          <Input
            type="text"
            name="service_type"
            value={formData.service_type}
            onChange={onChange}
            placeholder="Ej: consulta_cardiológica"
            maxLength={100}
          />
        </FormGroup>
      </div>
    </>
  );
};

export default AppointmentDetailsFields; 