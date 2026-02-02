import { useForm } from 'react-hook-form';
import api from '../../../api/axios';
import styles from './Login.module.scss';

const Login = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await api.post('/auth/login', data);
      localStorage.setItem('token', response.data.token);
      window.location.href = '/'; // Redirigir al Dashboard
    } catch (error) {
      alert('Error al iniciar sesión: ' + error.response?.data?.error);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form
        className={styles.loginCard}
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2>
          Bienvenido a <span className={styles.brand}>BRACO</span>
        </h2>
        <input
          {...register('email')}
          type='email'
          placeholder='Correo electrónico'
          required
        />
        <input
          {...register('password')}
          type='password'
          placeholder='Contraseña'
          required
        />
        <button type='submit'>Ingresar</button>
      </form>
    </div>
  );
};

export default Login;
