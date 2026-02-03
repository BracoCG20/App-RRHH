import { useEffect, useState } from 'react';
import api from '../../../api/axios';
import { Download, FileText, RefreshCw, DollarSign } from 'lucide-react';
import ModalContrato from '../components/ModalContrato';
import ModalBoleta from '../components/ModalBoleta'; // Importamos el nuevo modal de boleta
import styles from './Remuneraciones.module.scss';

const Remuneraciones = () => {
  const [nomina, setNomina] = useState([]);
  const [currency, setCurrency] = useState('PEN');
  const [tc] = useState(3.75);
  const [isModalContratoOpen, setIsModalContratoOpen] = useState(false);
  const [isModalBoletaOpen, setIsModalBoletaOpen] = useState(false);
  const [selectedUserForBoleta, setSelectedUserForBoleta] = useState(null);

  // Datos fiscales de la empresa para la boleta
  const datosEmpresa = {
    ruc: '20600000000',
    nombre_fiscal: 'BRACO SOLUTIONS S.A.C.',
    direccion_fiscal: 'Av. Javier Prado Este 123, San Isidro, Lima',
  };

  const fetchNomina = async () => {
    try {
      const response = await api.get('/remuneraciones/resumen');
      setNomina(response.data);
    } catch (error) {
      console.error('Error cargando nómina', error);
    }
  };

  useEffect(() => {
    fetchNomina();
  }, []);

  const calcularNetoReal = (montoBruto) => {
    const tasaDescuento = 0.13; // 13% promedio (AFP/ONP)
    return montoBruto * (1 - tasaDescuento);
  };

  const formatMoney = (amount) => {
    const finalAmount = currency === 'USD' ? amount / tc : amount;
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(finalAmount);
  };

  const handleVerBoleta = (colaborador) => {
    setSelectedUserForBoleta(colaborador);
    setIsModalBoletaOpen(true);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h2>Gestión de Planillas</h2>
          <p>
            Periodo:{' '}
            {new Date().toLocaleString('es-PE', {
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>

        <div className={styles.actions}>
          <div className={styles.currencyToggle}>
            <button
              className={currency === 'PEN' ? styles.active : ''}
              onClick={() => setCurrency('PEN')}
            >
              Soles (S/)
            </button>
            <button
              className={currency === 'USD' ? styles.active : ''}
              onClick={() => setCurrency('USD')}
            >
              Dólares ($)
            </button>
          </div>

          <button className={styles.exportBtn}>
            <Download size={18} /> Exportar PLAME (SUNAT)
          </button>

          <button
            className={styles.addSalaryBtn}
            onClick={() => setIsModalContratoOpen(true)}
          >
            <DollarSign size={18} /> Configurar Sueldo / Ascenso
          </button>
        </div>
      </header>

      <div className={styles.grid}>
        {nomina.length > 0 ? (
          nomina.map((item, index) => {
            const netoProyectado = calcularNetoReal(item.sueldo_proyectado);

            return (
              <div
                key={index}
                className={styles.salaryCard}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.userInfo}>
                    <strong>
                      {item.nombres} {item.apellidos}
                    </strong>
                    <span>Sueldo Bruto: {formatMoney(item.sueldo_base)}</span>
                    <small className={styles.cargoTag}>
                      {item.cargo || 'Sin cargo'}
                    </small>
                  </div>
                  {/* Círculo de estado dinámico */}
                  <div
                    className={
                      item.activo !== false
                        ? styles.badgeActive
                        : styles.badgeInactive
                    }
                  >
                    {item.activo !== false ? '● Activo' : '○ Inactivo'}
                  </div>
                </div>

                <div className={styles.mainAmount}>
                  <p>Neto Proyectado (a pagar)</p>
                  <h3>{formatMoney(netoProyectado)}</h3>
                </div>

                <div className={styles.footer}>
                  <button
                    className={styles.detailBtn}
                    onClick={() => handleVerBoleta(item)}
                  >
                    <FileText size={16} /> Ver Boleta
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className={styles.noData}>
            No hay contratos configurados todavía.
          </div>
        )}
      </div>

      {/* Modal de Configuración de Contratos */}
      <ModalContrato
        isOpen={isModalContratoOpen}
        onClose={() => setIsModalContratoOpen(false)}
        onSuccess={fetchNomina}
      />

      {/* Modal de Visualización de Boleta */}
      <ModalBoleta
        isOpen={isModalBoletaOpen}
        onClose={() => setIsModalBoletaOpen(false)}
        data={selectedUserForBoleta}
        empresa={datosEmpresa}
      />
    </div>
  );
};

export default Remuneraciones;
