import { useState, useEffect } from 'react';
import { X, Search, TrendingUp } from 'lucide-react';
import api from '../../../api/axios';
import styles from './ModalContrato.module.scss';

const ModalContrato = ({ isOpen, onClose, onSuccess }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    sueldo_base: '',
    moneda: 'PEN',
    afp: 'Integra',
    salud: 'EsSalud',
    cargo: '',
  });

  // Buscador en tiempo real
  useEffect(() => {
    if (query.length > 2) {
      api.get(`/usuarios?search=${query}`).then((res) => setResults(res.data));
    } else {
      setResults([]);
    }
  }, [query]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/remuneraciones/configurar', {
        ...formData,
        usuario_id: selectedUser.id,
      });
      alert('Contrato/Ascenso procesado correctamente');
      onSuccess();
      onClose();
    } catch (error) {
      alert('Error al guardar');
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>
            <TrendingUp size={20} /> Configurar Contrato / Ascenso
          </h3>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {!selectedUser ? (
          <div className={styles.searchSection}>
            <label>Buscar Colaborador (Nombre o Correo)</label>
            <div className={styles.searchInput}>
              <Search size={18} />
              <input
                type='text'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Ej: Juan Perez...'
              />
            </div>
            <div className={styles.results}>
              {results.map((u) => (
                <div
                  key={u.id}
                  className={styles.userResult}
                  onClick={() => {
                    setSelectedUser(u);
                    setFormData({ ...formData, cargo: u.cargo });
                  }}
                >
                  {u.nombres} {u.apellidos} <span>({u.email})</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className={styles.form}
          >
            <div className={styles.selectedUser}>
              Seleccionado: <strong>{selectedUser.nombres}</strong>
              <button
                type='button'
                onClick={() => setSelectedUser(null)}
              >
                Cambiar
              </button>
            </div>

            <div className={styles.grid}>
              <div className={styles.field}>
                <label>Nuevo Cargo / Cargo Actual</label>
                <input
                  type='text'
                  value={formData.cargo}
                  onChange={(e) =>
                    setFormData({ ...formData, cargo: e.target.value })
                  }
                  required
                />
              </div>
              <div className={styles.field}>
                <label>Sueldo Base</label>
                <input
                  type='number'
                  value={formData.sueldo_base}
                  onChange={(e) =>
                    setFormData({ ...formData, sueldo_base: e.target.value })
                  }
                  required
                />
              </div>
              <div className={styles.field}>
                <label>Moneda</label>
                <select
                  value={formData.moneda}
                  onChange={(e) =>
                    setFormData({ ...formData, moneda: e.target.value })
                  }
                >
                  <option value='PEN'>Soles (S/)</option>
                  <option value='USD'>Dólares ($)</option>
                </select>
              </div>
              <div className={styles.field}>
                <label>Sistema de Pensiones</label>
                <select
                  value={formData.afp}
                  onChange={(e) =>
                    setFormData({ ...formData, afp: e.target.value })
                  }
                >
                  <option value='Integra'>AFP Integra</option>
                  <option value='Prima'>AFP Prima</option>
                  <option value='Profuturo'>AFP Profuturo</option>
                  <option value='SNP'>ONP (SNP)</option>
                </select>
              </div>
            </div>
            <button
              type='submit'
              className={styles.saveBtn}
            >
              Guardar Cambios
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ModalContrato;
