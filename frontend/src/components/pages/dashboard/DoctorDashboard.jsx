import LogoutButton from '../auth/LogoutButton.jsx';

const DoctorDashboard = () => (
  <div style={{ padding: '2rem' }}>
    <h1>Dashboard Doctor (privado)</h1>
    <div style={{ marginTop: 24 }}>
      <LogoutButton />
    </div>
  </div>
);

export default DoctorDashboard;
