import pool from '../../config/db.js';
import bcrypt from 'bcrypt';

export const getUsuarios = async (req, res) => {
  const { search } = req.query;
  try {
    let query =
      'SELECT id, nombres, apellidos, email, cargo, dni, rol, activo, direccion FROM usuarios';
    let params = [];

    if (search) {
      query += ` WHERE nombres ILIKE $1 OR apellidos ILIKE $1 OR email ILIKE $1 OR dni ILIKE $1`;
      params.push(`%${search}%`);
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const crearUsuario = async (req, res) => {
  const {
    rut,
    dni,
    nombres,
    apellidos,
    email,
    password,
    rol,
    cargo,
    direccion,
  } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    // Usamos el RUT o DNI para la contraseña inicial si no se provee una
    const hash = await bcrypt.hash(password || rut || dni, salt);

    const query = `
      INSERT INTO usuarios (rut, dni, nombres, apellidos, email, password_hash, rol, cargo, direccion, activo)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)
      RETURNING id, nombres, apellidos;
    `;
    const result = await pool.query(query, [
      rut,
      dni,
      nombres,
      apellidos,
      email,
      hash,
      rol,
      cargo,
      direccion,
    ]);
    res
      .status(201)
      .json({ message: 'Colaborador creado', user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const editarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombres, apellidos, dni, email, cargo, rol, direccion, activo } =
    req.body;
  try {
    const query = `
      UPDATE usuarios 
      SET nombres = $1, apellidos = $2, dni = $3, email = $4, cargo = $5, rol = $6, direccion = $7, activo = $8
      WHERE id = $9 RETURNING *;
    `;
    const result = await pool.query(query, [
      nombres,
      apellidos,
      dni,
      email,
      cargo,
      rol,
      direccion,
      activo,
      id,
    ]);

    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const eliminarUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
    res.json({ message: 'Colaborador eliminado correctamente' });
  } catch (error) {
    res.status(500).json({
      error: 'No se puede eliminar el usuario (tiene registros asociados)',
    });
  }
};
