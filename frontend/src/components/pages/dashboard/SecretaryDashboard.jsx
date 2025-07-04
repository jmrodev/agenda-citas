import React from 'react';
import DashboardLayout from '../../templates/DashboardLayout/DashboardLayout.jsx';

const SecretaryDashboard = () => {
  return (
    <DashboardLayout title='Dashboard de Secretaría'>
      <div style={{ margin: '2rem 0' }}>
        <h2>Bienvenida al dashboard clásico de Secretaría</h2>
        <p>Ahora puedes acceder a la nueva app de escritorio desde aquí:</p>
        <a href='/desktop' style={{ color: 'var(--primary-color)', fontWeight: 600, fontSize: 18 }}>Ir a la app de escritorio</a>
      </div>
    </DashboardLayout>
  );
};

export default SecretaryDashboard;