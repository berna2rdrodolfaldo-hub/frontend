import { useState, useEffect } from "react";
import Sidebar from "../../../components/Sidebar";
import { authRepository } from "../../../repositories/authRepository";
import { stations } from "../../../data/stations";
import "./WorkerPage.css";

export default function WorkerPage() {
  const currentUser: any = authRepository.getCurrentUser();
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [newComment, setNewComment] = useState("");

  // Obtener el surtidor asignado al trabajador
  const assignedStationIndex = stations.findIndex(
    (s: any) => String(s.id) === String(currentUser?.assignedStationId)
  );
  const targetIndex = assignedStationIndex !== -1 ? assignedStationIndex : 0;
  const assignedStation = stations[targetIndex];

  // Cargar datos actuales desde localStorage o fallback
  const getInitialStationData = () => {
    try {
      const stored = localStorage.getItem("sas_stations");
      if (stored) {
        const list = JSON.parse(stored);
        const match = list.find((s: any) => String(s.id) === String(assignedStation?.id));
        if (match) return match;
      }
    } catch (e) {
      console.error(e);
    }
    return assignedStation;
  };

  const initialData: any = getInitialStationData();

  // Estados habilitados ÚNICAMENTE para el trabajador
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    if (initialData?.open !== undefined) return Boolean(initialData.open);
    if (initialData?.isOpen !== undefined) return Boolean(initialData.isOpen);
    return true;
  });

  const [hasFuel, setHasFuel] = useState<boolean>(() => {
    if (initialData?.fuel !== undefined) return Boolean(initialData.fuel);
    return true;
  });

  const [queueLevel, setQueueLevel] = useState<"BAJA" | "MEDIA" | "ALTA">((): "BAJA" | "MEDIA" | "ALTA" => {
    if (initialData?.queueLevel) return initialData.queueLevel;
    if (initialData?.queue !== undefined) {
      if (initialData.queue <= 8) return "BAJA";
      if (initialData.queue <= 20) return "MEDIA";
      return "ALTA";
    }
    return "MEDIA";
  });

  const [commentsList, setCommentsList] = useState<any[]>(initialData?.comments || []);

  // Actualizar en localStorage el estado del surtidor
  const handleSaveChanges = () => {
    if (assignedStation) {
      let queueCount = 15;
      if (queueLevel === "BAJA") queueCount = 5;
      if (queueLevel === "MEDIA") queueCount = 15;
      if (queueLevel === "ALTA") queueCount = 30;

      try {
        const storedStations = localStorage.getItem("sas_stations");
        let list = storedStations ? JSON.parse(storedStations) : [...stations];
        const idx = list.findIndex((s: any) => String(s.id) === String(assignedStation.id));

        const updatedData = {
          ...(list[idx] || assignedStation),
          open: isOpen,
          isOpen: isOpen,
          status: isOpen ? "Abierto" : "Cerrado",
          fuel: hasFuel,
          hasFuel: hasFuel,
          queue: queueCount,
          queueLevel: queueLevel,
          comments: commentsList,
        };

        if (idx !== -1) {
          list[idx] = updatedData;
        } else {
          list.push(updatedData);
        }

        localStorage.setItem("sas_stations", JSON.stringify(list));
      } catch (e) {
        console.error("Error al guardar cambios", e);
      }

      window.dispatchEvent(new Event("storage"));
      setSuccessMessage("¡Estado operativo guardado correctamente!");
      setTimeout(() => setSuccessMessage(""), 3500);
    }
  };

  // Publicar comentario/novedad
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const commentObj = {
      id: String(Date.now()),
      userName: `${currentUser?.name || "Trabajador"} (TRABAJADOR)`,
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
    setSuccessMessage("¡Novedad publicada!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div className="admin-layout">
      <Sidebar />

      <main className="admin-main-content">
        <header className="admin-header">
          <div className="admin-header-flex">
            <div>
              <span className="admin-header-tag">👷 AJUSTADOR DE ESTADO OPERATIVO</span>
              <h1 className="admin-header-title">
                {assignedStation?.name || "Surtidor Asignado"} ⛽
              </h1>
              <p className="admin-header-desc">
                Operador: <strong>{currentUser?.name || "Trabajador"}</strong>.
              </p>
            </div>

            <div className="admin-metrics-group">
              <div className="admin-metric-card">
                <span className="admin-metric-label">ESTADO ACTUAL</span>
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

        {/* AJUSTADOR OPERATIVO DE ESTADO */}
        <section style={{ marginBottom: "30px" }}>
          <h2 className="section-title">Ajuste de Disponibilidad y Servicio</h2>

          <div className="control-cards-grid">
            {/* Control 1: Abierto / Cerrado */}
            <div className="control-card">
              <div className="card-header-flex">
                <span className="card-category">OPERATIVIDAD</span>
                <span className={`card-status-dot ${isOpen ? "open" : "closed"}`}>
                  {isOpen ? "● ABIERTO" : "● CERRADO"}
                </span>
              </div>
              <h3>Estado del Surtidor</h3>
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`action-toggle-btn ${isOpen ? "btn-open" : "btn-closed"}`}
              >
                {isOpen ? "🟢 Marcar Abierto" : "🔴 Marcar Cerrado"}
              </button>
            </div>

            {/* Control 2: Stock de Combustible */}
            <div className="control-card">
              <div className="card-header-flex">
                <span className="card-category">INVENTARIO</span>
                <span className={`card-status-dot ${hasFuel ? "open" : "warning"}`}>
                  {hasFuel ? "● DISPONIBLE" : "● AGOTADO"}
                </span>
              </div>
              <h3>Stock de Combustible</h3>
              <button
                type="button"
                onClick={() => setHasFuel(!hasFuel)}
                className={`action-toggle-btn ${hasFuel ? "btn-fuel-on" : "btn-fuel-off"}`}
              >
                {hasFuel ? "⛽ Hay Gasolina" : "⚠️ Sin Combustible"}
              </button>
            </div>

            {/* Control 3: Fila de Vehículos */}
            <div className="control-card">
              <div className="card-header-flex">
                <span className="card-category">TRÁFICO EN PISTA</span>
                <span className="card-status-dot open">NIVEL {queueLevel}</span>
              </div>
              <h3>Nivel de Cola</h3>
              <select
                value={queueLevel}
                onChange={(e) => setQueueLevel(e.target.value as any)}
                className="queue-select"
              >
                <option value="BAJA">🟢 Fila Baja (Pocos autos)</option>
                <option value="MEDIA">🟡 Fila Moderada</option>
                <option value="ALTA">🔴 Fila Alta (Congestionado)</option>
              </select>
            </div>
          </div>

          <div className="save-action-container">
            <button onClick={handleSaveChanges} className="modify-save-btn">
              💾 Guardar y Publicar Estado
            </button>
          </div>
        </section>

        {/* SECCIÓN DE NOVEDADES */}
        <section className="workers-card">
          <h2 className="section-title">💬 Publicar Novedad o Reporte</h2>
          <form onSubmit={handleAddComment} style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
            <input
              type="text"
              placeholder="Ej. Llega cisterna en 15 minutos / Atención fluida..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="queue-select"
              style={{ flex: 1 }}
              required
            />
            <button type="submit" className="modify-save-btn" style={{ padding: "10px 20px" }}>
              Publicar
            </button>
          </form>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {commentsList.length === 0 ? (
              <p className="no-workers">No hay reportes recientes.</p>
            ) : (
              commentsList.map((c, idx) => (
                <div key={c.id || idx} style={{ padding: "10px 14px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <strong style={{ fontSize: "0.85rem", color: "#059669" }}>{c.userName}</strong>
                    <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{c.timestamp}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.88rem", color: "#334155" }}>{c.text}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}