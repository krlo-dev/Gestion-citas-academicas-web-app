// usuarios.controller.js — Lógica HTTP de usuarios
import bcrypt from 'bcryptjs';
import { getAllUsuarios, getUsuarioById, getUsuarioByEmail, createUsuario, updateUsuario, deleteUsuario } from '../models/usuarios.model.js';

export const listarUsuarios = async (req, res, next) => {
    try {
        const usuarios = await getAllUsuarios();
        res.json(usuarios);
    } catch (e) {
        next(e);
    }
};

export const obtenerUsuario = async (req, res, next) => {
    try {
        const { id } = req.params;
        const usuario = await getUsuarioById(id);
        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(usuario);
    } catch (e) {
        next(e);
    }
};

export const crearUsuario = async (req, res, next) => {
    try {
        const { nombre, email, password, id_rol } = req.body;
        const existe = await getUsuarioByEmail(email);
        if (existe) return res.status(409).json({ error: 'El email ya está registrado' });
        const hashed = await bcrypt.hash(password, 10);
        const result = await createUsuario({ nombre, email, password: hashed, id_rol });
        res.status(201).json({ message: 'Usuario creado', id: result.insertId });
    } catch (e) {
        next(e);
    }
};

export const actualizarUsuario = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { nombre, email, id_rol } = req.body;
        const result = await updateUsuario(id, { nombre, email, id_rol });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json({ message: 'Usuario actualizado' });
    } catch (e) {
        next(e);
    }
};

export const eliminarUsuario = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await deleteUsuario(id);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json({ message: 'Usuario eliminado' });
    } catch (e) {
        next(e);
    }
};