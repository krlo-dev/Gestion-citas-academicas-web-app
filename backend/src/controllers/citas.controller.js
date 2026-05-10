// citas.controller.js — Lógica HTTP de citas
import { getAllCitas, getCitaById, createCita, updateCita, deleteCita, checkDisponibilidad } from '../models/citas.model.js';

export const listarCitas = async (req, res, next) => {
    try {
        const citas = await getAllCitas();
        res.json(citas);
    } catch (e) {
        next(e);
    }
};

export const obtenerCita = async (req, res, next) => {
    try {
        const { id } = req.params;
        const cita = await getCitaById(id);
        if (!cita) return res.status(404).json({ error: 'Cita no encontrada' });
        res.json(cita);
    } catch (e) {
        next(e);
    }
};

export const crearCita = async (req, res, next) => {
    try {
        const { id_estudiante, id_horario, fecha, motivo } = req.body;
        // Validación de disponibilidad del docente
        const ocupado = await checkDisponibilidad(id_horario, fecha);
        if (ocupado) return res.status(409).json({ error: 'El docente no está disponible en ese horario y fecha' });
        const result = await createCita({ id_estudiante, id_horario, fecha, motivo });
        res.status(201).json({ message: 'Cita creada', id: result.insertId });
    } catch (e) {
        next(e);
    }
};

export const actualizarCita = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { id_horario, fecha, motivo, id_estado } = req.body;
        // Validación de disponibilidad excluyendo la cita actual
        const ocupado = await checkDisponibilidad(id_horario, fecha, id);
        if (ocupado) return res.status(409).json({ error: 'El docente no está disponible en ese horario y fecha' });
        const result = await updateCita(id, { id_horario, fecha, motivo, id_estado });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Cita no encontrada' });
        res.json({ message: 'Cita actualizada' });
    } catch (e) {
        next(e);
    }
};

export const eliminarCita = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await deleteCita(id);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Cita no encontrada' });
        res.json({ message: 'Cita eliminada' });
    } catch (e) {
        next(e);
    }
};