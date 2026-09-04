import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authRepository } from "../repositories/authRepository";
import { stations as initialStations } from "../data/stations";
import Sidebar from "../components/Sidebar";
import StationCard from "../components/StationCard";
import "./HomePage.css";

function HomePage() {
  const navigate = useNavigate();
  const user = authRepository.getCurrentUser();

  // Estado reactivo cargado con seguridad desde localStorage
  const [stations, setStations] = useState(() => {
    try {
      const saved = localStorage.getItem("sas_stations");
      if (!saved) return initialStations;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialStations;
    } catch (e) {
      return initialStations;
    }
  });

  // Escuchar actualizaciones en vivo desde el Admin o entre pestañas
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem("sas_stations");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setStations(parsed);
        }
      } catch (e) {
        setStations(initialStations);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Verificar si el usuario actual es Administrador
  const currentUser = user as any;
  const isAdmin = currentUser?.role === "ADMIN" || currentUser?.role === "ADMINISTRADOR";

  // Cálculos reactivos seguros
  const safeStations = Array.isArray(stations) ? stations : initialStations;
  const totalStations = safeStations.length;

  const openStations = safeStations.filter(
    (station: any) => station?.open
  ).length;

  const availableFuel = safeStations.filter(
    (station: any) => station?.fuel
  ).length;

  const totalQueue = safeStations.reduce(
    (total: number, station: any) => total + (station?.queue || 0),
    0
  );

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="dashboard-content" style={{ position: "relative" }}>
        
        {/* BOTÓN SOLO CON CORONA EN LA ESQUINA SUPERIOR DERECHA */}
        {isAdmin && (
          <button
            onClick={() => navigate("/admin")}
            style={{
              position: "absolute",
              top: "20px",
              right: "25px",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              border: "1px solid rgba(255, 255, 255, 0.4)",
              borderRadius: "50%",
              width: "42px",
              height: "42px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.3rem",
              cursor: "pointer",
              backdropFilter: "blur(4px)",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              zIndex: 10,
              transition: "transform 0.2s ease, background-color 0.2s ease"
            }}
            title="Ir al Panel de Administración"
          >
            👑
          </button>
        )}

        <header className="dashboard-header">
          <div>
            <span className="header-label">
              PANEL PRINCIPAL
            </span>

            <h1>
              Bienvenido{user?.name ? `, ${user.name}` : ""}
            </h1>

            <p>
              Consulta rápidamente el estado
              de los surtidores.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="header-status">
              <span className="online-dot"></span>
              Sistema operativo
            </div>
          </div>
        </header>

        {/* ESTADÍSTICAS */}
        <section className="statistics">
          <div className="stat-card">
            <span className="stat-icon">⛽</span>
            <div>
              <small>Surtidores</small>
              <strong>{totalStations}</strong>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">🚗</span>
            <div>
              <small>Autos en cola</small>
              <strong>{totalQueue}</strong>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">💧</span>
            <div>
              <small>Con combustible</small>
              <strong>{availableFuel}</strong>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">🟢</span>
            <div>
              <small>Abiertos</small>
              <strong>{openStations}</strong>
            </div>
          </div>
        </section>

        {/* RESUMEN */}
        <section className="home-grid">
          <div className="summary-card">
            <span className="section-label">
              ESTADO GENERAL
            </span>

            <h2>
              Estado de las estaciones
            </h2>

            <div className="summary-list">
              <div>
                <span>🟢 Surtidores abiertos</span>
                <strong>{openStations}</strong>
              </div>

              <div>
                <span>🔴 Surtidores cerrados</span>
                <strong>
                  {totalStations - openStations}
                </strong>
              </div>

              <div>
                <span>⛽ Con combustible</span>
                <strong>{availableFuel}</strong>
              </div>

              <div>
                <span>⚠ Sin combustible</span>
                <strong>
                  {totalStations - availableFuel}
                </strong>
              </div>
            </div>
          </div>

          <div className="quick-card">
            <span className="section-label">
              ACCESO RÁPIDO
            </span>

            <h2>
              ¿Qué deseas consultar?
            </h2>

            <button onClick={() => navigate("/surtidores")}>
              ⛽ Ver surtidores
            </button>

            <button onClick={() => navigate("/estadisticas")}>
              📊 Ver estadísticas
            </button>

            <button onClick={() => navigate("/informacion")}>
              ℹ️ Información del sistema
            </button>
          </div>
        </section>

        {/* SURTIDORES DESTACADOS */}
        <section className="featured-section">
          <div className="section-heading">
            <div>
              <span className="section-label">
                VISTA RÁPIDA
              </span>

              <h2>
                Surtidores destacados
              </h2>
            </div>

            <button
              className="view-all"
              onClick={() => navigate("/surtidores")}
            >
              Ver todos →
            </button>
          </div>

          <div className="featured-grid">
            {safeStations.slice(0, 3).map((station: any) => (
              <StationCard
                key={station?.id || Math.random()}
                station={station}
              />
            ))}
          </div>
        </section>

        <footer className="dashboard-footer">
          <strong>SAS</strong>
          <span>
            Sistema de Administración de Surtidores
          </span>
        </footer>
      </main>
    </div>
  );
}

export default HomePage;