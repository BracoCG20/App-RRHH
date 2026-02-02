import { Router } from 'express';
import {
  marcarAsistencia,
  obtenerMisMarcajes,
} from './asistencia.controller.js';
import { verifyToken } from '../../middlewares/auth.js'; // Importante para saber quién marca

const router = Router();

router.post('/marcar', verifyToken, marcarAsistencia);
router.get('/mis-marcas', verifyToken, obtenerMisMarcajes);

export default router;
