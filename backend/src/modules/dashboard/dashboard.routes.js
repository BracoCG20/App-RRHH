import { Router } from 'express';
import { getStats } from './dashboard.controller.js';
import { verifyToken } from '../../middlewares/auth.js';

const router = Router();
router.get('/stats', verifyToken, getStats);
export default router;
