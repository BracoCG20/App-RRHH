import pool from '../../config/db.js';

export const marcarAsistencia = async (req, res) => {
  const { latitud, longitud } = req.body;
  const usuarioId = req.userId; // Viene del middleware verifyToken

  try {
    // Verificar si ya marcó entrada hoy
    const hoy = new Date().toISOString().split('T')[0];
    const check = await pool.query(
      'SELECT * FROM asistencia WHERE usuario_id = $1 AND fecha = $2',
      [usuarioId, hoy],
    );

    if (check.rows.length === 0) {
      // Registrar ENTRADA
      const query = `
                INSERT INTO asistencia (usuario_id, fecha, hora_entrada, latitud_entrada, longitud_entrada, estado)
                VALUES ($1, $2, NOW(), $3, $4, 'presente')
                RETURNING *;
            `;
      const result = await pool.query(query, [
        usuarioId,
        hoy,
        latitud,
        longitud,
      ]);
      return res.status(201).json({
        message: 'Entrada registrada con éxito',
        data: result.rows[0],
      });
    } else {
      // Registrar SALIDA (Si ya tiene entrada pero no salida)
      const query = `
                UPDATE asistencia 
                SET hora_salida = NOW() 
                WHERE usuario_id = $1 AND fecha = $2 AND hora_salida IS NULL
                RETURNING *;
            `;
      const result = await pool.query(query, [usuarioId, hoy]);
      if (result.rows.length === 0)
        return res.status(400).json({ message: 'Ya se registró salida hoy' });
      return res.json({
        message: 'Salida registrada con éxito',
        data: result.rows[0],
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const obtenerMisMarcajes = async (req, res) => {
  const usuarioId = req.userId;
  try {
    const query = `
            SELECT fecha, hora_entrada, hora_salida, estado
            FROM asistencia
            WHERE usuario_id = $1
            ORDER BY fecha DESC, hora_entrada DESC
            LIMIT 10;    
        `;
    const result = await pool.query(query, [usuarioId]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
