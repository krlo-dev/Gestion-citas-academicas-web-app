// catalogos.controller.js — Lógica HTTP de catálogos
import { getRoles, getMaterias, getEstadosCita } from '../models/catalogos.model.js';

export const listarRoles = async (req, res, next) => {
    try {
        const roles = await getRoles();
        res.json(roles);
    } catch (e) {
        next(e);
    }
};

export const listarMaterias = async (req, res, next) => {
    try {
        const materias = await getMaterias();
        res.json(materias);
    } catch (e) {
        next(e);
    }
};

export const listarEstadosCita = async (req, res, next) => {
    try {
        const estados = await getEstadosCita();
        res.json(estados);
    } catch (e) {
        next(e);
    }
};