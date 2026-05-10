import "../styles/header.css";

const ROLE_LABELS = {
  student: "Estudiante",
  teacher: "Docente",
  admin:   "Administrador",
};

/**
 * Header — barra de navegación superior fija.
 * @param {{ name: string, role: string }} user
 * @param {function} onLogout
 */
export default function Header({ user, onLogout }) {
  const initials   = user.name.slice(0, 2).toUpperCase();
  const roleLabel  = ROLE_LABELS[user.role] ?? user.role;

  return (
    <header className="header">
      <div className="header__brand">
        <span className="header__logo" aria-hidden="true">🎓</span>
        <span className="header__app-name">AsesoríasEdu</span>
      </div>

      <div className="header__right">
        <div className="header__user-info">
          <div className="header__avatar" aria-hidden="true">{initials}</div>
          <div className="header__name-block">
            <p className="header__name">{user.name}</p>
            <p className="header__role">{roleLabel}</p>
          </div>
        </div>

        <button className="header__logout-btn" onClick={onLogout}>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
