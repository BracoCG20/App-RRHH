import { useForm } from 'react-hook-form';
import api from '../../../api/axios';
import { X, Sparkles } from 'lucide-react';
import styles from './Modal.module.scss';

const ModalNuevoColaborador = ({ isOpen, onClose, onSuccess }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  if (!isOpen) return null;

  // Función Senior para generar RUT chileno válido
  const handleAutoRUT = () => {
    const body = Math.floor(Math.random() * (25000000 - 10000000) + 10000000);
    let sum = 0;
    let multiplier = 2;

    body
      .toString()
      .split('')
      .reverse()
      .forEach((digit) => {
        sum += parseInt(digit) * multiplier;
        multiplier = multiplier === 7 ? 2 : multiplier + 1;
      });

    const dv = 11 - (sum % 11);
    const dvFinal = dv === 11 ? '0' : dv === 10 ? 'K' : dv.toString();
    const formattedRUT = `${body.toLocaleString('es-CL')}-${dvFinal}`;

    // Seteamos el valor en el input de react-hook-form
    setValue('rut', formattedRUT, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    try {
      await api.post('/usuarios', data);
      alert('¡Colaborador registrado con éxito!');
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || 'Error al registrar colaborador');
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Registrar Colaborador</h2>
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
              <label>RUT</label>
              <div className={styles.inputGroup}>
                <input
                  {...register('rut', { required: 'El RUT es obligatorio' })}
                  placeholder='12.345.678-9'
                />
                <button
                  type='button'
                  onClick={handleAutoRUT}
                  className={styles.magicBtn}
                  title='Generar RUT aleatorio'
                >
                  <Sparkles size={16} />
                </button>
              </div>
              {errors.rut && (
                <span className={styles.error}>{errors.rut.message}</span>
              )}
            </div>

            <div className={styles.field}>
              <label>Email Corporativo</label>
              <input
                {...register('email', { required: 'Email requerido' })}
                type='email'
                placeholder='correo@braco.cl'
              />
            </div>

            <div className={styles.field}>
              <label>Nombres</label>
              <input {...register('nombres', { required: true })} />
            </div>

            <div className={styles.field}>
              <label>Apellidos</label>
              <input {...register('apellidos', { required: true })} />
            </div>

            <div className={styles.field}>
              <label>Cargo</label>
              <input
                {...register('cargo')}
                placeholder='Ej: Desarrollador Fullstack'
              />
            </div>

            <div className={styles.field}>
              <label>Rol de Acceso</label>
              <select {...register('rol')}>
                <option value='empleado'>Empleado</option>
                <option value='admin'>Administrador</option>
              </select>
            </div>
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
              Guardar Colaborador
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalNuevoColaborador;
