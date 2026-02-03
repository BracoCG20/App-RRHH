import { Router } from 'express';
import {
  getResumenNomina,
  upsertContrato,
} from './remuneraciones.controller.js';
import { verifyToken } from '../../middlewares/auth.js';

const router = Router();

// Esta es la ruta que tu Front está buscando
router.get('/resumen', verifyToken, getResumenNomina);
router.post('/configurar', verifyToken, upsertContrato);

export default router;
