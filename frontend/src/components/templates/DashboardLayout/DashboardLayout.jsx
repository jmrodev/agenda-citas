import styles from './DashboardLayout.module.css';
import LogoutButton from '../../pages/auth/LogoutButton.jsx';
import QuickActionsBar from '../../organisms/QuickActionsBar/QuickActionsBar.jsx';
import RecentUsersList from '../../organisms/RecentUsersList/RecentUsersList.jsx';
import ActivityLogList from '../../organisms/ActivityLogList/ActivityLogList.jsx';
import StatsGrid from '../../organisms/StatsGrid/StatsGrid.jsx';
import UpcomingAppointmentsList from '../../organisms/UpcomingAppointmentsList/UpcomingAppointmentsList.jsx';

const DashboardLayout = ({
  title,
  actions = [],
  users = [],
  activities = [],
  stats = [],
  appointments = [],
  children
}) => (
  <div className={styles.dashboardContainer}>
    <header className={styles.header}>
      <h1>{title}</h1>
      <LogoutButton />
    </header>
    <aside className={styles.aside}>
      <QuickActionsBar actions={actions} />
    </aside>
    <main className={styles.main}>
      <RecentUsersList users={users} />
      <ActivityLogList activities={activities} />
      <StatsGrid stats={stats} />
      <UpcomingAppointmentsList appointments={appointments} />
      {children}
    </main>
  </div>
);

export default DashboardLayout; 