// usuarios.routes.js — Rutas de usuarios
import { Router } from 'express';
import { listarUsuarios, obtenerUsuario, crearUsuario, actualizarUsuario, eliminarUsuario } from '../controllers/usuarios.controller.js';

const router = Router();

router.get('/', listarUsuarios);
router.get('/:id', obtenerUsuario);
router.post('/', crearUsuario);
router.put('/:id', actualizarUsuario);
router.delete('/:id', eliminarUsuario);

export default router;