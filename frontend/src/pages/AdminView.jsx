/**
 * AdminView.jsx — Panel del administrador.
 *
 * Endpoints usados:
 *   GET/POST/PUT/DELETE /api/usuarios
 *   GET/POST/DELETE     /api/horarios
 *   GET/PUT/DELETE      /api/citas
 *   GET                 /api/catalogos/roles
 *   GET                 /api/catalogos/materias
 */
import { useState, useEffect } from "react";
import { useAuth }    from "../context/AuthContext";
import {
  getUsuarios, createUsuario, deleteUsuario,
  getHorarios, createHorario, deleteHorario,
  getCitas, updateCita, deleteCita,
  getRoles, getMaterias,
} from "../services/api";
import Header  from "../components/Header";
import Card    from "../components/ui/Card";
import Badge   from "../components/ui/Badge";
import Btn     from "../components/ui/Btn";
import Input   from "../components/ui/Input";
import Select  from "../components/ui/Select";
import Spinner from "../components/ui/Spinner";
import "../styles/admin.css";

const ID_ESTADO_CANCELADA = 3;
const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

const EMPTY_USER    = { nombre: "", email: "", password: "", id_rol: "" };
const EMPTY_HORARIO = { id_docente: "", id_materia: "", dia_semana: "", hora_inicio: "", hora_fin: "" };

