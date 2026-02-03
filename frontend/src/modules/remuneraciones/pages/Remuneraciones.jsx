import { useEffect, useState } from 'react';
import api from '../../../api/axios';
import { Download, FileText, RefreshCw, DollarSign } from 'lucide-react';
import ModalContrato from '../components/ModalContrato';
import ModalBoleta from '../components/ModalBoleta';
import styles from './Remuneraciones.module.scss';

const Remuneraciones = () => {
  const [nomina, setNomina] = useState([]);
  const [currency, setCurrency] = useState('PEN');
  const [tc] = useState(3.75);
  const [isModalContratoOpen, setIsModalContratoOpen] = useState(false);
  const [isModalBoletaOpen, setIsModalBoletaOpen] = useState(false);
  const [selectedUserForBoleta, setSelectedUserForBoleta] = useState(null);

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

  // LÓGICA DE CÁLCULO DIFERENCIADA
  const calcularNetoReal = (item) => {
    const cargo = item.cargo?.toLowerCase() || '';
    // Si no hay asistencias marcadas, usamos el sueldo base como referencia para no mostrar 0.00
    const montoReferencia =
      item.sueldo_proyectado > 0 ? item.sueldo_proyectado : item.sueldo_base;

    // PRACTICANTES: Reciben subvención económica líquida (sin descuentos de ley)
    if (cargo.includes('practicante')) {
      return montoReferencia;
    }

    // EMPLEADOS: Retención estándar (AFP/ONP ~13%)
    const tasaDescuento = 0.13;
    return montoReferencia * (1 - tasaDescuento);
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
            const netoAPagar = calcularNetoReal(item);

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
                  {/* Badge de estado profesional */}
                  <div
                    className={
                      item.activo !== false
                        ? styles.badgeActive
                        : styles.badgeInactive
                    }
                  >
                    {item.activo !== false ? 'Activo' : 'Inactivo'}
                  </div>
                </div>

                <div className={styles.mainAmount}>
                  <p>Neto Proyectado (a pagar)</p>
                  <h3>{formatMoney(netoAPagar)}</h3>
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

      <ModalContrato
        isOpen={isModalContratoOpen}
        onClose={() => setIsModalContratoOpen(false)}
        onSuccess={fetchNomina}
      />
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
