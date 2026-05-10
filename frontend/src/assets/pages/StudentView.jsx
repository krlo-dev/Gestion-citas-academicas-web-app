import { useState } from "react";
import { TIME_SLOTS } from "../data/constants";
import Header from "../components/Header";
import Card   from "../components/ui/Card";
import Badge  from "../components/ui/Badge";
import Btn    from "../components/ui/Btn";
import "../styles/student.css";

/**
 * Devuelve true si el slot está ocupado para el docente dado.
 */
function isSlotTaken(appointments, teacherId, slot) {
  return appointments.some(
    (a) => a.teacherId === teacherId && a.slot === slot && a.status !== "cancelled"
  );
}

/**
 * StudentView — panel completo del estudiante.
 * Pestañas: "Solicitar asesoría" | "Mis citas"
 */
export default function StudentView({
  user, subjects, teachers, appointments, setAppointments, onLogout,
}) {
  const [tab,             setTab]             = useState("book");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedSlot,    setSelectedSlot]    = useState(null);
  const [slotError,       setSlotError]       = useState("");
  const [successMsg,      setSuccessMsg]       = useState("");

  const myAppointments   = appointments.filter((a) => a.studentId === user.id);
  const activeCount      = myAppointments.filter((a) => a.status !== "cancelled").length;
  const subjectTeachers  = selectedSubject
    ? teachers.filter((t) => t.subjectId === selectedSubject.id)
    : [];

  function handleSubjectSelect(sub) {
    setSelectedSubject(sub);
    setSelectedTeacher(null);
    setSelectedSlot(null);
    setSlotError("");
  }

  function handleSlotSelect(teacher, slot) {
    if (isSlotTaken(appointments, teacher.id, slot)) return;
    setSelectedTeacher(teacher);
    setSelectedSlot(slot);
    setSlotError("");
  }

  function handleBook() {
    if (!selectedSlot || !selectedTeacher) return;

    // Verificación final de disponibilidad
    if (isSlotTaken(appointments, selectedTeacher.id, selectedSlot)) {
      setSlotError("⚠️ Este horario ya está ocupado. Por favor elige otro.");
      setSelectedSlot(null);
      return;
    }

    const newAppt = {
      id:          Date.now(),
      studentId:   user.id,
      studentName: user.name,
      teacherId:   selectedTeacher.id,
      subjectId:   selectedSubject.id,
      slot:        selectedSlot,
      status:      "confirmed",
    };

    setAppointments((prev) => [...prev, newAppt]);
    setSuccessMsg(
      `✅ Cita confirmada con ${selectedTeacher.name} — ${selectedSlot}`
    );
    // Reiniciar flujo
    setSelectedSubject(null);
    setSelectedTeacher(null);
    setSelectedSlot(null);
    setSlotError("");
    setTimeout(() => setSuccessMsg(""), 5000);
  }

  function handleCancelMyAppt(id) {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "cancelled" } : a))
    );
  }

  function handleTabChange(newTab) {
    setTab(newTab);
    setSelectedSubject(null);
    setSelectedTeacher(null);
    setSelectedSlot(null);
    setSlotError("");
  }

  const subjectOf = (id) => subjects.find((s) => s.id === id);
  const teacherOf = (id) => teachers.find((t) => t.id === id);

  return (
    <div className="page-wrapper">
      <Header user={user} onLogout={onLogout} />

      <div className="page-content">
        {/* Notificación de éxito */}
        {successMsg && (
          <div className="alert alert-success">{successMsg}</div>
        )}

        {/* Pestañas */}
        <div className="tab-bar">
          <button
            className={`tab-btn ${tab === "book" ? "active" : ""}`}
            onClick={() => handleTabChange("book")}
          >
            📅 Solicitar asesoría
          </button>
          <button
            className={`tab-btn ${tab === "my" ? "active" : ""}`}
            onClick={() => handleTabChange("my")}
          >
            📋 Mis citas ({activeCount})
          </button>
        </div>

        {/* ── PESTAÑA: Solicitar asesoría ── */}
        {tab === "book" && (
          <>
            {/* Paso 1 — elegir asignatura */}
            <div style={{ marginBottom: "28px" }}>
              <div className="step-header">
                <div className={`step-badge step-badge--active`}>1</div>
                <h2 className="step-title">Elige una asignatura</h2>
              </div>

              <div className="subject-grid">
                {subjects.map((sub) => {
                  const isSelected = selectedSubject?.id === sub.id;
                  return (
                    <button
                      key={sub.id}
                      className={`subject-card ${isSelected ? "selected" : ""}`}
                      onClick={() => handleSubjectSelect(sub)}
                      style={{
                        borderColor: isSelected ? sub.color : undefined,
                        background:  isSelected ? sub.bg   : undefined,
                      }}
                    >
                      <span className="subject-card__icon" aria-hidden="true">
                        {sub.icon}
                      </span>
                      <span
                        className="subject-card__name"
                        style={{ color: isSelected ? sub.color : undefined }}
                      >
                        {sub.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Paso 2 — elegir docente y horario */}
            {selectedSubject && (
              <div>
                <div className="step-header">
                  <div className="step-badge step-badge--active">2</div>
                  <h2 className="step-title">
                    Elige docente y horario —{" "}
                    <span style={{ color: selectedSubject.color }}>
                      {selectedSubject.icon} {selectedSubject.name}
                    </span>
                  </h2>
                </div>

                <div className="teacher-grid">
                  {subjectTeachers.map((teacher) => (
                    <Card
                      key={teacher.id}
                      className={`teacher-card ${selectedTeacher?.id === teacher.id ? "teacher-card--selected" : ""}`}
                    >
                      <div className="teacher-card__header">
                        <div className="teacher-avatar" aria-hidden="true">
                          {teacher.initials}
                        </div>
                        <div>
                          <p className="teacher-card__name">{teacher.name}</p>
                          <p className="teacher-card__email">{teacher.email}</p>
                        </div>
                      </div>

                      <p className="slots-label">HORARIOS DISPONIBLES</p>
                      <div className="slots-list">
                        {TIME_SLOTS.map((slot) => {
                          const taken    = isSlotTaken(appointments, teacher.id, slot);
                          const selected =
                            selectedTeacher?.id === teacher.id &&
                            selectedSlot === slot;
                          return (
                            <button
                              key={slot}
                              className={`slot-btn ${
                                taken
                                  ? "slot-btn--taken"
                                  : selected
                                  ? "slot-btn--selected"
                                  : ""
                              }`}
                              onClick={() => handleSlotSelect(teacher, slot)}
                              disabled={taken}
                              title={taken ? "Este horario ya está ocupado" : ""}
                            >
                              {taken ? "🔒 " : ""}
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Error de slot ocupado */}
                {slotError && (
                  <div className="alert alert-danger" style={{ marginTop: "16px" }}>
                    {slotError}
                  </div>
                )}

                {/* Panel de confirmación */}
                {selectedTeacher && selectedSlot && (
                  <div className="confirm-panel">
                    <div>
                      <p className="confirm-panel__title">📅 Confirmar cita</p>
                      <p className="confirm-panel__detail">
                        {selectedSubject.name} · {selectedTeacher.name} · {selectedSlot}
                      </p>
                    </div>
                    <Btn onClick={handleBook}>Confirmar reserva ✓</Btn>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ── PESTAÑA: Mis citas ── */}
        {tab === "my" && (
          <>
            <h2 className="view-title">Mis citas de asesoría</h2>

            {myAppointments.length === 0 ? (
              <Card>
                <p className="empty-state">No tienes citas registradas aún.</p>
              </Card>
            ) : (
              <div className="appt-list">
                {myAppointments.map((appt) => {
                  const sub     = subjectOf(appt.subjectId);
                  const teacher = teacherOf(appt.teacherId);
                  return (
                    <Card
                      key={appt.id}
                      className={`appt-row ${appt.status === "cancelled" ? "appt-row--cancelled" : ""}`}
                      style={{ borderLeft: `4px solid ${appt.status === "cancelled" ? "var(--text-light)" : sub?.color ?? "var(--primary-dark)"}` }}
                    >
                      <div className="appt-row__left">
                        <span className="appt-row__icon" aria-hidden="true">
                          {sub?.icon}
                        </span>
                        <div>
                          <p className="appt-row__name">{sub?.name}</p>
                          <p className="appt-row__meta">
                            👨‍🏫 {teacher?.name} · 🕐 {appt.slot}
                          </p>
                        </div>
                      </div>

                      <div className="appt-row__right">
                        <Badge
                          variant={appt.status === "cancelled" ? "gray" : "success"}
                        >
                          {appt.status === "cancelled" ? "Cancelada" : "Confirmada"}
                        </Badge>
                        {appt.status !== "cancelled" && (
                          <Btn
                            variant="danger"
                            size="sm"
                            onClick={() => handleCancelMyAppt(appt.id)}
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
