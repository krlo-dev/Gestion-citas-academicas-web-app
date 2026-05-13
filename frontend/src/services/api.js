/**
 * api.js — Servicio centralizado de peticiones HTTP al backend.
 * Todas las llamadas a la API pasan por aquí.
 *
 * Base URL tomada de la variable de entorno VITE_API_URL.
 * Configúrala en un archivo .env en la raíz del proyecto frontend:
 *   VITE_API_URL=http://localhost:3000/api
 */

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

/**
 * Función base para todas las peticiones.
 * Lanza un Error con el mensaje del backend si el status no es 2xx.
 */
async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Error ${res.status}`);
  }

  // DELETE devuelve 200 con mensaje, no siempre JSON vacío
  return res.json();
}

// ─── Auth ──────────────────────────────────────────────────────────
/**
 * Login de usuario.
 * NOTA: El backend necesita este endpoint:
 *   POST /api/auth/login  → { email, password }
 *   Respuesta esperada:   { id, nombre, email, id_rol, rol }
 *
 * Ejemplo de implementación en Express:
 *   router.post('/login', async (req, res) => {
 *     const { email, password } = req.body;
 *     const user = await getUsuarioByEmail(email);
 *     if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });
 *     const ok = await bcrypt.compare(password, user.password);
 *     if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });
 *     const { password: _, ...safe } = user;
 *     res.json(safe);
 *   });
 */
export const login = (email, password) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

// ─── Catálogos ─────────────────────────────────────────────────────
export const getRoles        = () => request("/catalogos/roles");
export const getMaterias     = () => request("/catalogos/materias");
export const getEstadosCita  = () => request("/catalogos/estados-cita");

// ─── Usuarios ──────────────────────────────────────────────────────
export const getUsuarios    = ()           => request("/usuarios");
export const getUsuario     = (id)         => request(`/usuarios/${id}`);
export const createUsuario  = (data)       => request("/usuarios", { method: "POST", body: JSON.stringify(data) });
export const updateUsuario  = (id, data)   => request(`/usuarios/${id}`, { method: "PUT",  body: JSON.stringify(data) });
export const deleteUsuario  = (id)         => request(`/usuarios/${id}`, { method: "DELETE" });

// ─── Horarios ──────────────────────────────────────────────────────
export const getHorarios            = ()           => request("/horarios");
export const getHorariosByDocente   = (id)         => request(`/horarios/docente/${id}`);
export const getHorariosByMateria   = (id)         => request(`/horarios/materia/${id}`);
export const createHorario          = (data)       => request("/horarios", { method: "POST", body: JSON.stringify(data) });
export const updateHorario          = (id, data)   => request(`/horarios/${id}`, { method: "PUT",  body: JSON.stringify(data) });
export const deleteHorario          = (id)         => request(`/horarios/${id}`, { method: "DELETE" });

// ─── Citas ─────────────────────────────────────────────────────────
export const getCitas     = ()         => request("/citas");
export const getCita      = (id)       => request(`/citas/${id}`);
export const createCita   = (data)     => request("/citas", { method: "POST", body: JSON.stringify(data) });
export const updateCita   = (id, data) => request(`/citas/${id}`, { method: "PUT",  body: JSON.stringify(data) });
export const deleteCita   = (id)       => request(`/citas/${id}`, { method: "DELETE" });
