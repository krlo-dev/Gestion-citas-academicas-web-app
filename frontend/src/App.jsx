import { useAuth } from "./context/AuthContext";
import LoginPage   from "./pages/LoginPage";
import StudentView from "./pages/StudentView";
import TeacherView from "./pages/TeacherView";
import AdminView   from "./pages/AdminView";

export default function App() {
  const { user } = useAuth();

  if (!user) return <LoginPage />;

  if (user.id_rol === 3) return <StudentView />;
  if (user.id_rol === 2) return <TeacherView />;
  if (user.id_rol === 1) return <AdminView />;

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <p>Rol no reconocido (id_rol: {user.id_rol}). Contacta al administrador.</p>
    </div>
  );
}