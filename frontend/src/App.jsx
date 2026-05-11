import { useAuth, ROLES } from "./context/AuthContext";
import LoginPage    from "./pages/LoginPage";
import StudentView  from "./pages/StudentView";
import TeacherView  from "./pages/TeacherView";
import AdminView    from "./pages/AdminView";

export default function App() {
  const { user } = useAuth();

  if (!user) return <LoginPage />;

  if (user.id_rol === ROLES.ESTUDIANTE) return <StudentView />;
  if (user.id_rol === ROLES.DOCENTE)    return <TeacherView />;
  if (user.id_rol === ROLES.ADMIN)      return <AdminView />;

  // Rol desconocido — muestra mensaje de error
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <p>Rol no reconocido (id_rol: {user.id_rol}). Contacta al administrador.</p>
    </div>
  );
}
