import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authRepository } from "../../../repositories/authRepository";
import { stations as initialStations } from "../../../data/stations";
import Sidebar from "../../../components/Sidebar";
import "./AdminPage.css";

function AdminPage() {
  const navigate = useNavigate();
  const user = authRepository.getCurrentUser();

  // Validar si el usuario tiene rol de Administrador
  const currentUser = user as any;
  const isAdmin = currentUser?.role === "ADMIN" || currentUser?.role === "ADMINISTRADOR";

  // Redirigir de inmediato si no es Administrador
  useEffect(() => {
    if (!isAdmin) {
      navigate("/", { replace: true });
    }
  }, [isAdmin, navigate]);

  // Cargar lista completa de estaciones desde localStorage o los datos por defecto
  const [stations, setStations] = useState(() => {
    const saved = localStorage.getItem("sas_stations");
    return saved ? JSON.parse(saved) : initialStations;
  });

  // Determinar qué surtidor le corresponde al administrador según su nombre/usuario
  const userName = (currentUser?.name || currentUser?.username || "").toLowerCase();

  // Si el usuario contiene "este", asigna el del Este; de lo contrario, por defecto el del Oeste
  const targetIndex = stations.findIndex((s: any) => {
    if (userName.includes("este")) {
      return s.name?.toLowerCase().includes("este");
    }
    return s.name?.toLowerCase().includes("oeste");
  });

  // Índice final asegurado (si no encuentra por nombre, toma la primera estación)
  const finalIndex = targetIndex !== -1 ? targetIndex : 0;
  const myStation = stations[finalIndex];

  // Estados locales para el formulario del surtidor asignado
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [hasFuel, setHasFuel] = useState<boolean>(true);
  const [queueCount, setQueueCount] = useState<number>(0);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Cargar los valores de la estación asignada en los estados del formulario
  useEffect(() => {
    if (myStation) {
      setIsOpen(myStation.open ?? true);
      setHasFuel(myStation.fuel ?? true);
      setQueueCount(myStation.queue ?? 0);
    }
  }, [myStation?.id]);

  // Guardar cambios en localStorage
  const handleSaveStation = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedStations = [...stations];
    updatedStations[finalIndex] = {
      ...updatedStations[finalIndex],
      open: isOpen,
      fuel: hasFuel,
      queue: Number(queueCount),
    };

    setStations(updatedStations);
    localStorage.setItem("sas_stations", JSON.stringify(updatedStations));

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <span className="header-label">MÓDULO EXCLUSIVO</span>
            <h1>Panel de Administrador</h1>
            <p>Gestiona el estado de tu surtidor en tiempo real.</p>
          </div>

          <button
            className="back-btn"
            onClick={() => navigate("/")}
            type="button"
          >
            ← Volver al inicio
          </button>
        </header>

        {/* SECCIÓN DE EDICIÓN DEL SURTIDOR ASIGNADO */}
        <section className="admin-profile-card" style={{ marginBottom: "25px" }}>
          <div className="profile-badge">
            <span className="crown-large">⛽</span>
            <div>
              <h2>Control del Surtidor: {myStation?.name || "Surtidor Asignado"}</h2>
              <span className="role-tag">SURTIDOR ASIGNADO</span>
            </div>
          </div>

          {savedSuccess && (
            <div
              style={{
                backgroundColor: "#d1fae5",
                color: "#065f46",
                padding: "10px 15px",
                borderRadius: "8px",
                marginBottom: "15px",
                fontWeight: "bold",
                fontSize: "0.9rem",
              }}
            >
              ✅ ¡Estado de {myStation?.name} actualizado correctamente!
            </div>
          )}

          <form onSubmit={handleSaveStation} style={{ display: "grid", gap: "15px", marginTop: "15px" }}>
            {/* ESTADO ABIERTO / CERRADO */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f9fafb", padding: "12px", borderRadius: "8px" }}>
              <label style={{ fontWeight: "600", color: "#374151" }}>Estado del surtidor:</label>
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                style={{
                  backgroundColor: isOpen ? "#10b981" : "#ef4444",
                  color: "#fff",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                {isOpen ? "🟢 ABIERTO" : "🔴 CERRADO"}
              </button>
            </div>

            {/* DISPONIBILIDAD DE COMBUSTIBLE */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f9fafb", padding: "12px", borderRadius: "8px" }}>
              <label style={{ fontWeight: "600", color: "#374151" }}>¿Tiene combustible?:</label>
              <button
                type="button"
                onClick={() => setHasFuel(!hasFuel)}
                style={{
                  backgroundColor: hasFuel ? "#3b82f6" : "#f59e0b",
                  color: "#fff",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                {hasFuel ? "💧 CON GASOLINA" : "⚠️ SIN GASOLINA"}
              </button>
            </div>

            {/* AUTOS EN COLA */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f9fafb", padding: "12px", borderRadius: "8px" }}>
              <label style={{ fontWeight: "600", color: "#374151" }}>Autos en fila/cola:</label>
              <input
                type="number"
                min="0"
                value={queueCount}
                onChange={(e) => setQueueCount(Math.max(0, parseInt(e.target.value) || 0))}
                style={{
                  width: "90px",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  textAlign: "center",
                  fontSize: "1rem",
                  fontWeight: "bold",
                }}
              />
            </div>

            <button
              type="submit"
              className="admin-action-btn"
              style={{
                padding: "12px",
                fontSize: "1rem",
                marginTop: "10px",
                width: "100%",
              }}
            >
              💾 Guardar Cambios de {myStation?.name}
            </button>
          </form>
        </section>

        {/* Info del Administrador */}
        <section className="admin-profile-card">
          <div className="profile-badge">
            <span className="crown-large">👑</span>
            <div>
              <h2>{user?.name || "Administrador"}</h2>
              <span className="role-tag">{user?.role || "ADMINISTRADOR"}</span>
            </div>
          </div>
          <p className="profile-desc">
            Tienes permisos para gestionar exclusivamente la información y estado de tu estación asignada.
          </p>
        </section>

        <footer className="dashboard-footer">
          <strong>SAS</strong>
          <span>Sistema de Administración de Surtidores</span>
        </footer>
      </main>
    </div>
  );
}

export default AdminPage;