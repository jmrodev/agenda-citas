import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../templates/DashboardLayout/DashboardLayout.jsx';
import StatCard from '../../molecules/StatCard/StatCard';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { parseAndValidateDate } from '../../../utils/date';

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
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {statCards.map(stat => (
          <StatCard key={stat.title} title={stat.title} value={stat.value} icon={stat.icon} color={stat.color} />
        ))}
      </div>

      {/* Estadísticas por doctor */}
      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ marginBottom: '1rem', color: 'var(--text-color)' }}>Estadísticas por Doctor</h2>
        <div style={{ 
          display: 'grid', 
          gap: '1rem', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' 
        }}>
          {doctorStats.map(doctor => (
            <div key={doctor.doctor_id} style={{
              background: 'var(--surface, #fff)',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              border: '1px solid var(--border-color, #e0e0e0)'
            }}>
              <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-color)' }}>
                Dr. {doctor.first_name} {doctor.last_name}
              </h3>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Total de pagos:</span>
                  <strong>{doctor.total_payments || 0}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Monto total:</span>
                  <strong>{formatCurrency(doctor.total_amount)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Promedio por pago:</span>
                  <strong>{formatCurrency(doctor.average_amount)}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Información adicional */}
      <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--surface-secondary, #f8f9fa)', borderRadius: '8px' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-color)' }}>Información adicional</h3>
        <p style={{ margin: '0', color: 'var(--text-secondary)' }}>
          <strong>Primer pago registrado:</strong> {formatDate(stats.firstPayment)}
        </p>
        <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-secondary)' }}>
          <strong>Último pago registrado:</strong> {formatDate(stats.lastPayment)}
        </p>
      </div>
    </DashboardLayout>
  );
};

export default PaymentStats; 