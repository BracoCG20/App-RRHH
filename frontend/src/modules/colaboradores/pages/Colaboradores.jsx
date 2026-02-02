import { useEffect, useState } from 'react';
import api from '../../../api/axios';
import { UserPlus, Search, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import ModalNuevoColaborador from '../components/ModalNuevoColaborador.jsx';
import styles from './Colaboradores.module.scss';

const Colaboradores = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenu, setActiveMenu] = useState(null); // Control para el menú abierto

  const fetchUsers = async () => {
    try {
      const response = await api.get('/usuarios');
      setUsers(response.data);
    } catch (error) {
      console.error('Error al cargar colaboradores', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEliminar = async (id, nombre) => {
    setActiveMenu(null); // Cerrar menú antes de la alerta
    if (window.confirm(`¿Estás seguro de que deseas eliminar a ${nombre}?`)) {
      try {
        await api.delete(`/usuarios/${id}`);
        setUsers(users.filter((user) => user.id !== id));
        alert('Colaborador eliminado correctamente');
      } catch (error) {
        alert(error.response?.data?.error || 'No se pudo eliminar');
      }
    }
  };

  const handleEdit = (user) => {
    setActiveMenu(null);
    alert(
      `Editando a ${user.nombres}... (Aquí abriremos el Modal de Edición próximamente)`,
    );
  };

  const filteredUsers = users.filter(
    (user) =>
      `${user.nombres} ${user.apellidos}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) || user.rut.includes(searchTerm),
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.searchBar}>
          <Search size={18} />
          <input
            type='text'
            placeholder='Buscar por nombre o RUT...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          className={styles.addBtn}
          onClick={() => setIsModalOpen(true)}
        >
          <UserPlus size={18} />
          Nuevo Colaborador
        </button>
      </header>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Colaborador</th>
              <th>RUT</th>
              <th>Cargo</th>
              <th>Rol</th>
              <th>Estado</th>
              <th style={{ textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className={styles.userInfo}>
                    <div className={styles.avatar}>{user.nombres[0]}</div>
                    <div>
                      <p className={styles.name}>
                        {user.nombres} {user.apellidos}
                      </p>
                      <p className={styles.email}>{user.email}</p>
                    </div>
                  </div>
                </td>
                <td>{user.rut}</td>
                <td>{user.cargo || 'No asignado'}</td>
                <td>
                  <span className={styles.roleTag}>{user.rol}</span>
                </td>
                <td>
                  <span
                    className={user.activo ? styles.active : styles.inactive}
                  >
                    {user.activo ? '● Activo' : '○ Inactivo'}
                  </span>
                </td>
                <td className={styles.actionsCell}>
                  <div className={styles.dropdownContainer}>
                    <button
                      className={styles.actionMenuBtn}
                      onClick={() =>
                        setActiveMenu(activeMenu === user.id ? null : user.id)
                      }
                    >
                      <MoreVertical size={20} />
                    </button>

                    {activeMenu === user.id && (
                      <div className={styles.dropdownMenu}>
                        <button onClick={() => handleEdit(user)}>
                          <Edit2 size={14} /> Editar
                        </button>
                        <button
                          onClick={() => handleEliminar(user.id, user.nombres)}
                          className={styles.deleteOption}
                        >
                          <Trash2 size={14} /> Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ModalNuevoColaborador
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchUsers}
      />
    </div>
  );
};

export default Colaboradores;
