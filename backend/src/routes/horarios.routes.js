// horarios.routes.js — Rutas de horarios
import { Router } from 'express';
import { listarHorarios, listarHorariosPorDocente, listarHorariosPorMateria, crearHorario, actualizarHorario, eliminarHorario } from '../controllers/horarios.controller.js';

const router = Router();

router.get('/', listarHorarios);
router.get('/docente/:id_docente', listarHorariosPorDocente);
router.get('/materia/:id_materia', listarHorariosPorMateria);
router.post('/', crearHorario);
router.put('/:id', actualizarHorario);
router.delete('/:id', eliminarHorario);

export default router;