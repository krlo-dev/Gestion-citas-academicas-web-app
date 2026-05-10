import { useState } from "react";
import { ICON_OPTIONS, COLOR_OPTIONS } from "../data/constants";
import Header from "../components/Header";
import Card   from "../components/ui/Card";
import Badge  from "../components/ui/Badge";
import Btn    from "../components/ui/Btn";
import Input  from "../components/ui/Input";
import Select from "../components/ui/Select";
import "../styles/admin.css";

const EMPTY_SUBJECT = { name: "", icon: "📚", color: "#3b82f6", bg: "#eff6ff" };
const EMPTY_TEACHER = { name: "", email: "", subjectId: "" };

/**
 * AdminView — panel del administrador con 4 pestañas:
 * Resumen | Asignaturas | Docentes | Todas las citas
 */
export default function AdminView({
  user,
  subjects, setSubjects,
  teachers, setTeachers,
  appointments, setAppointments,
  onLogout,
}) {
  const [tab,          setTab]          = useState("overview");
  const [newSubject,   setNewSubject]   = useState(EMPTY_SUBJECT);
  const [newTeacher,   setNewTeacher]   = useState(EMPTY_TEACHER);
  const [notification, setNotification] = useState("");

  function notify(msg) {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3500);
  }

  /* ── Operaciones de asignaturas ──────────────────────────────── */
  function addSubject() {
    if (!newSubject.name.trim()) return;
    setSubjects((prev) => [...prev, { ...newSubject, id: Date.now() }]);
    setNewSubject(EMPTY_SUBJECT);
    notify("✅ Asignatura añadida correctamente");
  }

  function deleteSubject(id) {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    notify("🗑️ Asignatura eliminada");
  }

  /* ── Operaciones de docentes ─────────────────────────────────── */
  function addTeacher() {
    const { name, email, subjectId } = newTeacher;
    if (!name.trim() || !email.trim() || !subjectId) return;
    const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    setTeachers((prev) => [
      ...prev,
      { ...newTeacher, id: Date.now(), subjectId: parseInt(subjectId), initials },
    ]);
    setNewTeacher(EMPTY_TEACHER);
    notify("✅ Docente añadido correctamente");
  }

  function deleteTeacher(id) {
    setTeachers((prev) => prev.filter((t) => t.id !== id));
    notify("🗑️ Docente eliminado");
  }

  /* ── Cancelar cita ───────────────────────────────────────────── */
  function cancelAppointment(id) {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "cancelled" } : a))
    );
    notify("Cita cancelada");
  }

  /* ── Helpers ─────────────────────────────────────────────────── */
  const subjectOf = (id) => subjects.find((s) => s.id === id);
  const teacherOf = (id) => teachers.find((t) => t.id === id);
  const activeAppts = appointments.filter((a) => a.status !== "cancelled");

  const ADMIN_TABS = [
    { id: "overview", label: "📊 Resumen"           },
    { id: "subjects", label: "📚 Asignaturas"       },
    { id: "teachers", label: "👨‍🏫 Docentes"         },
    { id: "appts",    label: "📅 Todas las citas"   },
  ];

  return (
    <div className="page-wrapper">
      <Header user={user} onLogout={onLogout} />

      <div className="page-content">
        {/* Notificación global */}
        {notification && (
          <div className="alert alert-success">{notification}</div>
        )}

        {/* Pestañas */}
        <div className="tab-bar">
          {ADMIN_TABS.map((t) => (
            <button
              key={t.id}
              className={`tab-btn ${tab === t.id ? "active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── PESTAÑA: RESUMEN ── */}
        {tab === "overview" && (
          <>
            <div className="metrics-grid">
              {[
                { label: "Asignaturas",  value: subjects.length,     icon: "📚", color: "var(--primary-dark)" },
                { label: "Docentes",     value: teachers.length,     icon: "👨‍🏫", color: "#7c3aed"           },
                { label: "Citas activas",value: activeAppts.length,  icon: "✅", color: "var(--success)"     },
                { label: "Citas totales",value: appointments.length, icon: "📅", color: "var(--accent)"      },
              ].map((stat) => (
                <Card
                  key={stat.label}
                  className="metric-card"
                  style={{ borderLeft: `4px solid ${stat.color}` }}
                >
                  <div className="metric-card__top">
                    <div>
                      <p className="metric-card__label">{stat.label}</p>
                      <p className="metric-card__value" style={{ color: stat.color }}>
                        {stat.value}
                      </p>
                    </div>
                    <span className="metric-card__icon" aria-hidden="true">
                      {stat.icon}
                    </span>
                  </div>
                </Card>
              ))}
            </div>

            {/* Citas recientes */}
            <Card className="recent-card">
              <h3 className="recent-card__title">Citas recientes</h3>
              {[...appointments].reverse().slice(0, 5).map((appt) => {
                const sub     = subjectOf(appt.subjectId);
                const teacher = teacherOf(appt.teacherId);
                return (
                  <div key={appt.id} className="recent-row">
                    <div className="recent-row__left">
                      <span className="recent-row__icon" aria-hidden="true">
                        {sub?.icon}
                      </span>
                      <div>
                        <p className="recent-row__names">
                          🎒 {appt.studentName} → 👨‍🏫 {teacher?.name}
                        </p>
                        <p className="recent-row__meta">
                          {sub?.name} · {appt.slot}
                        </p>
                      </div>
                    </div>
                    <Badge variant={appt.status === "cancelled" ? "gray" : "success"}>
                      {appt.status === "cancelled" ? "Cancelada" : "Confirmada"}
                    </Badge>
                  </div>
                );
              })}
              {appointments.length === 0 && (
                <p className="empty-state" style={{ padding: "24px" }}>
                  No hay citas aún.
                </p>
              )}
            </Card>
          </>
        )}

        {/* ── PESTAÑA: ASIGNATURAS ── */}
        {tab === "subjects" && (
          <div className="two-col-grid">
            {/* Formulario */}
            <Card className="form-card">
              <h3 className="form-card__title">➕ Nueva asignatura</h3>
              <div className="form-fields">
                <Input
                  label="Nombre de la asignatura"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Ej: Química"
                />

                {/* Selector de icono */}
                <div>
                  <p className="field-label" style={{ marginBottom: "8px" }}>Icono</p>
                  <div className="icon-picker">
                    {ICON_OPTIONS.map((icon) => (
                      <button
                        key={icon}
                        className={`icon-option ${newSubject.icon === icon ? "selected" : ""}`}
                        onClick={() => setNewSubject((p) => ({ ...p, icon }))}
                        aria-label={`Seleccionar icono ${icon}`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selector de color */}
                <div>
                  <p className="field-label" style={{ marginBottom: "8px" }}>Color</p>
                  <div className="color-picker">
                    {COLOR_OPTIONS.map((opt) => (
                      <button
                        key={opt.color}
                        className="color-swatch"
                        style={{
                          background:   opt.color,
                          borderColor:  newSubject.color === opt.color ? "var(--text)" : "transparent",
                        }}
                        onClick={() => setNewSubject((p) => ({ ...p, color: opt.color, bg: opt.bg }))}
                        aria-label={`Seleccionar color ${opt.color}`}
                      />
                    ))}
                  </div>
                </div>

                <Btn onClick={addSubject} disabled={!newSubject.name.trim()}>
                  Añadir asignatura
                </Btn>
              </div>
            </Card>

            {/* Lista */}
            <div>
              <h3 className="items-list__title">
                Asignaturas ({subjects.length})
              </h3>
              <div className="items-list">
                {subjects.map((sub) => (
                  <Card
                    key={sub.id}
                    className="item-row"
                    style={{ borderLeft: `4px solid ${sub.color}` }}
                  >
                    <div className="item-row__left">
                      <span className="item-row__icon" aria-hidden="true">
                        {sub.icon}
                      </span>
                      <div>
                        <p className="item-row__name">{sub.name}</p>
                        <p className="item-row__sub">
                          {teachers.filter((t) => t.subjectId === sub.id).length} docente(s)
                        </p>
                      </div>
                    </div>
                    <Btn variant="ghost" size="sm" onClick={() => deleteSubject(sub.id)}>
                      🗑️
                    </Btn>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── PESTAÑA: DOCENTES ── */}
        {tab === "teachers" && (
          <div className="two-col-grid">
            {/* Formulario */}
            <Card className="form-card">
              <h3 className="form-card__title">➕ Nuevo docente</h3>
              <div className="form-fields">
                <Input
                  label="Nombre completo"
                  value={newTeacher.name}
                  onChange={(e) => setNewTeacher((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Prof. Apellido"
                />
                <Input
                  label="Correo electrónico"
                  type="email"
                  value={newTeacher.email}
                  onChange={(e) => setNewTeacher((p) => ({ ...p, email: e.target.value }))}
                  placeholder="docente@edu.co"
                />
                <Select
                  label="Asignatura"
                  value={newTeacher.subjectId}
                  onChange={(e) => setNewTeacher((p) => ({ ...p, subjectId: e.target.value }))}
                >
                  <option value="">Seleccionar asignatura</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.icon} {s.name}
                    </option>
                  ))}
                </Select>
                <Btn
                  onClick={addTeacher}
                  disabled={
                    !newTeacher.name.trim() ||
                    !newTeacher.email.trim() ||
                    !newTeacher.subjectId
                  }
                >
                  Añadir docente
                </Btn>
              </div>
            </Card>

            {/* Lista */}
            <div>
              <h3 className="items-list__title">Docentes ({teachers.length})</h3>
              <div className="items-list">
                {teachers.map((teacher) => {
                  const sub = subjectOf(teacher.subjectId);
                  return (
                    <Card key={teacher.id} className="item-row">
                      <div className="item-row__left">
                        <div className="admin-teacher-avatar" aria-hidden="true">
                          {teacher.initials}
                        </div>
                        <div>
                          <p className="item-row__name">{teacher.name}</p>
                          <p className="item-row__sub">
                            {sub?.icon} {sub?.name} · {teacher.email}
                          </p>
                        </div>
                      </div>
                      <Btn
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTeacher(teacher.id)}
                      >
                        🗑️
                      </Btn>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── PESTAÑA: TODAS LAS CITAS ── */}
        {tab === "appts" && (
          <>
            <div className="all-appts-header">
              <h3 className="all-appts-header__title">
                Todas las citas ({appointments.length})
              </h3>
              <div className="all-appts-header__badges">
                <Badge variant="success">Activas: {activeAppts.length}</Badge>
                <Badge variant="gray">
                  Canceladas: {appointments.length - activeAppts.length}
                </Badge>
              </div>
            </div>

            {appointments.length === 0 ? (
              <Card>
                <p className="empty-state">No hay citas registradas.</p>
              </Card>
            ) : (
              <div className="all-appts-list">
                {appointments.map((appt) => {
                  const sub     = subjectOf(appt.subjectId);
                  const teacher = teacherOf(appt.teacherId);
                  return (
                    <Card
                      key={appt.id}
                      className={`all-appt-row ${appt.status === "cancelled" ? "all-appt-row--cancelled" : ""}`}
                      style={{
                        borderLeft: `4px solid ${sub?.color ?? "var(--border)"}`,
                      }}
                    >
                      <div className="all-appt-row__left">
                        <span className="all-appt-row__icon" aria-hidden="true">
                          {sub?.icon}
                        </span>
                        <div>
                          <p className="all-appt-row__names">
                            🎒 {appt.studentName} → 👨‍🏫 {teacher?.name}
                          </p>
                          <p className="all-appt-row__meta">
                            {sub?.name} · 🕐 {appt.slot}
                          </p>
                        </div>
                      </div>

                      <div className="all-appt-row__right">
                        <Badge
                          variant={appt.status === "cancelled" ? "gray" : "success"}
                        >
                          {appt.status === "cancelled" ? "Cancelada" : "Confirmada"}
                        </Badge>
                        {appt.status !== "cancelled" && (
                          <Btn
                            variant="danger"
                            size="sm"
                            onClick={() => cancelAppointment(appt.id)}
                          >
                            Cancelar
                          </Btn>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
