// horarios.model.js — Consultas SQL de horarios de docentes
import { pool } from '../config/db.js';

export const getAllHorarios = async () => {
    const [rows] = await pool.query(`
        SELECT h.id, u.nombre AS docente, m.nombre AS materia,
               h.dia_semana, h.hora_inicio, h.hora_fin, h.id_docente, h.id_materia
        FROM horarios_docente h
        JOIN usuarios u ON u.id = h.id_docente
        JOIN materias m ON m.id = h.id_materia
        ORDER BY h.id
    `);
    return rows;
};

export const getHorariosByDocente = async (id_docente) => {
    const [rows] = await pool.query(`
        SELECT h.id, m.nombre AS materia, h.dia_semana, h.hora_inicio, h.hora_fin, h.id_materia
        FROM horarios_docente h
        JOIN materias m ON m.id = h.id_materia
        WHERE h.id_docente = ?
        ORDER BY h.dia_semana, h.hora_inicio
    `, [id_docente]);
    return rows;
};

export const getHorariosByMateria = async (id_materia) => {
    const [rows] = await pool.query(`
        SELECT h.id, u.nombre AS docente, h.dia_semana, h.hora_inicio, h.hora_fin, h.id_docente
        FROM horarios_docente h
        JOIN usuarios u ON u.id = h.id_docente
        WHERE h.id_materia = ?
        ORDER BY h.dia_semana, h.hora_inicio
    `, [id_materia]);
    return rows;
};

export const createHorario = async (data) => {
    const { id_docente, id_materia, dia_semana, hora_inicio, hora_fin } = data;
    const [result] = await pool.query(
        'INSERT INTO horarios_docente (id_docente, id_materia, dia_semana, hora_inicio, hora_fin) VALUES (?, ?, ?, ?, ?)',
        [id_docente, id_materia, dia_semana, hora_inicio, hora_fin]
    );
    return result;
};

export const updateHorario = async (id, data) => {
    const { id_materia, dia_semana, hora_inicio, hora_fin } = data;
    const [result] = await pool.query(
        'UPDATE horarios_docente SET id_materia = ?, dia_semana = ?, hora_inicio = ?, hora_fin = ? WHERE id = ?',
        [id_materia, dia_semana, hora_inicio, hora_fin, id]
    );
    return result;
};

export const deleteHorario = async (id) => {
    const [result] = await pool.query(
        'DELETE FROM horarios_docente WHERE id = ?',
        [id]
    );
    return result;
};