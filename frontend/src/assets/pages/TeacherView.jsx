import { useState } from "react";
import Header from "../components/Header";
import Card   from "../components/ui/Card";
import Badge  from "../components/ui/Badge";
import Btn    from "../components/ui/Btn";
import "../styles/teacher.css";

/**
 * TeacherView — panel del docente.
 * Muestra sus citas activas y canceladas, con opción de cancelar.
 */
export default function TeacherView({
  user, subjects, appointments, setAppointments, onLogout,
}) {
  const [tab, setTab] = useState("upcoming");

  const myAppts  = appointments.filter((a) => a.teacherId === user.teacherId);
  const upcoming = myAppts.filter((a) => a.status !== "cancelled");
  const cancelled = myAppts.filter((a) => a.status === "cancelled");

  function handleCancel(id) {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "cancelled" } : a))
    );
  }

  const subjectOf = (id) => subjects.find((s) => s.id === id);
  const shown     = tab === "upcoming" ? upcoming : cancelled;

  return (
    <div className="page-wrapper">
      <Header user={user} onLogout={onLogout} />

      <div className="page-content--narrow">
        {/* Encabezado con estadísticas */}
        <div className="teacher-view-top">
          <h1 className="teacher-view-top__title">Panel del Docente</h1>
          <div className="stats-row">
            <Card className="stat-card">
              <p className="stat-card__value stat-card__value--primary">
                {upcoming.length}
              </p>
              <p className="stat-card__label">Próximas citas</p>
            </Card>
            <Card className="stat-card">
              <p className="stat-card__value stat-card__value--muted">
                {cancelled.length}
              </p>
              <p className="stat-card__label">Canceladas</p>
            </Card>
          </div>
        </div>

        {/* Pestañas */}
        <div className="tab-bar">
          <button
            className={`tab-btn ${tab === "upcoming" ? "active" : ""}`}
            onClick={() => setTab("upcoming")}
          >
            ✅ Próximas ({upcoming.length})
          </button>
          <button
            className={`tab-btn ${tab === "cancelled" ? "active" : ""}`}
            onClick={() => setTab("cancelled")}
          >
            ❌ Canceladas ({cancelled.length})
          </button>
        </div>

        {/* Lista de citas */}
        {shown.length === 0 ? (
          <Card>
            <p className="empty-state">
              {tab === "upcoming"
                ? "No tienes citas programadas."
                : "No hay citas canceladas."}
            </p>
          </Card>
        ) : (
          <div className="teacher-appt-list">
            {shown.map((appt) => {
              const sub = subjectOf(appt.subjectId);
              return (
                <Card
                  key={appt.id}
                  className="teacher-appt-row"
                  style={{
                    borderLeft: `4px solid ${sub?.color ?? "var(--primary-dark)"}`,
                  }}
                >
                  <div className="teacher-appt-row__left">
                    {/* Avatar del estudiante */}
                    <div className="student-avatar" aria-hidden="true">
                      {appt.studentName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="teacher-appt-row__student-name">
                        {appt.studentName}
                      </p>
                      <p className="teacher-appt-row__meta">
                        {sub?.icon} {sub?.name} · 🕐 {appt.slot}
                      </p>
                    </div>
                  </div>

                  <div className="teacher-appt-row__right">
                    <Badge
                      variant={appt.status === "cancelled" ? "gray" : "success"}
                    >
                      {appt.status === "cancelled" ? "Cancelada" : "Confirmada"}
                    </Badge>
                    {appt.status !== "cancelled" && (
                      <Btn
                        variant="danger"
                        size="sm"
                        onClick={() => handleCancel(appt.id)}
                      >
                        Cancelar cita
                      </Btn>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
