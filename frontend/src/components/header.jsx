import "../styles/header.css";

const ROLE_LABELS = {
  1: "Administrador",
  2: "Docente",
  3: "Estudiante",
};

export default function Header({ user, onLogout }) {
  const nombre    = user?.nombre || user?.name || "Usuario";
  const initials  = nombre.slice(0, 2).toUpperCase();
  const roleLabel = ROLE_LABELS[user?.id_rol] ?? "Usuario";

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
            <p className="header__name">{nombre}</p>
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