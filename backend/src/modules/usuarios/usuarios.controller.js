import pool from '../../config/db.js';
import bcrypt from 'bcrypt';

// ASEGÚRATE DE QUE DIGA "export const getUsuarios"
export const getUsuarios = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, rut, nombres, apellidos, email, rol, cargo, activo FROM usuarios ORDER BY apellidos ASC',
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// TAMBIÉN PARA CREAR USUARIO
export const crearUsuario = async (req, res) => {
  const { rut, nombres, apellidos, email, password, rol, cargo } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password || rut.substring(0, 4), salt);

    const query = `
            INSERT INTO usuarios (rut, nombres, apellidos, email, password_hash, rol, cargo)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, nombres, apellidos;
        `;
    const result = await pool.query(query, [
      rut,
      nombres,
      apellidos,
      email,
      hash,
      rol,
      cargo,
    ]);
    res
      .status(201)
      .json({ message: 'Colaborador creado', user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar datos del colaborador
export const actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombres, apellidos, rol, cargo, activo } = req.body;

  try {
    const query = `
            UPDATE usuarios 
            SET nombres = $1, apellidos = $2, rol = $3, cargo = $4, activo = $5
            WHERE id = $6 RETURNING *;
        `;
    const result = await pool.query(query, [
      nombres,
      apellidos,
      rol,
      cargo,
      activo,
      id,
    ]);

    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ message: 'Colaborador actualizado', user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar colaborador (Borrado físico o lógico)
export const eliminarUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
    res.json({ message: 'Colaborador eliminado correctamente' });
  } catch (error) {
    res
      .status(500)
      .json({
        error:
          'No se puede eliminar el usuario (posiblemente tiene registros de asistencia asociados)',
      });
  }
};
