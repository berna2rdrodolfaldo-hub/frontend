
import { useNavigate } from "react-router-dom";
import { authRepository } from "../repositories/authRepository";
import { stations } from "../data/stations";
import Sidebar from "../components/Sidebar";
import StationCard from "../components/StationCard";
import "./HomePage.css";

function HomePage() {

  const navigate = useNavigate();

  const user = authRepository.getCurrentUser();

  const totalStations = stations.length;

  const openStations =
    stations.filter((station) => station.open).length;

  const availableFuel =
    stations.filter((station) => station.fuel).length;

  const totalQueue =
    stations.reduce(
      (total, station) => total + station.queue,
      0
    );

  return (
    <div className="dashboard">

      <Sidebar />


      <main className="dashboard-content">

        <header className="dashboard-header">

          <div>

            <span className="header-label">
              PANEL PRINCIPAL
            </span>

            <h1>
              Bienvenido{user ? `, ${user.name}` : ""}
            </h1>

            <p>
              Consulta rápidamente el estado
              de los surtidores.
            </p>

          </div>


          <div className="header-status">

            <span className="online-dot"></span>

            Sistema operativo

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

            <button
              onClick={() => navigate("/surtidores")}
            >
              ⛽ Ver surtidores
            </button>

            <button
              onClick={() => navigate("/estadisticas")}
            >
              📊 Ver estadísticas
            </button>

            <button
              onClick={() => navigate("/informacion")}
            >
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

            {stations.slice(0, 3).map((station) => (
              <StationCard
                key={station.id}
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

