import LogoutButton from '../auth/LogoutButton.jsx';

const Dashboard = () => (
  <div style={{ padding: '2rem' }}>
    <h1>Dashboard Admin (privado)</h1>
    <div style={{ marginTop: 24 }}>
      <LogoutButton />
    </div>
  </div>
);

export default Dashboard;