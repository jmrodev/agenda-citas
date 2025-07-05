import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../templates/DashboardLayout/DashboardLayout.jsx';
import StatCard from '../../molecules/StatCard/StatCard';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import styles from './PaymentStats.module.css';

const PaymentStats = () => {
  const [stats, setStats] = useState({
    totalPayments: 0,
    totalAmount: 0,
    averageAmount: 0,
    firstPayment: null,
    lastPayment: null
  });
  const [doctorStats, setDoctorStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('token');
      try {
        const [statsRes, doctorStatsRes] = await Promise.all([
          fetch('/api/facility-payments/stats', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/facility-payments/stats/by-doctor', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);
        
        const statsData = await statsRes.json();
        const doctorStatsData = await doctorStatsRes.json();
        
        setStats(statsData);
        setDoctorStats(doctorStatsData);
      } catch (error) {
        console.error('Error fetching payment stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-AR');
  };

  const statCards = [
    {
      title: 'Total de pagos',
      value: stats.totalPayments || 0,
      icon: <AttachMoneyIcon fontSize='inherit' />,
      color: '#43a047'
    },
    {
      title: 'Monto total',
      value: formatCurrency(stats.totalAmount),
      icon: <TrendingUpIcon fontSize='inherit' />,
      color: '#1976d2'
    },
    {
      title: 'Promedio por pago',
      value: formatCurrency(stats.averageAmount),
      icon: <PeopleIcon fontSize='inherit' />,
      color: '#fbc02d'
    },
    {
      title: 'Último pago',
      value: formatDate(stats.lastPayment),
      icon: <CalendarTodayIcon fontSize='inherit' />,
      color: '#d32f2f'
    }
  ];

  if (loading) {
    return (
      <DashboardLayout title='Estadísticas de Caja'>
        <div>Cargando estadísticas...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title='Estadísticas de Caja'>
      {/* Cards principales */}
      <div className={styles.statsCardContainer}>
        {statCards.map(stat => (
          <StatCard key={stat.title} title={stat.title} value={stat.value} icon={stat.icon} color={stat.color} />
        ))}
      </div>

      {/* Estadísticas por doctor */}
      <div className={styles.sectionContainer}>
        <h2 className={styles.sectionTitle}>Estadísticas por Doctor</h2>
        <div className={styles.doctorStatsGrid}>
          {doctorStats.map(doctor => (
            <div key={doctor.doctor_id} className={styles.doctorStatCard}>
              <h3 className={styles.doctorNameTitle}>
                Dr. {doctor.first_name} {doctor.last_name}
              </h3>
              <div className={styles.doctorStatDetails}>
                <div className={styles.statDetailRow}>
                  <span>Total de pagos:</span>
                  <strong>{doctor.total_payments || 0}</strong>
                </div>
                <div className={styles.statDetailRow}>
                  <span>Monto total:</span>
                  <strong>{formatCurrency(doctor.total_amount)}</strong>
                </div>
                <div className={styles.statDetailRow}>
                  <span>Promedio por pago:</span>
                  <strong>{formatCurrency(doctor.average_amount)}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Información adicional */}
      <div className={styles.additionalInfoContainer}>
        <h3 className={styles.additionalInfoTitle}>Información adicional</h3>
        <p className={styles.additionalInfoText}>
          <strong>Primer pago registrado:</strong> {formatDate(stats.firstPayment)}
        </p>
        <p className={styles.additionalInfoTextWithMargin}>
          <strong>Último pago registrado:</strong> {formatDate(stats.lastPayment)}
        </p>
      </div>
    </DashboardLayout>
  );
};

export default PaymentStats; 