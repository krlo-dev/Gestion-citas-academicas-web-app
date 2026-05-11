/**
 * AuthContext.jsx — Estado global de autenticación.
 * Provee el usuario actual y funciones de login/logout.
 */
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

/**
 * Roles esperados del backend (ajusta según tu tabla `roles`):
 *   id 1 → Administrador
 *   id 2 → Docente
 *   id 3 → Estudiante
 */
export const ROLES = {
  ADMIN:      1,
  DOCENTE:    2,
  ESTUDIANTE: 3,
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Hook de acceso rápido al contexto de autenticación. */
export function useAuth() {
  return useContext(AuthContext);
}
