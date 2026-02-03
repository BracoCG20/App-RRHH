import { Router } from 'express';
import {
  getUsuarios,
  crearUsuario,
  editarUsuario,
  eliminarUsuario,
} from './usuarios.controller.js'; // Verifica nombres aquí
import { verifyToken } from '../../middlewares/auth.js';

const router = Router();

router.get('/', verifyToken, getUsuarios);
router.post('/', verifyToken, crearUsuario);
router.put('/:id', verifyToken, editarUsuario);
router.delete('/:id', verifyToken, eliminarUsuario);

export default router;
