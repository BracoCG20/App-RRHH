import pool from '../../config/db.js';

export const getResumenNomina = async (req, res) => {
  try {
    const query = `
      SELECT 
        u.id, 
        u.nombres, 
        u.apellidos, 
        u.cargo, 
        u.activo,
        c.sueldo_base, 
        c.moneda,
        -- Si no hay asistencias, proyectamos el sueldo base completo por defecto
        COALESCE(
          (c.sueldo_base / 30 * NULLIF((SELECT COUNT(*) FROM asistencia WHERE usuario_id = u.id AND estado = 'presente'), 0)), 
          c.sueldo_base
        ) as sueldo_proyectado
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
  // Desestructuramos los campos que vienen del Frontend
  const { usuario_id, sueldo_base, moneda, afp, salud, cargo } = req.body;

  try {
    // 1. Actualizar el cargo del usuario (sin tocar RUT ni DNI)
    await pool.query('UPDATE usuarios SET cargo = $1 WHERE id = $2', [
      cargo,
      usuario_id,
    ]);

    // 2. Insertar o actualizar el contrato remunerativo
    // IMPORTANTE: Asegúrate de que los nombres de las columnas coincidan con tu DB
    const query = `
            INSERT INTO contratos (usuario_id, sueldo_base, moneda, afp, salud)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (usuario_id) 
            DO UPDATE SET 
                sueldo_base = EXCLUDED.sueldo_base,
                moneda = EXCLUDED.moneda,
                afp = EXCLUDED.afp,
                salud = EXCLUDED.salud;
        `;
    await pool.query(query, [usuario_id, sueldo_base, moneda, afp, salud]);

    res.json({ message: 'Configuración guardada exitosamente' });
  } catch (error) {
    console.error('Error detallado en consola del servidor:', error); // Esto te dirá el error exacto en Node.js
    res
      .status(500)
      .json({ error: 'Fallo interno al guardar los cambios remunerativos' });
  }
};
