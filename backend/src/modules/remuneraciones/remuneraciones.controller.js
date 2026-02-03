import pool from '../../config/db.js';

export const getResumenNomina = async (req, res) => {
  try {
    const query = `
            SELECT 
                u.nombres, u.apellidos, c.sueldo_base,
                (c.sueldo_base / 30 * (SELECT COUNT(*) FROM asistencia WHERE usuario_id = u.id AND estado = 'presente')) as sueldo_proyectado
            FROM usuarios u
            INNER JOIN contratos c ON u.id = c.usuario_id
            WHERE u.activo = true;
        `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
