import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import pool from './config/db.js';
import authRoutes from './modules/auth/auth.routes.js';
import asistenciaRoutes from './modules/asistencia/asistencia.routes.js';
import usuariosRoutes from './modules/usuarios/usuarios.routes.js';
import dashboardRoutes from './modules/dashboard/dashboard.routes.js';
import remuneracionesRoutes from './modules/remuneraciones/remuneraciones.routes.js';
dotenv.config();

const app = express();

//Middlewares
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/asistencia', asistenciaRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/remuneraciones', remuneracionesRoutes);

app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      status: 'OK',
      serverTime: result.rows[0].now,
      message: 'Conectado a PostgreSQL correctamente - BD: rrhh',
    });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
