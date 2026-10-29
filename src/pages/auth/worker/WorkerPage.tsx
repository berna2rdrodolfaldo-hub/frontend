import { useState, useEffect } from "react";
import Sidebar from "../../../components/Sidebar";
import { authRepository } from "../../../repositories/authRepository";
import { stations } from "../../../data/stations";
import "../admin/AdminPage.css";

function WorkerPage() {
  const currentUser: any = authRepository.getCurrentUser();
  const [activeTab, setActiveTab] = useState<"surtidor" | "reportes">("surtidor");
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Control de Roles (Trabajador)
  const rawRole = currentUser?.role || currentUser?.rol || "";
  const role = String(rawRole).toUpperCase().trim();

  // Estado para nuevos comentarios/reportes
  const [newComment, setNewComment] = useState("");

  // Obtener el surtidor asignado
  const assignedStationIndex = stations.findIndex(
    (s: any) => String(s.id) === String(currentUser?.assignedStationId)
  );
  const targetIndex = assignedStationIndex !== -1 ? assignedStationIndex : 0;
  const assignedStation = stations[targetIndex];

  // Cargar datos iniciales garantizando persistencia
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

  // Estados independientes para cada tipo de combustible
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

  const getQueueLevelFromCount = (count: number): "BAJA" | "MEDIA" | "ALTA" => {
    if (count <= 8) return "BAJA";
    if (count <= 20) return "MEDIA";
    return "ALTA";
  };

  const queueLevel = getQueueLevelFromCount(queueCountInput);
  const [commentsList, setCommentsList] = useState<any[]>(initialData?.comments || []);

  // Guardar modificaciones operativas de forma persistente
  const handleSaveChanges = async () => {
    if (assignedStation) {
      const calculatedLevel = getQueueLevelFromCount(queueCountInput);
      const hasAnyFuel = Object.values(fuels).some(Boolean);
      const existingItem = initialData || assignedStation;

      const updatedData = {
        ...existingItem,
        open: isOpen,
        isOpen: isOpen,
        status: isOpen ? "Abierto" : "Cerrado",
        fuel: hasAnyFuel,
        hasFuel: hasAnyFuel,
        fuels: fuels,
        queue: queueCountInput,
        queueLevel: calculatedLevel,
        comments: commentsList,
      };

      try {
        const storedStations = localStorage.getItem("sas_stations");
        let list = storedStations ? JSON.parse(storedStations) : [...stations];
        const idx = list.findIndex((s: any) => String(s.id) === String(assignedStation.id));

        if (idx !== -1) {
          list[idx] = updatedData;
        } else {
          list.push(updatedData);
        }

        localStorage.setItem("sas_stations", JSON.stringify(list));
      } catch (e) {
        console.error("Error al guardar en localStorage", e);
      }

      try {
        await fetch(`https://frontend-9rgm.onrender.com/api/stations/${assignedStation.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        });
      } catch (err) {
        console.warn("Servidor backend en Render no disponible temporalmente:", err);
      }

      window.dispatchEvent(new Event("storage"));
      setSuccessMessage("¡Estado operativo y stock del surtidor actualizados exitosamente!");
      setTimeout(() => setSuccessMessage(""), 4000);
    }
  };

  // Publicar comentario/reporte
  const handleAddComment = async (e: React.FormEvent) => {
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
              <span className="admin-header-tag">👷 PANEL DE TRABAJADOR</span>
              <h1 className="admin-header-title">
                {assignedStation?.name || "Surtidor Asignado"} ⛽
              </h1>
              <p className="admin-header-desc">
                Bienvenido, <strong>{currentUser?.name || "Trabajador"}</strong> ({role}). 
                Panel operativo para control de stock, disponibilidad y tráfico.
              </p>
            </div>

            <div className="admin-metrics-group">
              <div className="admin-metric-card">
                <span className="admin-metric-label">OPERACIÓN</span>
                <strong className={isOpen ? "admin-metric-value-active" : "admin-metric-value-inactive"}>
                  {isOpen ? "ABIERTO" : "CERRADO"}
                </strong>
              </div>
            </div>
          </div>
        </header>

        {successMessage && (
          <div className="save-success-banner">
            ✅ {successMessage}
          </div>
        )}

        <div className="admin-tabs">
          <button
            onClick={() => setActiveTab("surtidor")}
            className={`tab-btn ${activeTab === "surtidor" ? "active" : ""}`}
          >
            ⚙️ Estado Operativo y Stock
          </button>
          
          <button
            onClick={() => setActiveTab("reportes")}
            className={`tab-btn ${activeTab === "reportes" ? "active" : ""}`}
          >
            💬 Novedades y Comentarios ({commentsList.length})
          </button>
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
            </div>

            <div className="save-action-container">
              <button onClick={handleSaveChanges} className="modify-save-btn">
                💾 Guardar y Publicar Estado Operativo
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
      </main>
    </div>
  );
}

export default WorkerPage;