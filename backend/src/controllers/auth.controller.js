// auth.controller.js — Lógica de autenticación
import bcrypt from 'bcryptjs';
import { getUsuarioByEmail } from '../models/usuarios.model.js';

export const loginUsuario = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ error: 'Email y contraseña son requeridos' });

        const usuario = await getUsuarioByEmail(email);
        if (!usuario)
            return res.status(401).json({ error: 'Credenciales inválidas' });

        const passwordOk = await bcrypt.compare(password, usuario.password);
        if (!passwordOk)
            return res.status(401).json({ error: 'Credenciales inválidas' });

        const { password: _, ...usuarioSafe } = usuario;
        res.json(usuarioSafe);

    } catch (e) {
        next(e);
    }
};