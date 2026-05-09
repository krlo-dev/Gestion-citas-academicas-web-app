// catalogos.model.js — Consultas SQL de tablas de catálogo
import { pool } from '../config/db.js';

export const getRoles = async () => {
    const [rows] = await pool.query('SELECT id, nombre FROM roles ORDER BY id');
    return rows;
};

export const getMaterias = async () => {
    const [rows] = await pool.query('SELECT id, nombre FROM materias ORDER BY id');
    return rows;
};

export const getEstadosCita = async () => {
    const [rows] = await pool.query('SELECT id, nombre FROM estado_cita ORDER BY id');
    return rows;
};