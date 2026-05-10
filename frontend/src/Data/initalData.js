export const SUBJECTS_INIT = [
  { id: 1, name: "Matemáticas", icon: "📐", color: "#3b82f6", bg: "#eff6ff" },
  { id: 2, name: "Inglés",      icon: "🌐", color: "#0d9488", bg: "#f0fdfa" },
  { id: 3, name: "Ciencias",    icon: "🔬", color: "#10b981", bg: "#ecfdf5" },
  { id: 4, name: "Física",      icon: "⚛️", color: "#8b5cf6", bg: "#f5f3ff" },
  { id: 5, name: "Sociales",    icon: "🌍", color: "#f59e0b", bg: "#fffbeb" },
  { id: 6, name: "Español",     icon: "📖", color: "#ec4899", bg: "#fdf2f8" },
];

export const TEACHERS_INIT = [
  { id: 1, name: "Prof. García",    subjectId: 1, email: "garcia@edu.co",    initials: "PG" },
  { id: 2, name: "Prof. Smith",     subjectId: 2, email: "smith@edu.co",     initials: "PS" },
  { id: 3, name: "Prof. Martínez",  subjectId: 3, email: "martinez@edu.co",  initials: "PM" },
  { id: 4, name: "Prof. López",     subjectId: 4, email: "lopez@edu.co",     initials: "PL" },
  { id: 5, name: "Prof. Rodríguez", subjectId: 5, email: "rodriguez@edu.co", initials: "PR" },
  { id: 6, name: "Prof. Torres",    subjectId: 6, email: "torres@edu.co",    initials: "PT" },
];

/* Los usuarios normalmente vendrían del backend/autenticación */
export const USERS = [
  { id: 1, role: "student", name: "Juan Pérez",    email: "estudiante@edu.co", pass: "1234" },
  { id: 2, role: "teacher", name: "Prof. García",  email: "profesor@edu.co",   pass: "1234", teacherId: 1 },
  { id: 3, role: "admin",   name: "Administrador", email: "admin@edu.co",      pass: "1234" },
];

export const APPOINTMENTS_INIT = [
  {
    id: 1,
    studentId: 1,
    studentName: "Juan Pérez",
    teacherId: 3,
    subjectId: 3,
    slot: "Miércoles 8:30 AM",
    status: "confirmed",
  },
];
