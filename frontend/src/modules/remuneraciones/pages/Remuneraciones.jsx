import { useEffect, useState } from 'react';
import api from '../../../api/axios';
import { DollarSign, Download, FileText } from 'lucide-react';
import styles from './Remuneraciones.module.scss';

const Remuneraciones = () => {
  const [nomina, setNomina] = useState([]);

  useEffect(() => {
    const fetchNomina = async () => {
      try {
        const response = await api.get('/remuneraciones/resumen');
        setNomina(response.data);
      } catch (error) {
        console.error('Error cargando nómina');
      }
    };
    fetchNomina();
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>Resumen de Nómina Mensual</h2>
        <button className={styles.exportBtn}>
          <Download size={18} /> Exportar Previred
        </button>
      </header>

      <div className={styles.grid}>
        {nomina.map((item, index) => (
          <div
            key={index}
            className={styles.salaryCard}
          >
            <div className={styles.user}>
              <strong>
                {item.nombres} {item.apellidos}
              </strong>
              <span>
                Sueldo Base: ${Number(item.sueldo_base).toLocaleString('es-CL')}
              </span>
            </div>
            <div className={styles.amount}>
              <p>Proyectado al día:</p>
              <h3>
                ${Math.round(item.sueldo_proyectado).toLocaleString('es-CL')}
              </h3>
            </div>
            <button className={styles.detailBtn}>
              <FileText size={16} /> Ver Liquidación
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Remuneraciones;
