import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import { authRepository } from "../../../repositories/authRepository";
import { stations } from "../../../data/stations";
import type { UserRecord } from "../../../types/auth";
import "./AdminPage.css";

function AdminPage() {
  const currentUser: any = authRepository.getCurrentUser();
  const [activeTab, setActiveTab] = useState<"surtidor" | "trabajadores" | "reportes">("surtidor");
  const [workers, setWorkers] = useState<UserRecord[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Control de Roles
  const rawRole = currentUser?.role || currentUser?.rol || "";
  const role = String(rawRole).toUpperCase().trim();
  const isDev = role === "DEVELOPER" || role === "DEV";
  const isOwner = role === "DUENO" || role === "ADMIN" || isDev;
  const isWorker = role === "TRABAJADOR"; // 👈 Aquí se usa activamente

  // Formulario para agregar trabajador (Solo Dueño)
  const [newWorkerName, setNewWorkerName] = useState("");
  const [newWorkerCarnet, setNewWorkerCarnet] = useState("");
  const [newWorkerPassword, setNewWorkerPassword] = useState("");

  // Estado para nuevos comentarios/reportes
  const [newComment, setNewComment] = useState("");

  // Obtener el surtidor asignado
  const assignedStationIndex = stations.findIndex(
    (s: any) => String(s.id) === String(currentUser?.assignedStationId)
  );
  const targetIndex = assignedStationIndex !== -1 ? assignedStationIndex : 0;
  const assignedStation = stations[targetIndex];

  // Cargar datos iniciales asegurando GNV
  const getInitialStationData = () => {
    try {
      const stored = localStorage.getItem("sas_stations");
      if (stored) {
        const list = JSON.parse(stored);
        const match = list.find((s: any) => String(s.id) === String(assignedStation?.id));
        if (match) {
          return {
            ...match,
            fuels: {
              especial: match.fuels?.especial ?? true,
              premium: match.fuels?.premium ?? true,
              diesel: match.fuels?.diesel ?? true,
              gnv: match.fuels?.gnv ?? true,
            },
            prices: {
              especial: match.prices?.especial || "Bs 3.74",
              premium: match.prices?.premium || "Bs 4.79",
              diesel: match.prices?.diesel || "Bs 3.72",
              gnv: match.prices?.gnv || "Bs 2.25",
            }
          };
        }
      }
    } catch (e) {
      console.error(e);
    }
    return assignedStation;
  };

  const initialData: any = getInitialStationData();

  // Estados interactivos
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    if (initialData?.open !== undefined) return Boolean(initialData.open);
    if (initialData?.isOpen !== undefined) return Boolean(initialData.isOpen);
    return true;
  });

  // 📍 Estados independientes para cada tipo de combustible (Incluyendo GNV)
  const [fuels, setFuels] = useState({
    especial: initialData?.fuels?.especial ?? true,
    premium: initialData?.fuels?.premium ?? true,
    diesel: initialData?.fuels?.diesel ?? true,
    gnv: initialData?.fuels?.gnv ?? true,
  });

  // Estado para la cantidad numérica aproximada de autos
  const [queueCountInput, setQueueCountInput] = useState<number>(() => {
    if (initialData?.queue !== undefined) return Number(initialData.queue);
    return 15;
  });

  // Cálculo automático del nivel de fila según la cantidad de autos
  const getQueueLevelFromCount = (count: number): "BAJA" | "MEDIA" | "ALTA" => {
    if (count <= 8) return "BAJA";
    if (count <= 20) return "MEDIA";
    return "ALTA";
  };

  const queueLevel = getQueueLevelFromCount(queueCountInput);

  // Precios (Incluyendo GNV explícitamente)
  const [prices, setPrices] = useState({
    especial: initialData?.prices?.especial || "Bs 3.74",
    premium: initialData?.prices?.premium || "Bs 4.79",
    diesel: initialData?.prices?.diesel || "Bs 3.72",
    gnv: initialData?.prices?.gnv || "Bs 2.25",
  });

  const [commentsList, setCommentsList] = useState<any[]>(initialData?.comments || []);

  const loadWorkers = () => {
    const repo = authRepository as any;
    if (typeof repo.getEmployeesByStation === "function" && assignedStation) {
      const emp = repo.getEmployeesByStation(String(assignedStation.id));
      setWorkers(emp);
    } else if (typeof repo.getAllUsers === "function") {
      const allUsers: UserRecord[] = repo.getAllUsers();
      const userList = allUsers.filter(
        (u) => u.role === "TRABAJADOR" && String(u.assignedStationId) === String(assignedStation?.id)
      );
      setWorkers(userList);
    }
  };

  useEffect(() => {
    if (isOwner) {
      loadWorkers();
    }
  }, [assignedStation?.id, isOwner]);

  // Guardar modificaciones operativas
  const handleSaveChanges = () => {
    if (assignedStation) {
      const calculatedLevel = getQueueLevelFromCount(queueCountInput);
      const hasAnyFuel = Object.values(fuels).some(Boolean);

      try {
        const storedStations = localStorage.getItem("sas_stations");
        let list = storedStations ? JSON.parse(storedStations) : [...stations];
        const idx = list.findIndex((s: any) => String(s.id) === String(assignedStation.id));

        const updatedData = {
          ...(list[idx] || assignedStation),
          open: isOpen,
          isOpen: isOpen,
          status: isOpen ? "Abierto" : "Cerrado",
          fuel: hasAnyFuel,
          hasFuel: hasAnyFuel,
          fuels: fuels,
          queue: queueCountInput,
          queueLevel: calculatedLevel,
          prices: isOwner ? prices : (list[idx]?.prices || assignedStation.prices || { especial: "Bs 3.74", premium: "Bs 4.79", diesel: "Bs 3.72", gnv: "Bs 2.25" }),
          comments: commentsList,
        };

        if (idx !== -1) {
          list[idx] = updatedData;
        } else {
          list.push(updatedData);
        }

        localStorage.setItem("sas_stations", JSON.stringify(list));
      } catch (e) {
        console.error("Error al guardar en localStorage", e);
      }

      window.dispatchEvent(new Event("storage"));
      setSuccessMessage("¡Disponibilidad y precios de GNV actualizados exitosamente!");
      setTimeout(() => setSuccessMessage(""), 4000);
    }
  };

  // Agregar empleado (Solo Dueño)
  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkerName || !newWorkerCarnet || !newWorkerPassword) return;

    const newEmp = {
      name: newWorkerName,
      carnet: newWorkerCarnet,
      password: newWorkerPassword,
      role: "TRABAJADOR",
      assignedStationId: String(assignedStation?.id),
      ownerId: currentUser?.id,
    };

    try {
      const response = await fetch("http://localhost:3001/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEmp),
      });

      if (!response.ok) throw new Error("Error en el servidor");

      const createdWorker = await response.json();

      const repo = authRepository as any;
      if (typeof repo.addEmployee === "function") {
        repo.addEmployee(createdWorker);
      }

      setWorkers((prev) => [...prev, createdWorker]);
      setNewWorkerName("");
      setNewWorkerCarnet("");
      setNewWorkerPassword("");

      setSuccessMessage(`Empleado ${createdWorker.name} guardado exitosamente.`);
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (error) {
      console.error(error);
      alert("Error al guardar el trabajador. Asegúrate de tener ejecutándose 'node server.js'.");
    }
  };

  // Publicar comentario/reporte
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const commentObj = {
      id: String(Date.now()),
      userName: `${currentUser?.name || "Personal"} (${role})`,
      text: newComment,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updatedComments = [commentObj, ...commentsList];
    setCommentsList(updatedComments);
    setNewComment("");

    try {
      const storedStations = localStorage.getItem("sas_stations");
      let list = storedStations ? JSON.parse(storedStations) : [...stations];
      const idx = list.findIndex((s: any) => String(s.id) === String(assignedStation?.id));
      if (idx !== -1) {
        list[idx].comments = updatedComments;
        localStorage.setItem("sas_stations", JSON.stringify(list));
      }
    } catch (err) {
      console.error(err);
    }

    window.dispatchEvent(new Event("storage"));
    setSuccessMessage("¡Reporte publicado en la vista pública del surtidor!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div className="admin-layout">
      <Sidebar />

      <main className="admin-main-content">
        <header className="admin-header">
          <div className="admin-header-flex">
            <div>
              <span className="admin-header-tag">
                {isOwner ? "👑 PANEL DE DUEÑO" : isWorker ? "👷 PANEL DE TRABAJADOR" : "⚙️ PANEL OPERATIVO"}
              </span>
              <h1 className="admin-header-title">
                {assignedStation?.name || "Surtidor Asignado"} ⛽
              </h1>
              <p className="admin-header-desc">
                Bienvenido, <strong>{currentUser?.name || "Usuario"}</strong> ({role}). 
                {isWorker && " Panel operativo optimizado para control rápido de stock de GNV y combustibles."}
              </p>
            </div>

            <div className="admin-metrics-group">
              <div className="admin-metric-card">
                <span className="admin-metric-label">OPERACIÓN</span>
                <strong className={isOpen ? "admin-metric-value-active" : "admin-metric-value-inactive"}>
                  {isOpen ? "ABIERTO" : "CERRADO"}
                </strong>
              </div>
              {isOwner && (
                <div className="admin-metric-card">
                  <span className="admin-metric-label">EMPLEADOS</span>
                  <strong className="admin-metric-value-active">{workers.length} Asignados</strong>
                </div>
              )}
            </div>
          </div>
        </header>

        {successMessage && (
          <div className="save-success-banner">
            ✅ {successMessage}
          </div>
        )}

        {isDev && (
          <div className="dev-banner">
            <div className="dev-banner-info">
              <div className="dev-banner-icon">🛠️</div>
              <div className="dev-banner-text">
                <h4>Módulo de Desarrollador</h4>
                <p>Acceso especial para gestión global de usuarios y rangos.</p>
              </div>
            </div>

            <Link to="/developer" className="dev-banner-btn">
              Ir a Gestión de Usuarios →
            </Link>
          </div>
        )}

        <div className="admin-tabs">
          <button
            onClick={() => setActiveTab("surtidor")}
            className={`tab-btn ${activeTab === "surtidor" ? "active" : ""}`}
          >
            ⚙️ Estado Operativo
          </button>
          
          <button
            onClick={() => setActiveTab("reportes")}
            className={`tab-btn ${activeTab === "reportes" ? "active" : ""}`}
          >
            💬 Novedades y Comentarios ({commentsList.length})
          </button>

          {isOwner && (
            <button
              onClick={() => setActiveTab("trabajadores")}
              className={`tab-btn ${activeTab === "trabajadores" ? "active" : ""}`}
            >
              👥 Mis Empleados ({workers.length})
            </button>
          )}
        </div>

        {activeTab === "surtidor" && (
          <section>
            <h2 className="section-title">Parámetros de Operación</h2>

            <div className="control-cards-grid">
              <div className="control-card">
                <div className="card-header-flex">
                  <span className="card-category">OPERATIVIDAD</span>
                  <span className={`card-status-dot ${isOpen ? "open" : "closed"}`}>
                    {isOpen ? "● ABIERTO" : "● CERRADO"}
                  </span>
                </div>
                <h3>Estado Abierto / Cerrado</h3>
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className={`action-toggle-btn ${isOpen ? "btn-open" : "btn-closed"}`}
                >
                  {isOpen ? "🟢 Surtidor Abierto" : "🔴 Surtidor Cerrado"}
                </button>
              </div>

              <div className="control-card" style={{ gridColumn: "span 2" }}>
                <div className="card-header-flex">
                  <span className="card-category">INVENTARIO INDEPENDIENTE</span>
                  <span className="card-status-dot open">DISPONIBILIDAD POR TIPO</span>
                </div>
                <h3>Regulación de Combustibles y GNV</h3>
                <p style={{ fontSize: "0.8rem", color: "#64748b", margin: "4px 0 12px 0" }}>
                  Activa o desactiva cada tipo de combustible según el stock actual del surtidor:
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={() => setFuels({ ...fuels, especial: !fuels.especial })}
                    className={`action-toggle-btn ${fuels.especial ? "btn-fuel-on" : "btn-fuel-off"}`}
                    style={{ padding: "10px", fontSize: "0.85rem" }}
                  >
                    {fuels.especial ? "🟢 Gasolina Especial: Hay" : "🔴 Gasolina Especial: Agotado"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setFuels({ ...fuels, premium: !fuels.premium })}
                    className={`action-toggle-btn ${fuels.premium ? "btn-fuel-on" : "btn-fuel-off"}`}
                    style={{ padding: "10px", fontSize: "0.85rem" }}
                  >
                    {fuels.premium ? "🟢 Gasolina Premium: Hay" : "🔴 Gasolina Premium: Agotado"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setFuels({ ...fuels, diesel: !fuels.diesel })}
                    className={`action-toggle-btn ${fuels.diesel ? "btn-fuel-on" : "btn-fuel-off"}`}
                    style={{ padding: "10px", fontSize: "0.85rem" }}
                  >
                    {fuels.diesel ? "🟢 Diésel: Hay" : "🔴 Diésel: Agotado"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setFuels({ ...fuels, gnv: !fuels.gnv })}
                    className={`action-toggle-btn ${fuels.gnv ? "btn-fuel-on" : "btn-fuel-off"}`}
                    style={{ padding: "10px", fontSize: "0.85rem" }}
                  >
                    {fuels.gnv ? "🟢 GNV: Hay" : "🔴 GNV: Agotado"}
                  </button>
                </div>
              </div>

              <div className="control-card">
                <div className="card-header-flex">
                  <span className="card-category">TRÁFICO</span>
                  <span className="card-status-dot open">NIVEL {queueLevel}</span>
                </div>
                <h3>Fila de Vehículos</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700 }}>
                    Cantidad aproximada de autos:
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={queueCountInput}
                    onChange={(e) => setQueueCountInput(Number(e.target.value))}
                    className="queue-select"
                    placeholder="Ej. 12"
                  />
                </div>
              </div>

              {isOwner && (
                <div className="control-card" style={{ gridColumn: "span 2" }}>
                  <div className="card-header-flex">
                    <span className="card-category">TARIFAS (EXCLUSIVO DUEÑO)</span>
                    <span className="card-status-dot open">PRECIOS ACTUALES</span>
                  </div>
                  <h3>Precios Oficiales (Incluyendo GNV)</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px", marginTop: "10px" }}>
                    <div>
                      <label style={{ fontSize: "0.75rem", fontWeight: 700 }}>Especial:</label>
                      <input
                        type="text"
                        value={prices.especial}
                        onChange={(e) => setPrices({ ...prices, especial: e.target.value })}
                        className="queue-select"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.75rem", fontWeight: 700 }}>Premium:</label>
                      <input
                        type="text"
                        value={prices.premium}
                        onChange={(e) => setPrices({ ...prices, premium: e.target.value })}
                        className="queue-select"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.75rem", fontWeight: 700 }}>Diésel:</label>
                      <input
                        type="text"
                        value={prices.diesel}
                        onChange={(e) => setPrices({ ...prices, diesel: e.target.value })}
                        className="queue-select"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.75rem", fontWeight: 700 }}>GNV:</label>
                      <input
                        type="text"
                        value={prices.gnv}
                        onChange={(e) => setPrices({ ...prices, gnv: e.target.value })}
                        className="queue-select"
                        placeholder="Ej. Bs 2.25"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="save-action-container">
              <button onClick={handleSaveChanges} className="modify-save-btn">
                💾 Publicar Estado Operativo y Precios del Surtidor
              </button>
            </div>
          </section>
        )}

        {activeTab === "reportes" && (
          <section className="workers-card">
            <h2 className="section-title">Publicar Novedades del Surtidor</h2>
            <form onSubmit={handleAddComment} style={{ marginBottom: "24px", display: "flex", gap: "10px" }}>
              <input
                type="text"
                placeholder="Escribe una novedad..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="queue-select"
                style={{ flex: 1 }}
                required
              />
              <button type="submit" className="modify-save-btn" style={{ padding: "10px 20px" }}>
                Enviar Reporte
              </button>
            </form>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {commentsList.length === 0 ? (
                <p className="no-workers">No hay reportes publicados recientemente.</p>
              ) : (
                commentsList.map((c, idx) => (
                  <div key={c.id || idx} style={{ padding: "12px 16px", backgroundColor: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <strong style={{ fontSize: "0.85rem", color: "#059669" }}>{c.userName}</strong>
                      <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{c.timestamp}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: "0.9rem", color: "#334155" }}>{c.text}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {activeTab === "trabajadores" && isOwner && (
          <section className="workers-card">
            <h2 className="section-title">Gestión de Empleados Asignados</h2>
            <form onSubmit={handleAddEmployee} style={{ backgroundColor: "#f8fafc", padding: "18px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "24px" }}>
              <h3 style={{ margin: "0 0 12px 0", fontSize: "0.95rem" }}>➕ Registrar Nuevo Empleado</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "10px", alignItems: "end" }}>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700 }}>Nombre Completo:</label>
                  <input
                    type="text"
                    required
                    value={newWorkerName}
                    onChange={(e) => setNewWorkerName(e.target.value)}
                    className="queue-select"
                    placeholder="Ej. Juan Pérez"
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700 }}>Carnet / ID:</label>
                  <input
                    type="text"
                    required
                    value={newWorkerCarnet}
                    onChange={(e) => setNewWorkerCarnet(e.target.value)}
                    className="queue-select"
                    placeholder="Ej. 1234567"
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700 }}>Contraseña:</label>
                  <input
                    type="password"
                    required
                    value={newWorkerPassword}
                    onChange={(e) => setNewWorkerPassword(e.target.value)}
                    className="queue-select"
                    placeholder="••••••••"
                  />
                </div>
                <button type="submit" className="modify-save-btn" style={{ padding: "11px 20px" }}>
                  Añadir
                </button>
              </div>
            </form>

            <div className="workers-table-container">
              <table className="workers-table">
                <thead>
                  <tr>
                    <th>Nombre Completo</th>
                    <th>Carnet / ID</th>
                    <th>Rol Asignado</th>
                  </tr>
                </thead>
                <tbody>
                  {workers.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="no-workers">
                        No hay empleados asignados a este surtidor.
                      </td>
                    </tr>
                  ) : (
                    workers.map((w) => (
                      <tr key={w.id}>
                        <td className="worker-name">{w.name}</td>
                        <td className="worker-carnet">{w.carnet}</td>
                        <td>
                          <span className="worker-badge">{w.role}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default AdminPage;