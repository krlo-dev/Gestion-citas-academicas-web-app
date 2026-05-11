// index.js — Punto de entrada del servidor Express
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './config/db.js';

import catalogosRouter from './routes/catalogos.routes.js';
import usuariosRouter from './routes/usuarios.routes.js';
import horariosRouter from './routes/horarios.routes.js';
import citasRouter from './routes/citas.routes.js';
import authRouter from './routes/auth.routes.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check — verifica que el servidor y la BD estén funcionando
app.get('/api/health', async (_req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// Rutas
app.use('/api/catalogos', catalogosRouter);
app.use('/api/usuarios', usuariosRouter);
app.use('/api/horarios', horariosRouter);
app.use('/api/citas', citasRouter);
app.use('/api/auth', authRouter);
// Manejador global de errores
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));