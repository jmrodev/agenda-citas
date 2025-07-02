import LogoutButton from '../auth/LogoutButton.jsx';

const SecretaryDashboard = () => (
  <div style={{ padding: '2rem' }}>
    <h1>Dashboard Secretaria (privado)</h1>
    <div style={{ marginTop: 24 }}>
      <LogoutButton />
    </div>
  </div>
);

export default SecretaryDashboard;