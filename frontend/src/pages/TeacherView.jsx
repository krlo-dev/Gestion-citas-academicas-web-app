/**
 * TeacherView.jsx — Panel del docente.
 *
 * Endpoints usados:
 *   GET /api/horarios/docente/:id  → obtener IDs de horarios propios
 *   GET /api/citas                 → filtrar por esos IDs
 *   PUT /api/citas/:id             → cancelar cita
 */
import { useState, useEffect } from "react";
import { useAuth }              from "../context/AuthContext";
import { getHorariosByDocente, getCitas, updateCita } from "../services/api";
import Header  from "../components/Header";
import Card    from "../components/ui/Card";
import Badge   from "../components/ui/Badge";
import Btn     from "../components/ui/Btn";
import Spinner from "../components/ui/Spinner";
import "../styles/teacher.css";

const ID_ESTADO_CANCELADA = 3;

export default function TeacherView() {
  const { user, logout } = useAuth();

  const [citas,   setCitas]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [tab,     setTab]     = useState("upcoming");

  useEffect(() => {
    fetchCitas();
  }, []);

  async function fetchCitas() {
    setLoading(true);
    setError("");
    try {
      // 1. Obtener los IDs de los horarios de este docente
      const misHorarios = await getHorariosByDocente(user.id);
      const misHorarioIds = new Set(misHorarios.map((h) => h.id));

      // 2. Obtener todas las citas y filtrar las que pertenecen a este docente
      const all = await getCitas();
      const misCitas = all.filter((c) => misHorarioIds.has(c.id_horario));
      setCitas(misCitas);
    } catch (err) {
      setError(err.message ?? "Error al cargar las citas.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancelar(cita) {
    try {
      await updateCita(cita.id, {
        id_horario: cita.id_horario,
        fecha:      cita.fecha,
        motivo:     cita.motivo,
        id_estado:  ID_ESTADO_CANCELADA,
      });
      fetchCitas();
    } catch (err) {
      setError(err.message);
    }
  }

  const proximas   = citas.filter((c) => c.id_estado !== ID_ESTADO_CANCELADA);
  const canceladas = citas.filter((c) => c.id_estado === ID_ESTADO_CANCELADA);
  const shown      = tab === "upcoming" ? proximas : canceladas;

  return (
    <div className="page-wrapper">
      <Header user={user} onLogout={logout} />

      <div className="page-content--narrow">
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="teacher-view-top">
          <h1 className="teacher-view-top__title">Panel del Docente</h1>
          <div className="stats-row">
            <Card className="stat-card">
              <p className="stat-card__value stat-card__value--primary">{proximas.length}</p>
              <p className="stat-card__label">Próximas citas</p>
            </Card>
            <Card className="stat-card">
              <p className="stat-card__value stat-card__value--muted">{canceladas.length}</p>
              <p className="stat-card__label">Canceladas</p>
            </Card>
          </div>
        </div>

        <div className="tab-bar">
          <button className={`tab-btn ${tab === "upcoming"  ? "active" : ""}`} onClick={() => setTab("upcoming")}>
            ✅ Próximas ({proximas.length})
          </button>
          <button className={`tab-btn ${tab === "cancelled" ? "active" : ""}`} onClick={() => setTab("cancelled")}>
            ❌ Canceladas ({canceladas.length})
          </button>
        </div>

        {loading ? (
          <Spinner />
        ) : shown.length === 0 ? (
          <Card>
            <p className="empty-state">
              {tab === "upcoming" ? "No tienes citas programadas." : "No hay citas canceladas."}
            </p>
          </Card>
        ) : (
          <div className="teacher-appt-list">
            {shown.map((cita) => {
              const cancelada = cita.id_estado === ID_ESTADO_CANCELADA;
              return (
                <Card
                  key={cita.id}
                  className="teacher-appt-row"
                  style={{ borderLeft: `4px solid var(--primary-dark)` }}
                >
                  <div className="teacher-appt-row__left">
                    <div className="student-avatar" aria-hidden="true">
                      {cita.estudiante?.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="teacher-appt-row__student-name">{cita.estudiante}</p>
                      <p className="teacher-appt-row__meta">
                        📚 {cita.materia} · 📅 {cita.fecha?.split("T")[0]} · 🕐 {cita.hora_inicio} – {cita.hora_fin}
                      </p>
                      {cita.motivo && (
                        <p className="teacher-appt-row__meta">💬 {cita.motivo}</p>
                      )}
                    </div>
                  </div>
                  <div className="teacher-appt-row__right">
                    <Badge variant={cancelada ? "gray" : "success"}>{cita.estado}</Badge>
                    {!cancelada && (
                      <Btn variant="danger" size="sm" onClick={() => handleCancelar(cita)}>
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