export default function AdminView() {
  const { user, logout } = useAuth();
  const [tab, setTab]    = useState("overview");

  // Catálogos
  const [roles,    setRoles]    = useState([]);
  const [materias, setMaterias] = useState([]);

  // Datos principales
  const [usuarios,  setUsuarios]  = useState([]);
  const [horarios,  setHorarios]  = useState([]);
  const [citas,     setCitas]     = useState([]);

  // Formularios
  const [newUser,    setNewUser]    = useState(EMPTY_USER);
  const [newHorario, setNewHorario] = useState(EMPTY_HORARIO);

  // UI
  const [loading,      setLoading]      = useState(true);
  const [notification, setNotification] = useState("");
  const [error,        setError]        = useState("");

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const [r, m, u, h, c] = await Promise.all([
        getRoles(), getMaterias(), getUsuarios(), getHorarios(), getCitas(),
      ]);
      setRoles(r); setMaterias(m); setUsuarios(u); setHorarios(h); setCitas(c);
    } catch (err) {
      setError(err.message ?? "Error al cargar los datos.");
    } finally {
      setLoading(false);
    }
  }

  function notify(msg) {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3500);
  }

  // ── Usuarios ────────────────────────────────────────────────────
  async function handleCreateUser() {
    const { nombre, email, password, id_rol } = newUser;
    if (!nombre || !email || !password || !id_rol) {
      setError("Completa todos los campos del formulario.");
      return;
    }
    try {
      await createUsuario({ nombre, email, password, id_rol: parseInt(id_rol) });
      setNewUser(EMPTY_USER);
      notify("✅ Usuario creado correctamente");
      const u = await getUsuarios();
      setUsuarios(u);
    } catch (err) { setError(err.message); }
  }

  async function handleDeleteUser(id) {
    if (!confirm("¿Eliminar este usuario?")) return;
    try {
      await deleteUsuario(id);
      notify("🗑️ Usuario eliminado");
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch (err) { setError(err.message); }
  }

  // ── Horarios ────────────────────────────────────────────────────
  async function handleCreateHorario() {
    const { id_docente, id_materia, dia_semana, hora_inicio, hora_fin } = newHorario;
    if (!id_docente || !id_materia || !dia_semana || !hora_inicio || !hora_fin) {
      setError("Completa todos los campos del horario.");
      return;
    }
    try {
      await createHorario({
        id_docente: parseInt(id_docente),
        id_materia: parseInt(id_materia),
        dia_semana: parseInt(dia_semana),
        hora_inicio, hora_fin,
      });
      setNewHorario(EMPTY_HORARIO);
      notify("✅ Horario creado correctamente");
      const h = await getHorarios();
      setHorarios(h);
    } catch (err) { setError(err.message); }
  }

  async function handleDeleteHorario(id) {
    if (!confirm("¿Eliminar este horario?")) return;
    try {
      await deleteHorario(id);
      notify("🗑️ Horario eliminado");
      setHorarios((prev) => prev.filter((h) => h.id !== id));
    } catch (err) { setError(err.message); }
  }

  // ── Citas ───────────────────────────────────────────────────────
  async function handleCancelarCita(cita) {
    try {
      await updateCita(cita.id, {
        id_horario: cita.id_horario,
        fecha:      cita.fecha,
        motivo:     cita.motivo,
        id_estado:  ID_ESTADO_CANCELADA,
      });
      notify("Cita cancelada");
      const c = await getCitas();
      setCitas(c);
    } catch (err) { setError(err.message); }
  }

  async function handleEliminarCita(id) {
    if (!confirm("¿Eliminar esta cita permanentemente?")) return;
    try {
      await deleteCita(id);
      notify("🗑️ Cita eliminada");
      setCitas((prev) => prev.filter((c) => c.id !== id));
    } catch (err) { setError(err.message); }
  }

  const docentes   = usuarios.filter((u) => u.id_rol === 2 || u.rol === "Docente");
  const activeAppts = citas.filter((c) => c.id_estado !== ID_ESTADO_CANCELADA);

  const ADMIN_TABS = [
    { id: "overview", label: "📊 Resumen"         },
    { id: "usuarios", label: "👥 Usuarios"        },
    { id: "horarios", label: "🗓️ Horarios"        },
    { id: "citas",    label: "📅 Todas las citas" },
  ];

  if (loading) return (
    <div className="page-wrapper">
      <Header user={user} onLogout={logout} />
      <Spinner text="Cargando panel de administración..." />
    </div>
  );

  return (
    <div className="page-wrapper">
      <Header user={user} onLogout={logout} />

      <div className="page-content">
        {notification && <div className="alert alert-success">{notification}</div>}
        {error        && <div className="alert alert-danger" onClick={() => setError("")} style={{ cursor: "pointer" }}>{error} ✕</div>}

        <div className="tab-bar">
          {ADMIN_TABS.map((t) => (
            <button key={t.id} className={`tab-btn ${tab === t.id ? "active" : ""}`} onClick={() => { setTab(t.id); setError(""); }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── RESUMEN ─────────────────────────────────────────── */}
        {tab === "overview" && (
          <>
            <div className="metrics-grid">
              {[
                { label: "Usuarios",     value: usuarios.length,    icon: "👥", color: "var(--primary-dark)" },
                { label: "Horarios",     value: horarios.length,    icon: "🗓️", color: "#7c3aed"            },
                { label: "Citas activas",value: activeAppts.length, icon: "✅", color: "var(--success)"     },
                { label: "Citas totales",value: citas.length,       icon: "📅", color: "var(--accent)"      },
              ].map((stat) => (
                <Card key={stat.label} className="metric-card" style={{ borderLeft: `4px solid ${stat.color}` }}>
                  <div className="metric-card__top">
                    <div>
                      <p className="metric-card__label">{stat.label}</p>
                      <p className="metric-card__value" style={{ color: stat.color }}>{stat.value}</p>
                    </div>
                    <span className="metric-card__icon" aria-hidden="true">{stat.icon}</span>
                  </div>
                </Card>
              ))}
            </div>
            <Card className="recent-card">
              <h3 className="recent-card__title">Últimas citas</h3>
              {[...citas].reverse().slice(0, 5).map((c) => (
                <div key={c.id} className="recent-row">
                  <div className="recent-row__left">
                    <span className="recent-row__icon" aria-hidden="true">📚</span>
                    <div>
                      <p className="recent-row__names">🎒 {c.estudiante} → 👨‍🏫 {c.docente}</p>
                      <p className="recent-row__meta">{c.materia} · {c.fecha?.split("T")[0]}</p>
                    </div>
                  </div>
                  <Badge variant={c.id_estado === ID_ESTADO_CANCELADA ? "gray" : "success"}>
                    {c.estado}
                  </Badge>
                </div>
              ))}
              {citas.length === 0 && <p className="empty-state" style={{ padding: "20px" }}>No hay citas.</p>}
            </Card>
          </>
        )}

        {/* ── USUARIOS ────────────────────────────────────────── */}
        {tab === "usuarios" && (
          <div className="two-col-grid">
            <Card className="form-card">
              <h3 className="form-card__title">➕ Nuevo usuario</h3>
              <div className="form-fields">
                <Input label="Nombre completo" value={newUser.nombre} onChange={(e) => setNewUser((p) => ({ ...p, nombre: e.target.value }))} placeholder="Nombre Apellido" />
                <Input label="Correo electrónico" type="email" value={newUser.email} onChange={(e) => setNewUser((p) => ({ ...p, email: e.target.value }))} placeholder="usuario@edu.co" />
                <Input label="Contraseña" type="password" value={newUser.password} onChange={(e) => setNewUser((p) => ({ ...p, password: e.target.value }))} placeholder="••••••••" />
                <Select label="Rol" value={newUser.id_rol} onChange={(e) => setNewUser((p) => ({ ...p, id_rol: e.target.value }))}>
                  <option value="">Seleccionar rol</option>
                  {roles.map((r) => <option key={r.id} value={r.id}>{r.nombre}</option>)}
                </Select>
                <Btn onClick={handleCreateUser}>Crear usuario</Btn>
              </div>
            </Card>
            <div>
              <h3 className="items-list__title">Usuarios ({usuarios.length})</h3>
              <div className="items-list">
                {usuarios.map((u) => (
                  <Card key={u.id} className="item-row">
                    <div className="item-row__left">
                      <div className="admin-teacher-avatar" aria-hidden="true">
                        {u.nombre?.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="item-row__name">{u.nombre}</p>
                        <p className="item-row__sub">{u.rol} · {u.email}</p>
                      </div>
                    </div>
                    <Btn variant="ghost" size="sm" onClick={() => handleDeleteUser(u.id)}>🗑️</Btn>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── HORARIOS ────────────────────────────────────────── */}
        {tab === "horarios" && (
          <div className="two-col-grid">
            <Card className="form-card">
              <h3 className="form-card__title">➕ Nuevo horario</h3>
              <div className="form-fields">
                <Select label="Docente" value={newHorario.id_docente} onChange={(e) => setNewHorario((p) => ({ ...p, id_docente: e.target.value }))}>
                  <option value="">Seleccionar docente</option>
                  {docentes.map((d) => <option key={d.id} value={d.id}>{d.nombre}</option>)}
                </Select>
                <Select label="Materia" value={newHorario.id_materia} onChange={(e) => setNewHorario((p) => ({ ...p, id_materia: e.target.value }))}>
                  <option value="">Seleccionar materia</option>
                  {materias.map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                </Select>
                <Select label="Día de la semana" value={newHorario.dia_semana} onChange={(e) => setNewHorario((p) => ({ ...p, dia_semana: e.target.value }))}>
                  <option value="">Seleccionar día</option>
                  {DIAS.map((d, i) => <option key={i + 1} value={i + 1}>{d}</option>)}
                </Select>
                <Input label="Hora inicio" type="time" value={newHorario.hora_inicio} onChange={(e) => setNewHorario((p) => ({ ...p, hora_inicio: e.target.value }))} />
                <Input label="Hora fin"    type="time" value={newHorario.hora_fin}    onChange={(e) => setNewHorario((p) => ({ ...p, hora_fin:    e.target.value }))} />
                <Btn onClick={handleCreateHorario}>Crear horario</Btn>
              </div>
            </Card>
            <div>
              <h3 className="items-list__title">Horarios ({horarios.length})</h3>
              <div className="items-list">
                {horarios.map((h) => (
                  <Card key={h.id} className="item-row">
                    <div className="item-row__left">
                      <span className="item-row__icon" aria-hidden="true">🗓️</span>
                      <div>
                        <p className="item-row__name">{h.docente}</p>
                        <p className="item-row__sub">
                          {h.materia} · {DIAS[h.dia_semana - 1] ?? h.dia_semana} {h.hora_inicio}–{h.hora_fin}
                        </p>
                      </div>
                    </div>
                    <Btn variant="ghost" size="sm" onClick={() => handleDeleteHorario(h.id)}>🗑️</Btn>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TODAS LAS CITAS ─────────────────────────────────── */}
        {tab === "citas" && (
          <>
            <div className="all-appts-header">
              <h3 className="all-appts-header__title">Todas las citas ({citas.length})</h3>
              <div className="all-appts-header__badges">
                <Badge variant="success">Activas: {activeAppts.length}</Badge>
                <Badge variant="gray">Canceladas: {citas.length - activeAppts.length}</Badge>
              </div>
            </div>
            {citas.length === 0 ? (
              <Card><p className="empty-state">No hay citas registradas.</p></Card>
            ) : (
              <div className="all-appts-list">
                {citas.map((c) => {
                  const cancelada = c.id_estado === ID_ESTADO_CANCELADA;
                  return (
                    <Card
                      key={c.id}
                      className={`all-appt-row ${cancelada ? "all-appt-row--cancelled" : ""}`}
                      style={{ borderLeft: `4px solid var(--primary-dark)` }}
                    >
                      <div className="all-appt-row__left">
                        <span className="all-appt-row__icon" aria-hidden="true">📚</span>
                        <div>
                          <p className="all-appt-row__names">🎒 {c.estudiante} → 👨‍🏫 {c.docente}</p>
                          <p className="all-appt-row__meta">
                            {c.materia} · 📅 {c.fecha?.split("T")[0]} · 🕐 {c.hora_inicio}–{c.hora_fin}
                          </p>
                        </div>
                      </div>
                      <div className="all-appt-row__right">
                        <Badge variant={cancelada ? "gray" : "success"}>{c.estado}</Badge>
                        {!cancelada && (
                          <Btn variant="danger" size="sm" onClick={() => handleCancelarCita(c)}>Cancelar</Btn>
                        )}
                        <Btn variant="ghost" size="sm" onClick={() => handleEliminarCita(c.id)}>🗑️</Btn>
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
