import { useState } from "react";
import { USERS } from "../data/initialData";
import Card from "../components/ui/Card";
import Btn  from "../components/ui/Btn";
import Input from "../components/ui/Input";
import "../styles/login.css";

const ROLES = [
  { id: "student", label: "Estudiante", icon: "🎒" },
  { id: "teacher", label: "Docente",    icon: "👨‍🏫" },
  { id: "admin",   label: "Admin",      icon: "⚙️" },
];

const EMAIL_HINTS = {
  student: "estudiante@edu.co",
  teacher: "profesor@edu.co",
  admin:   "admin@edu.co",
};

/**
 * LoginPage — pantalla de autenticación con selector de rol.
 * @param {function} onLogin - recibe el objeto usuario autenticado
 */
export default function LoginPage({ onLogin }) {
  const [role,  setRole]  = useState("student");
  const [email, setEmail] = useState("");
  const [pass,  setPass]  = useState("");
  const [error, setError] = useState("");

  function handleRoleChange(newRole) {
    setRole(newRole);
    setEmail("");
    setPass("");
    setError("");
  }

  function handleLogin() {
    const user = USERS.find(
      (u) => u.role === role && u.email === email && u.pass === pass
    );
    if (user) {
      setError("");
      onLogin(user);
    } else {
      setError("Correo o contraseña incorrectos. Verifica tus datos.");
    }
  }

  return (
    <div className="login-screen">
      <div className="login-box">
        {/* Encabezado */}
        <div className="login-header">
          <span className="login-header__emoji" aria-hidden="true">🎓</span>
          <h1 className="login-header__title">AsesoríasEdu</h1>
          <p className="login-header__subtitle">
            Sistema de gestión de citas académicas
          </p>
        </div>

        {/* Tarjeta del formulario */}
        <Card className="login-card">
          {/* Selector de rol */}
          <div className="role-selector">
            <span className="role-selector__label">Tipo de usuario</span>
            <div className="role-selector__options">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  className={`role-btn ${role === r.id ? "active" : ""}`}
                  onClick={() => handleRoleChange(r.id)}
                  aria-pressed={role === r.id}
                >
                  <span className="role-btn__icon" aria-hidden="true">{r.icon}</span>
                  <span className="role-btn__label">{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Campos */}
          <div className="login-fields">
            <Input
              label="Correo electrónico"
              type="email"
              placeholder={EMAIL_HINTS[role]}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              autoComplete="current-password"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="alert alert-danger" style={{ marginTop: "14px" }}>
              ⚠️ {error}
            </div>
          )}

          {/* Botón de ingreso */}
          <Btn
            onClick={handleLogin}
            fullWidth
            size="lg"
            style={{ marginTop: "20px" }}
          >
            Iniciar sesión →
          </Btn>

          <p className="login-hint">
            Contraseña de prueba: <strong>1234</strong>
          </p>
        </Card>
      </div>
    </div>
  );
}
