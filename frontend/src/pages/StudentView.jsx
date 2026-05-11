/**
 * StudentView.jsx — Panel del estudiante.
 *
 * Endpoints usados:
 *   GET  /api/catalogos/materias
 *   GET  /api/horarios/materia/:id  → docentes y slots disponibles
 *   GET  /api/citas                 → filtradas por id_estudiante
 *   POST /api/citas                 → reservar cita
 *   PUT  /api/citas/:id             → cancelar cita (cambiar estado)
 */
import { useState, useEffect } from "react";
import { useAuth }            from "../context/AuthContext";
import { getMaterias, getHorariosByMateria, getCitas, createCita, updateCita } from "../services/api";
import Header  from "../components/Header";
import Card    from "../components/ui/Card";
import Badge   from "../components/ui/Badge";
import Btn     from "../components/ui/Btn";
import Input   from "../components/ui/Input";
import Spinner from "../components/ui/Spinner";
import "../styles/student.css";

const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

// Paleta de colores cíclica para las materias
const PALETTE = [
  { color: "#3b82f6", bg: "#eff6ff" },
  { color: "#0d9488", bg: "#f0fdfa" },
  { color: "#10b981", bg: "#ecfdf5" },
  { color: "#8b5cf6", bg: "#f5f3ff" },
  { color: "#f59e0b", bg: "#fffbeb" },
  { color: "#ec4899", bg: "#fdf2f8" },
];

// id_estado 3 = Cancelada (según schema del backend)
const ID_ESTADO_CANCELADA = 3;

