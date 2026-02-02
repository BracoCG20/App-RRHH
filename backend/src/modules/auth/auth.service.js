import pool from '../../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerUser = async (userData) => {
  const { rut, nombres, apellidos, email, password, rol } = userData;

  // Encriptamos la contraseña (10 rondas de sal)
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const query = `
        INSERT INTO usuarios (rut, nombres, apellidos, email, password_hash, rol)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, email, nombres;
    `;

  const values = [
    rut,
    nombres,
    apellidos,
    email,
    passwordHash,
    rol || 'empleado',
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const loginUser = async (email, password) => {
  const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [
    email,
  ]);
  const user = result.rows[0];

  if (!user) throw new Error('Usuario no encontrado');

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) throw new Error('Contraseña incorrecta');

  // Generamos el Token JWT
  const token = jwt.sign(
    { id: user.id, rol: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: '8h' },
  );

  return { token, user: { id: user.id, nombres: user.nombres, rol: user.rol } };
};
