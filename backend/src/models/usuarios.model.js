// usuarios.model.js — Consultas SQL de usuarios
import { pool } from '../config/db.js';

export const getAllUsuarios = async () => {
    const [rows] = await pool.query(`
        SELECT u.id, u.nombre, u.email, r.nombre AS rol, u.id_rol
        FROM usuarios u
        JOIN roles r ON r.id = u.id_rol
        ORDER BY u.id
    `);
    return rows;
};

export const getUsuarioById = async (id) => {
    const [rows] = await pool.query(
        'SELECT id, nombre, email, id_rol FROM usuarios WHERE id = ?',
        [id]
    );
    return rows[0];
};

export const getUsuarioByEmail = async (email) => {
    const [rows] = await pool.query(
        'SELECT * FROM usuarios WHERE email = ?',
        [email]
    );
    return rows[0];
};

export const createUsuario = async (data) => {
    const { nombre, email, password, id_rol } = data;
    const [result] = await pool.query(
        'INSERT INTO usuarios (nombre, email, password, id_rol) VALUES (?, ?, ?, ?)',
        [nombre, email, password, id_rol]
    );
    return result;
};

export const updateUsuario = async (id, data) => {
    const { nombre, email, id_rol } = data;
    const [result] = await pool.query(
        'UPDATE usuarios SET nombre = ?, email = ?, id_rol = ? WHERE id = ?',
        [nombre, email, id_rol, id]
    );
    return result;
};

export const deleteUsuario = async (id) => {
    const [result] = await pool.query(
        'DELETE FROM usuarios WHERE id = ?',
        [id]
    );
    return result;
};