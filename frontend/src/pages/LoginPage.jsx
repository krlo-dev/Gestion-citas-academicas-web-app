/**
 * LoginPage.jsx — Pantalla de autenticación.
 *
 * ⚠️  REQUIERE que el backend tenga este endpoint:
 *     POST /api/auth/login
 *     Body:     { email, password }
 *     Respuesta: { id, nombre, email, id_rol, rol }
 */
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { login }   from "../services/api";
import Card  from "../components/ui/Card";
import Btn   from "../components/ui/Btn";
import Input from "../components/ui/Input";
import "../styles/login.css";

export default function LoginPage() {
  const { setUser } = useAuth();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      setError("Por favor completa todos los campos.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const user = await login(email, password);
      setUser(user);
    } catch (err) {
      setError(err.message ?? "Error al iniciar sesión. Verifica tus credenciales.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-screen">
      <div className="login-box">
        <div className="login-header">
          <span className="login-header__emoji" aria-hidden="true">🎓</span>
          <h1 className="login-header__title">AsesoríasEdu</h1>
          <p className="login-header__subtitle">Sistema de gestión de citas académicas</p>
        </div>

        <Card className="login-card">
          <div className="login-fields">
            <Input
              label="Correo electrónico"
              type="email"
              placeholder="usuario@edu.co"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="alert alert-danger" style={{ marginTop: "14px" }}>
              ⚠️ {error}
            </div>
          )}

          <Btn
            onClick={handleLogin}
            fullWidth
            size="lg"
            disabled={loading}
            style={{ marginTop: "20px" }}
          >
            {loading ? "Iniciando sesión..." : "Iniciar sesión →"}
          </Btn>
        </Card>
      </div>
    </div>
  );
}
