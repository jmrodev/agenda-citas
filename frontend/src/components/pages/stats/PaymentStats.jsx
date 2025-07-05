import React, { useState, useEffect } from 'react';
import StatsGrid from '../../organisms/StatsGrid/StatsGrid.jsx';
import QuickActionsBar from '../../organisms/QuickActionsBar/QuickActionsBar.jsx';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import { authFetch } from '../../../auth/authFetch';

const PaymentStats = () => {
  const [stats, setStats] = useState({ total: 0, today: 0, pending: 0, patients: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await authFetch('/api/facility-payments/dashboard-stats');
        if (!res.ok) throw new Error('Error al cargar estadísticas');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
        // Datos mock para desarrollo
        setStats({ total: 15000, today: 2500, pending: 3500, patients: 45 });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCardsData = [
    {
      title: 'Total recaudado',
      value: `$${stats.total?.toLocaleString() || '0'}`,
      icon: <AttachMoneyIcon fontSize='inherit' />,
      color: '#43a047'
    },
    {
      title: 'Hoy',
      value: `$${stats.today?.toLocaleString() || '0'}`,
      icon: <CalendarMonthIcon fontSize='inherit' />,
      color: '#1976d2'
    },
    {
      title: 'Pendiente',
      value: `$${stats.pending?.toLocaleString() || '0'}`,
      icon: <TrendingUpIcon fontSize='inherit' />,
      color: '#fbc02d'
    },
    {
      title: 'Pacientes',
      value: stats.patients || '0',
      icon: <PeopleIcon fontSize='inherit' />,
      color: '#d32f2f'
    }
  ];

  const quickActions = [
    { label: 'Nuevo pago', icon: <AttachMoneyIcon fontSize="small" />, onClick: () => alert('Nuevo pago') },
    { label: 'Ver reportes', icon: <TrendingUpIcon fontSize="small" />, onClick: () => alert('Reportes') },
    { label: 'Exportar datos', icon: <CalendarMonthIcon fontSize="small" />, onClick: () => alert('Exportar') }
  ];

  if (loading) {
    return <div>Cargando estadísticas...</div>;
  }

  if (error) {
    return (
      <div>
        <h2>Estadísticas de Caja</h2>
        <div style={{ color: 'red', marginBottom: '1rem' }}>Error: {error}</div>
        <StatsGrid stats={statCardsData} />
        <h3>Acciones Rápidas</h3>
        <QuickActionsBar actions={quickActions} />
      </div>
    );
  }

  return (
    <div>
      <h2>Estadísticas de Caja</h2>
      <StatsGrid stats={statCardsData} />
      <h3>Acciones Rápidas</h3>
      <QuickActionsBar actions={quickActions} />
    </div>
  );
};

export default PaymentStats; 