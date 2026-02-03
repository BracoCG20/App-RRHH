import { useState, useEffect } from 'react';
import { Users, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import api from '../../../api/axios';
import styles from './Dashboard.module.scss';

const StatCard = ({ title, value, icon, color }) => (
  <div className={styles.card}>
    <div className={styles.cardInfo}>
      <span className={styles.cardTitle}>{title}</span>
      <h3 className={styles.cardValue}>{value}</h3>
    </div>
    <div className={`${styles.iconContainer} ${styles[color]}`}>{icon}</div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmpleados: 0,
    presentesHoy: 0,
    costoNomina: 0,
    pendientesFirma: 0,
  });
  const [loading, setLoading] = useState(true);

  // Obtenemos info del usuario desde el token
  const token = localStorage.getItem('token');
  let userData = null;
  if (token) {
    try {
      userData = jwtDecode(token);
    } catch (e) {
      console.error('Token inválido');
    }
  }

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Llamada al nuevo endpoint de estadísticas reales
        const response = await api.get('/dashboard/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error al cargar estadísticas del dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Cálculo de porcentaje de presentes
  const asistenciaPorcentaje =
    stats.totalEmpleados > 0
      ? `${Math.round((stats.presentesHoy / stats.totalEmpleados) * 100)}%`
      : '0%';

  // Formateo de moneda para el costo de nómina
  const formatoMoneda = (valor) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      maximumFractionDigits: 0,
    }).format(valor);
  };

  if (loading)
    return <div className={styles.loading}>Actualizando métricas...</div>;

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.welcome}>
        <h1>Bienvenido, {userData?.nombres || 'Administrador'}</h1>
        <p>Esto es lo que está pasando hoy en la empresa.</p>
      </header>

      <div className={styles.statsGrid}>
        <StatCard
          title='Total Empleados'
          value={stats.totalEmpleados}
          icon={<Users size={24} />}
          color='purple'
        />
        <StatCard
          title='Presentes Hoy'
          value={asistenciaPorcentaje}
          icon={<Clock size={24} />}
          color='green'
        />
        <StatCard
          title='Pendientes de Firma'
          value={stats.pendientesFirma}
          icon={<AlertCircle size={24} />}
          color='gold'
        />
        <StatCard
          title='Costo Nómina Mes'
          value={formatoMoneda(stats.costoNomina)}
          icon={<TrendingUp size={24} />}
          color='blue'
        />
      </div>
    </div>
  );
};

export default Dashboard;
