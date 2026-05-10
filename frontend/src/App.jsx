import { useState } from "react";
import { SUBJECTS_INIT, TEACHERS_INIT, APPOINTMENTS_INIT } from "./data/initialData";
import LoginPage from "./pages/LoginPage";
import StudentView from "./pages/StudentView";
import TeacherView from "./pages/TeacherView";
import AdminView from "./pages/AdminView";

export default function App() {
  const [currentUser, setCurrentUser]   = useState(null);
  const [subjects, setSubjects]         = useState(SUBJECTS_INIT);
  const [teachers, setTeachers]         = useState(TEACHERS_INIT);
  const [appointments, setAppointments] = useState(APPOINTMENTS_INIT);

  const handleLogout = () => setCurrentUser(null);

  if (!currentUser) {
    return <LoginPage onLogin={setCurrentUser} />;
  }

  const sharedProps = { subjects, teachers, appointments, setAppointments, onLogout: handleLogout };

  if (currentUser.role === "student") return <StudentView user={currentUser} {...sharedProps} />;
  if (currentUser.role === "teacher") return <TeacherView user={currentUser} {...sharedProps} />;

  return (
    <AdminView
      user={currentUser}
      setSubjects={setSubjects}
      setTeachers={setTeachers}
      {...sharedProps}
    />
  );
}