export default function StudentView() {
  const { user, logout } = useAuth();

  // Datos del backend
  const [materias,  setMaterias]  = useState([]);
  const [horarios,  setHorarios]  = useState([]);
  const [misCitas,  setMisCitas]  = useState([]);

  // Flujo de reserva
  const [selectedMateria,  setSelectedMateria]  = useState(null);
  const [selectedHorario,  setSelectedHorario]  = useState(null);
  const [fecha,            setFecha]            = useState("");
  const [motivo,           setMotivo]           = useState("");

  // UI
  const [tab,          setTab]          = useState("book");
  const [loadingMat,   setLoadingMat]   = useState(true);
  const [loadingHor,   setLoadingHor]   = useState(false);
  const [loadingCitas, setLoadingCitas] = useState(true);
  const [saving,       setSaving]       = useState(false);
  const [error,        setError]        = useState("");
  const [successMsg,   setSuccessMsg]   = useState("");

  // ── Carga inicial ──────────────────────────────────────────────
  useEffect(() => {
    getMaterias()
      .then(setMaterias)
      .catch(() => setError("No se pudieron cargar las materias."))
      .finally(() => setLoadingMat(false));
  }, []);

  useEffect(() => {
    fetchMisCitas();
  }, []);

  async function fetchMisCitas() {
    setLoadingCitas(true);
    try {
      const all = await getCitas();
      setMisCitas(all.filter((c) => c.id_estudiante === user.id));
    } catch {
      setError("No se pudieron cargar tus citas.");
    } finally {
      setLoadingCitas(false);
    }
  }

  // ── Selección de materia ───────────────────────────────────────
  async function handleSelectMateria(materia) {
    setSelectedMateria(materia);
    setSelectedHorario(null);
    setFecha("");
    setMotivo("");
    setError("");
    setLoadingHor(true);
    try {
      const data = await getHorariosByMateria(materia.id);
      setHorarios(data);
    } catch {
      setError("No se pudieron cargar los horarios de esta materia.");
    } finally {
      setLoadingHor(false);
    }
  }

  // ── Reservar cita ──────────────────────────────────────────────
  async function handleReservar() {
    if (!selectedHorario || !fecha || !motivo.trim()) {
      setError("Completa todos los campos: horario, fecha y motivo.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await createCita({
        id_estudiante: user.id,
        id_horario:    selectedHorario.id,
        fecha,
        motivo,
      });
      setSuccessMsg(`✅ Cita reservada con ${selectedHorario.docente} — ${fecha}`);
      setSelectedMateria(null);
      setSelectedHorario(null);
      setFecha("");
      setMotivo("");
      fetchMisCitas();
      setTimeout(() => setSuccessMsg(""), 5000);
    } catch (err) {
      // El backend devuelve 409 cuando el horario ya está ocupado
      if (err.message.includes("disponible") || err.message.includes("disponibilidad")) {
        setError("⚠️ Este horario ya está ocupado en esa fecha. Elige otro horario o fecha.");
      } else {
        setError(err.message);
      }
    } finally {
      setSaving(false);
    }
  }

  // ── Cancelar cita ──────────────────────────────────────────────
  async function handleCancelar(cita) {
    try {
      await updateCita(cita.id, {
        id_horario: cita.id_horario,
        fecha:      cita.fecha,
        motivo:     cita.motivo,
        id_estado:  ID_ESTADO_CANCELADA,
      });
      fetchMisCitas();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleTabChange(newTab) {
    setTab(newTab);
    setSelectedMateria(null);
    setSelectedHorario(null);
    setError("");
  }

  const activasCount = misCitas.filter((c) => c.id_estado !== ID_ESTADO_CANCELADA).length;

  return (
    <div className="page-wrapper">
      <Header user={user} onLogout={logout} />

      <div className="page-content">
        {successMsg && <div className="alert alert-success">{successMsg}</div>}
        {error      && <div className="alert alert-danger">{error}</div>}

        {/* Pestañas */}
        <div className="tab-bar">
          <button className={`tab-btn ${tab === "book" ? "active" : ""}`} onClick={() => handleTabChange("book")}>
            📅 Solicitar asesoría
          </button>
          <button className={`tab-btn ${tab === "my" ? "active" : ""}`} onClick={() => handleTabChange("my")}>
            📋 Mis citas ({activasCount})
          </button>
        </div>

        {/* ── PESTAÑA: Solicitar ─────────────────────────────── */}
        {tab === "book" && (
          <>
            {/* Paso 1 — Materia */}
            <div style={{ marginBottom: "28px" }}>
              <div className="step-header">
                <div className="step-badge step-badge--active">1</div>
                <h2 className="step-title">Elige una materia</h2>
              </div>

              {loadingMat ? (
                <Spinner text="Cargando materias..." />
              ) : (
                <div className="subject-grid">
                  {materias.map((mat, i) => {
                    const palette   = PALETTE[i % PALETTE.length];
                    const isSelected = selectedMateria?.id === mat.id;
                    return (
                      <button
                        key={mat.id}
                        className={`subject-card ${isSelected ? "selected" : ""}`}
                        onClick={() => handleSelectMateria(mat)}
                        style={{
                          borderColor: isSelected ? palette.color : undefined,
                          background:  isSelected ? palette.bg   : undefined,
                        }}
                      >
                        <span className="subject-card__icon" aria-hidden="true">📚</span>
                        <span
                          className="subject-card__name"
                          style={{ color: isSelected ? palette.color : undefined }}
                        >
                          {mat.nombre}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Paso 2 — Horario */}
            {selectedMateria && (
              <div style={{ marginBottom: "28px" }}>
                <div className="step-header">
                  <div className="step-badge step-badge--active">2</div>
                  <h2 className="step-title">
                    Elige un horario — <span style={{ color: "#0d9488" }}>{selectedMateria.nombre}</span>
                  </h2>
                </div>

                {loadingHor ? (
                  <Spinner text="Cargando horarios..." />
                ) : horarios.length === 0 ? (
                  <Card><p className="empty-state">No hay horarios disponibles para esta materia.</p></Card>
                ) : (
                  <div className="teacher-grid">
                    {horarios.map((h) => {
                      const isSelected = selectedHorario?.id === h.id;
                      return (
                        <Card
                          key={h.id}
                          className={`teacher-card ${isSelected ? "teacher-card--selected" : ""}`}
                          style={{ cursor: "pointer" }}
                          onClick={() => { setSelectedHorario(h); setError(""); }}
                        >
                          <div className="teacher-card__header">
                            <div className="teacher-avatar" aria-hidden="true">
                              {h.docente?.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="teacher-card__name">{h.docente}</p>
                              <p className="teacher-card__email">
                                {DIAS[h.dia_semana - 1] ?? `Día ${h.dia_semana}`} · {h.hora_inicio} – {h.hora_fin}
                              </p>
                            </div>
                          </div>
                          {isSelected && (
                            <p style={{ fontSize: "12px", color: "var(--primary-dark)", fontWeight: 600 }}>
                              ✓ Seleccionado
                            </p>
                          )}
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Paso 3 — Fecha y motivo */}
            {selectedHorario && (
              <div>
                <div className="step-header">
                  <div className="step-badge step-badge--active">3</div>
                  <h2 className="step-title">Completa los detalles</h2>
                </div>
                <Card style={{ padding: "20px", maxWidth: "480px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <Input
                      label="Fecha de la asesoría"
                      type="date"
                      value={fecha}
                      onChange={(e) => setFecha(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                    <div className="input-wrapper">
                      <label className="field-label">Motivo / tema a tratar</label>
                      <textarea
                        className="input-field"
                        rows={3}
                        placeholder="Ej: Dudas sobre ecuaciones diferenciales..."
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                        style={{ resize: "vertical" }}
                      />
                    </div>
                    <Btn onClick={handleReservar} disabled={saving}>
                      {saving ? "Reservando..." : "Confirmar reserva ✓"}
                    </Btn>
                  </div>
                </Card>
              </div>
            )}
          </>
        )}

        {/* ── PESTAÑA: Mis citas ──────────────────────────────── */}
        {tab === "my" && (
          <>
            <h2 className="view-title">Mis citas de asesoría</h2>
            {loadingCitas ? (
              <Spinner />
            ) : misCitas.length === 0 ? (
              <Card><p className="empty-state">No tienes citas registradas aún.</p></Card>
            ) : (
              <div className="appt-list">
                {misCitas.map((cita) => {
                  const cancelada = cita.id_estado === ID_ESTADO_CANCELADA;
                  return (
                    <Card
                      key={cita.id}
                      className={`appt-row ${cancelada ? "appt-row--cancelled" : ""}`}
                      style={{ borderLeft: `4px solid ${cancelada ? "var(--text-light)" : "var(--primary-dark)"}` }}
                    >
                      <div className="appt-row__left">
                        <span className="appt-row__icon" aria-hidden="true">📚</span>
                        <div>
                          <p className="appt-row__name">{cita.materia}</p>
                          <p className="appt-row__meta">
                            👨‍🏫 {cita.docente} · 📅 {cita.fecha?.split("T")[0]} · 🕐 {cita.hora_inicio} – {cita.hora_fin}
                          </p>
                          {cita.motivo && (
                            <p className="appt-row__meta" style={{ marginTop: "2px" }}>
                              💬 {cita.motivo}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="appt-row__right">
                        <Badge variant={cancelada ? "gray" : "success"}>
                          {cita.estado}
                        </Badge>
                        {!cancelada && (
                          <Btn variant="danger" size="sm" onClick={() => handleCancelar(cita)}>
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
