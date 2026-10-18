import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import { authRepository } from "../../../repositories/authRepository";
import { stations } from "../../../data/stations";
import type { UserRecord } from "../../../types/auth";
import "./AdminPage.css";

function AdminPage() {
  const currentUser: any = authRepository.getCurrentUser();
  const [activeTab, setActiveTab] = useState<"surtidor" | "trabajadores">("surtidor");
  const [workers, setWorkers] = useState<UserRecord[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Verificación del rol del Desarrollador
  const rawRole = currentUser?.role || currentUser?.rol || "";
  const role = String(rawRole).toUpperCase().trim();
  const isDev = role === "DEVELOPER" || role === "DEV";

  // Obtener el surtidor asignado
  const assignedStationIndex = stations.findIndex(
    (s: any) => String(s.id) === String(currentUser?.assignedStationId)
  );
  const targetIndex = assignedStationIndex !== -1 ? assignedStationIndex : 0;
  const assignedStation = stations[targetIndex];

  // Cargar estado inicial (priorizando localStorage si ya existía un cambio guardado)
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

  // Estados interactivos locales compatibles con open, fuel y queue
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    if (initialData?.open !== undefined) return Boolean(initialData.open);
    if (initialData?.isOpen !== undefined) return Boolean(initialData.isOpen);
    if (initialData?.status !== undefined) return initialData.status === "Abierto";
    return true;
  });

  const [hasFuel, setHasFuel] = useState<boolean>(() => {
    if (initialData?.fuel !== undefined) return Boolean(initialData.fuel);
    if (initialData?.hasFuel !== undefined) return Boolean(initialData.hasFuel);
    return true;
  });

  const [queueLevel, setQueueLevel] = useState<"BAJA" | "MEDIA" | "ALTA">(() => {
    if (initialData?.queueLevel) return initialData.queueLevel;
    if (initialData?.queue !== undefined) {
      if (initialData.queue <= 8) return "BAJA";
      if (initialData.queue <= 20) return "MEDIA";
      return "ALTA";
    }
    return "MEDIA";
  });

  const loadWorkers = () => {
    const repo = authRepository as any;
    if (typeof repo.getAllUsers === "function") {
      const allUsers: UserRecord[] = repo.getAllUsers();
      const userList = allUsers.filter((u) => u.role === "USUARIO");
      setWorkers(userList);
    }
  };

  useEffect(() => {
    loadWorkers();
  }, []);

  // Guardar y sincronizar con las propiedades exactas que leen HomePage y StationsPage
  const handleSaveChanges = () => {
    if (assignedStation) {
      // Determinar la cantidad numérica de autos para la cola
      let queueCount = 15;
      if (queueLevel === "BAJA") queueCount = 5;
      if (queueLevel === "MEDIA") queueCount = 15;
      if (queueLevel === "ALTA") queueCount = 30;

      // 1. Modificar el objeto en memoria
      (assignedStation as any).open = isOpen;
      (assignedStation as any).isOpen = isOpen;
      (assignedStation as any).status = isOpen ? "Abierto" : "Cerrado";
      (assignedStation as any).fuel = hasFuel;
      (assignedStation as any).hasFuel = hasFuel;
      (assignedStation as any).queue = queueCount;
      (assignedStation as any).queueLevel = queueLevel;

      // 2. Persistir en localStorage
      try {
        const storedStations = localStorage.getItem("sas_stations");
        let list = storedStations ? JSON.parse(storedStations) : [...stations];
        const idx = list.findIndex((s: any) => String(s.id) === String(assignedStation.id));

        const updatedData = {
          ...assignedStation,
          open: isOpen,
          isOpen: isOpen,
          status: isOpen ? "Abierto" : "Cerrado",
          fuel: hasFuel,
          hasFuel: hasFuel,
          queue: queueCount,
          queueLevel: queueLevel
        };

        if (idx !== -1) {
          list[idx] = updatedData;
        } else {
          list.push(updatedData);
        }

        localStorage.setItem("sas_stations", JSON.stringify(list));
      } catch (e) {
        console.error("Error guardando en localStorage", e);
      }

      // 3. Forzar actualización inmediata en la ventana actual
      window.dispatchEvent(new Event("storage"));

      setSuccessMessage("¡Parámetros del surtidor modificados correctamente en todo el sistema!");
      setTimeout(() => setSuccessMessage(""), 4000);
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar />

      <main className="admin-main-content">
        
        {/* ENCABEZADO */}
        <header className="admin-header">
          <div className="admin-header-flex">
            <div>
              <span className="admin-header-tag">PANEL DE ADMINISTRACIÓN</span>
              <h1 className="admin-header-title">
                {assignedStation?.name || "Surtidor Asignado"} ⛽
              </h1>
              <p className="admin-header-desc">
                Bienvenido, <strong>{currentUser?.name || "Administrador"}</strong>. Ajusta los parámetros operativos y presiona modificar para publicar los cambios.
              </p>
            </div>

            {/* MÉTRICAS */}
            <div className="admin-metrics-group">
              <div className="admin-metric-card">
                <span className="admin-metric-label">OPERACIÓN</span>
                <strong className={isOpen ? "admin-metric-value-active" : "admin-metric-value-inactive"}>
                  {isOpen ? "ACTIVO" : "INACTIVO"}
                </strong>
              </div>
              <div className="admin-metric-card">
                <span className="admin-metric-label">PERSONAL</span>
                <strong className="admin-metric-value-active">{workers.length} Registrados</strong>
              </div>
            </div>
          </div>
        </header>

        {/* NOTIFICACIÓN */}
        {successMessage && (
          <div className="save-success-banner">
            ✅ {successMessage}
          </div>
        )}

        {/* BANNER DESARROLLADOR */}
        {isDev && (
          <div className="dev-banner">
            <div className="dev-banner-info">
              <div className="dev-banner-icon">🛠️</div>
              <div className="dev-banner-text">
                <h4>Módulo de Desarrollador</h4>
                <p>Acceso especial para gestión global de usuarios, contraseñas y rangos.</p>
              </div>
            </div>

            <Link to="/developer" className="dev-banner-btn">
              Ir a Gestión de Usuarios →
            </Link>
          </div>
        )}

        {/* PESTAÑAS */}
        <div className="admin-tabs">
          <button
            onClick={() => setActiveTab("surtidor")}
            className={`tab-btn ${activeTab === "surtidor" ? "active" : ""}`}
          >
            ⚙️ Control del Surtidor
          </button>
          <button
            onClick={() => setActiveTab("trabajadores")}
            className={`tab-btn ${activeTab === "trabajadores" ? "active" : ""}`}
          >
            👥 Personal Registrado ({workers.length})
          </button>
        </div>

        {/* TAB 1: CONTROLES */}
        {activeTab === "surtidor" && (
          <section>
            <h2 className="section-title">Parámetros Operativos</h2>

            <div className="control-cards-grid">
              
              {/* Card 1: Operatividad */}
              <div className="control-card">
                <div className="card-header-flex">
                  <span className="card-category">OPERATIVIDAD</span>
                  <span className={`card-status-dot ${isOpen ? "open" : "closed"}`}>
                    {isOpen ? "● ABIERTO" : "● CERRADO"}
                  </span>
                </div>
                <h3>Estado Operativo</h3>
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className={`action-toggle-btn ${isOpen ? "btn-open" : "btn-closed"}`}
                >
                  {isOpen ? "🟢 Surtidor Abierto" : "🔴 Surtidor Cerrado"}
                </button>
              </div>

              {/* Card 2: Gasolina */}
              <div className="control-card">
                <div className="card-header-flex">
                  <span className="card-category">INVENTARIO</span>
                  <span className={`card-status-dot ${hasFuel ? "open" : "warning"}`}>
                    {hasFuel ? "● DISPONIBLE" : "● AGOTADO"}
                  </span>
                </div>
                <h3>Disponibilidad de Gasolina</h3>
                <button
                  type="button"
                  onClick={() => setHasFuel(!hasFuel)}
                  className={`action-toggle-btn ${hasFuel ? "btn-fuel-on" : "btn-fuel-off"}`}
                >
                  {hasFuel ? "⛽ Hay Gasolina Disponible" : "⚠️ Sin Combustible"}
                </button>
              </div>

              {/* Card 3: Tráfico */}
              <div className="control-card">
                <div className="card-header-flex">
                  <span className="card-category">TRÁFICO</span>
                  <span className="card-status-dot open">NIVEL {queueLevel}</span>
                </div>
                <h3>Fila de Vehículos</h3>
                <select
                  value={queueLevel}
                  onChange={(e) => setQueueLevel(e.target.value as any)}
                  className="queue-select"
                >
                  <option value="BAJA">🟢 Fila Baja (Pocos vehículos)</option>
                  <option value="MEDIA">🟡 Fila Moderada</option>
                  <option value="ALTA">🔴 Fila Alta (Congestionado)</option>
                </select>
              </div>

            </div>

            {/* BOTÓN DE PUBLICAR Y MODIFICAR */}
            <div className="save-action-container">
              <button onClick={handleSaveChanges} className="modify-save-btn">
                💾 Modificar y Publicar Estado del Surtidor
              </button>
            </div>
          </section>
        )}

        {/* TAB 2: TRABAJADORES */}
        {activeTab === "trabajadores" && (
          <section className="workers-card">
            <h2 className="section-title">Personal Operativo Asignado</h2>
            <p className="workers-desc">
              Listado general de usuarios registrados con perfil estándar.
            </p>

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
                        No existen trabajadores registrados en el sistema.
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