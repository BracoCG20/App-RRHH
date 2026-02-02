import { Users, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import api from '../../../api/axios';
import styles from './Dashboard.module.scss';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

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
  const [serverStatus, setServerStatus] = useState('Conectando...');
  const token = localStorage.getItem('token');
  const user = token ? jwtDecode(token) : null;
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await api.get('/health');
        setServerStatus(`✅ ${response.data.message}`);
      } catch (error) {
        setServerStatus('❌ Error al conectar con el servidor');
      }
    };
    checkHealth();
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.welcome}>
        <h1>Bienvenido, {user?.nombres || 'Administrador'}</h1>
        <p>Esto es lo que está pasando hoy en la empresa.</p>
      </header>

      <div className={styles.statsGrid}>
        <StatCard
          title='Total Empleados'
          value='124'
          icon={<Users />}
          color='purple'
        />
        <StatCard
          title='Presentes Hoy'
          value='98%'
          icon={<Clock />}
          color='green'
        />
        <StatCard
          title='Pendientes de Firma'
          value='12'
          icon={<AlertCircle />}
          color='gold'
        />
        <StatCard
          title='Costo Nómina Mes'
          value='$45.2M'
          icon={<TrendingUp />}
          color='blue'
        />
      </div>
    </div>
  );
};

export default Dashboard;
