import { useState, useEffect } from 'react';
import { Clock, MapPin, Play, Square } from 'lucide-react';
import api from '../../../api/axios';
import styles from './Asistencia.module.scss';

const Asistencia = () => {
  const [time, setTime] = useState(new Date());
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [historial, setHistorial] = useState([]); // Nuevo estado para el historial

  const fetchHistorial = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/asistencia/mis-marcas', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistorial(response.data);

      // Si la última marca no tiene hora de salida, el usuario está "Clocked In"
      if (response.data.length > 0 && !response.data[0].hora_salida) {
        setIsClockedIn(true);
      } else {
        setIsClockedIn(false);
      }
    } catch (error) {
      console.error('Error al cargar historial', error);
    }
  };

  useEffect(() => {
    fetchHistorial();
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClockAction = () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const token = localStorage.getItem('token');
        const response = await api.post(
          '/asistencia/marcar',
          { latitud: latitude, longitud: longitude },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        alert(response.data.message);
        fetchHistorial(); // <--- Refrescamos el historial automáticamente
      } catch (error) {
        alert(
          'Error al marcar: ' + (error.response?.data?.error || error.message),
        );
      }
    });
  };

  return (
    <div className={styles.container}>
      {/* ... (Sección del Reloj Digital que ya tienes) ... */}

      <div className={styles.historyCard}>
        <h3>Marcajes Recientes</h3>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Entrada</th>
                <th>Salida</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((marca, index) => (
                <tr key={index}>
                  <td>{new Date(marca.fecha).toLocaleDateString()}</td>
                  <td>{marca.hora_entrada || '--:--'}</td>
                  <td>{marca.hora_salida || '--:--'}</td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${styles[marca.estado]}`}
                    >
                      {marca.estado}
                    </span>
                  </td>
                </tr>
              ))}
              {historial.length === 0 && (
                <tr>
                  <td
                    colSpan='4'
                    style={{ textAlign: 'center' }}
                  >
                    No hay registros aún
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default Asistencia;
