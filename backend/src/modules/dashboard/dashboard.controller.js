import pool from '../../config/db.js';

export const getStats = async (req, res) => {
  try {
    // 1. Total de empleados activos
    const empleadosRes = await pool.query(
      'SELECT COUNT(*) FROM usuarios WHERE activo = true',
    );

    // 2. Presentes hoy
    const presentesRes = await pool.query(
      "SELECT COUNT(*) FROM asistencia WHERE fecha = CURRENT_DATE AND estado = 'presente'",
    );

    // 3. Costo Nómina Mes (Suma de todos los sueldos base en la tabla contratos)
    const nominaRes = await pool.query(
      'SELECT SUM(sueldo_base) as total FROM contratos WHERE activo = true',
    );

    res.json({
      totalEmpleados: parseInt(empleadosRes.rows[0].count),
      presentesHoy: parseInt(presentesRes.rows[0].count),
      costoNomina: parseFloat(nominaRes.rows[0].total || 0),
      pendientesFirma: 12, // Dato manual por ahora hasta tener el módulo de documentos
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
