import { X, Printer, Download } from 'lucide-react';
import styles from './ModalBoleta.module.scss';

const ModalBoleta = ({ isOpen, onClose, data, empresa }) => {
  if (!isOpen || !data) return null;

  const fechaEmision = new Date().toLocaleDateString('es-PE');

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <header className={styles.header}>
          <div className={styles.companyInfo}>
            <h1>BOLETA DE PAGO</h1>
            <p>
              <strong>RUC:</strong> {empresa?.ruc}
            </p>
            <p>
              <strong>Empresa:</strong> {empresa?.nombre_fiscal}
            </p>
            <p>
              <strong>Dirección:</strong> {empresa?.direccion_fiscal}
            </p>
          </div>
          <div className={styles.actions}>
            <button onClick={() => window.print()}>
              <Printer size={18} />
            </button>
            <button onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </header>

        <section className={styles.employeeInfo}>
          <div className={styles.row}>
            <span>
              <strong>Empleado:</strong> {data.nombres} {data.apellidos}
            </span>
            <span>
              <strong>DNI:</strong> {data.dni}
            </span>
          </div>
          <div className={styles.row}>
            <span>
              <strong>Cargo:</strong> {data.cargo}
            </span>
            <span>
              <strong>Fecha Emisión:</strong> {fechaEmision}
            </span>
          </div>
          <div className={styles.row}>
            <span>
              <strong>Moneda:</strong>{' '}
              {data.moneda === 'PEN' ? 'Soles' : 'Dólares'}
            </span>
          </div>
        </section>

        {/* Aquí iría la tabla de Ingresos, Descuentos y Aportes */}
        <table className={styles.boletaTable}>
          {/* ... Lógica de cálculos que hicimos antes ... */}
        </table>

        <footer className={styles.footer}>
          <div className={styles.signature}>
            <div className={styles.line}></div>
            <p>Firma del Empleador</p>
          </div>
          <div className={styles.signature}>
            <div className={styles.line}></div>
            <p>Firma del Trabajador</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ModalBoleta;
