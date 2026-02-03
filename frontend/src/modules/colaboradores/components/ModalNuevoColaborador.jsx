import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../../api/axios';
import { X, UserCheck, Save } from 'lucide-react';
import styles from './Modal.module.scss';

const ModalNuevoColaborador = ({
  isOpen,
  onClose,
  onSuccess,
  usuarioAEditar = null,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (usuarioAEditar) {
      Object.keys(usuarioAEditar).forEach((key) =>
        setValue(key, usuarioAEditar[key]),
      );
    } else {
      reset({ rol: 'empleado', activo: true });
    }
  }, [usuarioAEditar, setValue, reset, isOpen]);

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    try {
      if (usuarioAEditar) {
        await api.put(`/usuarios/${usuarioAEditar.id}`, data);
        alert('Colaborador actualizado');
      } else {
        await api.post('/usuarios', data);
        alert('Colaborador registrado');
      }
      onSuccess();
      onClose();
    } catch (error) {
      alert(error.response?.data?.error || 'Error en la operación');
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>
            {usuarioAEditar ? <Save size={24} /> : <UserCheck size={24} />}
            {usuarioAEditar ? ' Editar Colaborador' : ' Registrar Colaborador'}
          </h2>
          <button
            onClick={onClose}
            className={styles.closeBtn}
          >
            <X size={24} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.form}
        >
          <div className={styles.grid}>
            <div className={styles.field}>
              <label>DNI</label>
              <input
                {...register('dni', {
                  required: 'DNI requerido',
                  minLength: 8,
                })}
                placeholder='46027897'
                maxLength={8}
              />
              {errors.dni && (
                <span className={styles.error}>{errors.dni.message}</span>
              )}
            </div>

            <div className={styles.field}>
              <label>Email Corporativo</label>
              <input
                {...register('email', { required: 'Email requerido' })}
                type='email'
                placeholder='ejemplo@braco.pe'
              />
            </div>

            <div className={styles.field}>
              <label>Nombres</label>
              <input
                {...register('nombres', { required: 'Nombres requeridos' })}
              />
            </div>

            <div className={styles.field}>
              <label>Apellidos</label>
              <input
                {...register('apellidos', { required: 'Apellidos requeridos' })}
              />
            </div>

            <div className={styles.field}>
              <label>Cargo</label>
              <input
                {...register('cargo')}
                placeholder='Ej: Analista'
              />
            </div>

            <div className={styles.field}>
              <label>Rol de Sistema</label>
              <select {...register('rol')}>
                <option value='empleado'>Empleado</option>
                <option value='admin'>Administrador</option>
              </select>
            </div>

            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label>Dirección</label>
              <input
                {...register('direccion')}
                placeholder='Av. Siempre Viva 123'
              />
            </div>

            {usuarioAEditar && (
              <div className={styles.field}>
                <label>Estado de Cuenta</label>
                <select {...register('activo')}>
                  <option value={true}>Activo</option>
                  <option value={false}>Inactivo</option>
                </select>
              </div>
            )}
          </div>

          <div className={styles.footer}>
            <button
              type='button'
              onClick={onClose}
              className={styles.cancelBtn}
            >
              Cancelar
            </button>
            <button
              type='submit'
              className={styles.saveBtn}
            >
              {usuarioAEditar ? 'Guardar Cambios' : 'Finalizar Registro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalNuevoColaborador;
