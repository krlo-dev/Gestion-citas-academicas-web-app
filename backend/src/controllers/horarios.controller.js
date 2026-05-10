// horarios.controller.js — Lógica HTTP de horarios
import { getAllHorarios, getHorariosByDocente, getHorariosByMateria, createHorario, updateHorario, deleteHorario } from '../models/horarios.model.js';

export const listarHorarios = async (req, res, next) => {
    try {
        const horarios = await getAllHorarios();
        res.json(horarios);
    } catch (e) {
        next(e);
    }
};

export const listarHorariosPorDocente = async (req, res, next) => {
    try {
        const { id_docente } = req.params;
        const horarios = await getHorariosByDocente(id_docente);
        res.json(horarios);
    } catch (e) {
        next(e);
    }
};

export const listarHorariosPorMateria = async (req, res, next) => {
    try {
        const { id_materia } = req.params;
        const horarios = await getHorariosByMateria(id_materia);
        res.json(horarios);
    } catch (e) {
        next(e);
    }
};

export const crearHorario = async (req, res, next) => {
    try {
        const { id_docente, id_materia, dia_semana, hora_inicio, hora_fin } = req.body;
        const result = await createHorario({ id_docente, id_materia, dia_semana, hora_inicio, hora_fin });
        res.status(201).json({ message: 'Horario creado', id: result.insertId });
    } catch (e) {
        next(e);
    }
};

export const actualizarHorario = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { id_materia, dia_semana, hora_inicio, hora_fin } = req.body;
        const result = await updateHorario(id, { id_materia, dia_semana, hora_inicio, hora_fin });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Horario no encontrado' });
        res.json({ message: 'Horario actualizado' });
    } catch (e) {
        next(e);
    }
};

export const eliminarHorario = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await deleteHorario(id);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Horario no encontrado' });
        res.json({ message: 'Horario eliminado' });
    } catch (e) {
        next(e);
    }
};