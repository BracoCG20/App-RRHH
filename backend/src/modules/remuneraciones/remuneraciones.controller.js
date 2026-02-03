import pool from '../../config/db.js';

export const getResumenNomina = async (req, res) => {
  try {
    const query = `
            SELECT 
                u.nombres, u.apellidos, c.sueldo_base,
                c.moneda, -- 'PEN' o 'USD'
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

export const upsertContrato = async (req, res) => {
  const { usuario_id, sueldo_base, moneda, afp, salud, cargo } = req.body;

  try {
    // 1. Actualizamos el cargo en la tabla de usuarios (Ascenso)
    await pool.query('UPDATE usuarios SET cargo = $1 WHERE id = $2', [
      cargo,
      usuario_id,
    ]);

    // 2. Insertamos o actualizamos el contrato (Sueldo)
    const query = `
            INSERT INTO contratos (usuario_id, sueldo_base, moneda, afp, salud)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (usuario_id) 
            DO UPDATE SET 
                sueldo_base = EXCLUDED.sueldo_base,
                moneda = EXCLUDED.moneda,
                afp = EXCLUDED.afp,
                salud = EXCLUDED.salud,
                fecha_inicio = CURRENT_DATE;
        `;
    await pool.query(query, [usuario_id, sueldo_base, moneda, afp, salud]);

    res.json({ message: 'Contrato actualizado con éxito' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
