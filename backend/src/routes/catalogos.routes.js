// catalogos.routes.js — Rutas de catálogos
import { Router } from 'express';
import { listarRoles, listarMaterias, listarEstadosCita } from '../controllers/catalogos.controller.js';

const router = Router();

router.get('/roles', listarRoles);
router.get('/materias', listarMaterias);
router.get('/estados-cita', listarEstadosCita);

export default router;