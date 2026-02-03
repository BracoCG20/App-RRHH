import { X, Printer, Send } from 'lucide-react';
import styles from './ModalBoleta.module.scss';

const ModalBoleta = ({ isOpen, onClose, data, empresa }) => {
  if (!isOpen || !data) return null;

  // Fecha y hora automática para auditoría y visualización
  const fechaActual = new Date().toLocaleDateString('es-PE');
  const horaActual = new Date().toLocaleTimeString('es-PE', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.actionsTop}>
          <button
            onClick={handlePrint}
            className={styles.printBtn}
          >
            <Printer size={18} />
            Imprimir Boleta
          </button>
          <button
            onClick={onClose}
            className={styles.closeBtn}
          >
            <X size={18} />
          </button>
        </div>

        <div
          className={styles.boletaContainer}
          id='boleta-imprimible'
        >
          {/* Cabecera según plantilla [cite: 1, 2, 3, 4] */}
          <header className={styles.boletaHeader}>
            <div className={styles.empresaInfo}>
              <h2>{empresa?.nombre_fiscal || 'SP SERVICES HOLDING SAC'}</h2>
              <p>RUC: {empresa?.ruc || '20608054155'}</p>
              <p>
                {empresa?.direccion_fiscal ||
                  'AV. JOSE PARDO NRO 434, INT. 501'}
              </p>
            </div>
            <div className={styles.tituloBoleta}>
              <h3>BOLETA DE PAGO</h3>
              <p>NOVIEMBRE-2025</p>
            </div>
          </header>

          {/* Datos del Trabajador [cite: 7, 10, 11, 13] */}
          <section className={styles.datosSeccion}>
            <div className={styles.gridInfo}>
              <div>
                <strong>Empleado:</strong> {data.nombres} {data.apellidos}
              </div>
              <div>
                <strong>Documento:</strong> DNI {data.dni}
              </div>
              <div>
                <strong>Cargo:</strong> {data.cargo || 'PRACTICANTE TI'}
              </div>
              <div>
                <strong>Fec. Ingreso:</strong> 01/08/25
              </div>
              <div>
                <strong>Mes:</strong> Noviembre
              </div>
              <div>
                <strong>Días Lab:</strong> 30
              </div>
            </div>
          </section>

          {/* Tabla de Conceptos [cite: 19] */}
          <table className={styles.tablaConceptos}>
            <thead>
              <tr>
                <th>INGRESOS S/</th>
                <th>DESCUENTOS S/</th>
                <th>APORTES S/</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Básico: {Number(data.sueldo_base).toFixed(2)}</td>
                <td>
                  AFP/ONP (13%): {(data.sueldo_proyectado * 0.13).toFixed(2)}
                </td>
                <td>
                  Essalud (9%): {(data.sueldo_proyectado * 0.09).toFixed(2)}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td>
                  <strong>Total Ingresos:</strong>{' '}
                  {Number(data.sueldo_proyectado).toFixed(2)}
                </td>
                <td>
                  <strong>Total Desc:</strong>{' '}
                  {(data.sueldo_proyectado * 0.13).toFixed(2)}
                </td>
                <td>
                  <strong>Neto a Pagar:</strong>{' '}
                  {(data.sueldo_proyectado * 0.87).toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Firmas y Auditoría [cite: 21, 24, 25] */}
          <footer className={styles.boletaFooter}>
            <div className={styles.firmas}>
              <div className={styles.firmaBox}>
                <div className={styles.linea}></div>Firma Empleador
              </div>
              <div className={styles.firmaBox}>
                <div className={styles.linea}></div>Firma Trabajador
              </div>
            </div>
            <div className={styles.auditoriaStamp}>
              Emitido el {fechaActual} a las {horaActual} - Sistema BRACO RRHH
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default ModalBoleta;
