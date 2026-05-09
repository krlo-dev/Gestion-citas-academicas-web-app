// citas.model.js — Consultas SQL de citas académicas
import { pool } from '../config/db.js';

// Validación de disponibilidad del docente
export const checkDisponibilidad = async (id_horario, fecha, excludeId = null) => {
    let query = `
        SELECT id FROM citas
        WHERE id_horario = ? AND fecha = ? AND id_estado != 3
    `;
    const params = [id_horario, fecha];

    // Al editar, excluimos la cita actual de la validación
    if (excludeId) {
        query += ' AND id != ?';
        params.push(excludeId);
    }

    const [rows] = await pool.query(query, params);
    return rows.length > 0; // true = ocupado
};

export const getAllCitas = async () => {
    const [rows] = await pool.query(`
        SELECT c.id, 
               e.nombre AS estudiante,
               d.nombre AS docente,
               m.nombre AS materia,
               h.dia_semana, h.hora_inicio, h.hora_fin,
               c.fecha, c.motivo,
               ec.nombre AS estado,
               c.id_estado, c.id_horario, c.id_estudiante
        FROM citas c
        JOIN usuarios e ON e.id = c.id_estudiante
        JOIN horarios_docente h ON h.id = c.id_horario
        JOIN usuarios d ON d.id = h.id_docente
        JOIN materias m ON m.id = h.id_materia
        JOIN estado_cita ec ON ec.id = c.id_estado
        ORDER BY c.fecha, h.hora_inicio
    `);
    return rows;
};

export const getCitaById = async (id) => {
    const [rows] = await pool.query(`
        SELECT c.id, c.id_estudiante, c.id_horario, c.fecha, c.motivo, c.id_estado
        FROM citas c
        WHERE c.id = ?
    `, [id]);
    return rows[0];
};

export const createCita = async (data) => {
    const { id_estudiante, id_horario, fecha, motivo } = data;
    const [result] = await pool.query(
        'INSERT INTO citas (id_estudiante, id_horario, fecha, motivo) VALUES (?, ?, ?, ?)',
        [id_estudiante, id_horario, fecha, motivo]
    );
    return result;
};

export const updateCita = async (id, data) => {
    const { id_horario, fecha, motivo, id_estado } = data;
    const [result] = await pool.query(
        'UPDATE citas SET id_horario = ?, fecha = ?, motivo = ?, id_estado = ? WHERE id = ?',
        [id_horario, fecha, motivo, id_estado, id]
    );
    return result;
};

export const deleteCita = async (id) => {
    const [result] = await pool.query(
        'DELETE FROM citas WHERE id = ?',
        [id]
    );
    return result;
};