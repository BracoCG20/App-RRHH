import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../../api/axios';
import { X, UserCheck, Save, Sparkles } from 'lucide-react';
import styles from './Modal.module.scss';
import Swal from 'sweetalert2';

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

  const isEditing = !!usuarioAEditar;

  // Función para generar RUT válido (Lógica previa restaurada)
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

    setValue('rut', formattedRUT, { shouldValidate: true });
  };

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
      if (isEditing) {
        await api.put(`/usuarios/${usuarioAEditar.id}`, data);
        Swal.fire({
          title: '¡Éxito!',
          text: 'Colaborador actualizado',
          icon: 'success',
          confirmButtonColor: '#6366f1', // Color de tu tema
        });
      } else {
        await api.post('/usuarios', data);
        Swal.fire({
          title: '¡Éxito!',
          text: 'Colaborador registrado correctamente',
          icon: 'success',
          confirmButtonColor: '#6366f1', // Color de tu tema
        });
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
            {isEditing ? <Save size={24} /> : <UserCheck size={24} />}
            {isEditing ? ' Editar Colaborador' : ' Registrar Colaborador'}
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
            {/* CAMPO RUT: Solo lectura si se está editando */}
            <div className={styles.field}>
              <label>RUT (ID de Sistema)</label>
              <div className={styles.inputGroup}>
                <input
                  {...register('rut', { required: 'RUT requerido' })}
                  placeholder='12.345.678-9'
                  readOnly={isEditing}
                  className={isEditing ? styles.readOnlyInput : ''}
                />
                {!isEditing && (
                  <button
                    type='button'
                    onClick={handleAutoRUT}
                    className={styles.magicBtn}
                    title='Generar RUT'
                  >
                    <Sparkles size={16} />
                  </button>
                )}
              </div>
            </div>

            <div className={styles.field}>
              <label>DNI (Identificación Legal)</label>
              <input
                {...register('dni', {
                  required: 'DNI requerido',
                  minLength: 8,
                })}
                maxLength={8}
                placeholder='46027897'
              />
            </div>

            <div className={styles.field}>
              <label>Email Corporativo</label>
              <input
                {...register('email', { required: true })}
                type='email'
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
              <input {...register('cargo')} />
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
              <input {...register('direccion')} />
            </div>

            {isEditing && (
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
              {isEditing ? 'Guardar Cambios' : 'Finalizar Registro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalNuevoColaborador;
