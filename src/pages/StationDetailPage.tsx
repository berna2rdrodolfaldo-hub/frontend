import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { stations as initialStations, type Station } from "../data/stations";
import "./StationDetailPage.css";

function StationDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [station, setStation] = useState<Station | null>(() => {
    try {
      const saved = localStorage.getItem("sas_stations");
      const list: Station[] = saved ? JSON.parse(saved) : initialStations;
      return list.find((s) => String(s.id) === String(id)) || null;
    } catch {
      return initialStations.find((s) => String(s.id) === String(id)) || null;
    }
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("sas_stations");
      if (saved) {
        const list: Station[] = JSON.parse(saved);
        const match = list.find((s) => String(s.id) === String(id));
        if (match) setStation(match);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [id]);

  if (!station) {
    return (
      <div className="station-detail-layout">
        <Sidebar />
        <main className="station-detail-content">
          <div className="not-found-card">
            <h2>Surtidor no encontrado</h2>
            <Link to="/surtidores" className="back-btn">← Volver a Surtidores</Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="station-detail-layout">
      <Sidebar />

      <main className="station-detail-content">
        <Link to="/surtidores" className="back-btn">
          ← Volver al catálogo de surtidores
        </Link>

        {/* HERO Y FOTO OFICIAL */}
        <div className="station-hero-card">
          <img src={station.image} alt={station.name} className="station-hero-image" />
          <div className="station-hero-overlay">
            <span className={`status-badge ${station.open ? "badge-open" : "badge-closed"}`}>
              {station.open ? "● ABIERTO" : "● CERRADO"}
            </span>
            <h1 className="station-hero-title">{station.name}</h1>
            <p className="station-hero-location">📍 {station.location}</p>
          </div>
        </div>

        {/* INFORMACIÓN EN TIEMPO REAL */}
        <div className="station-info-grid">
          {/* Card 1: Estado del Combustible */}
          <div className="info-card">
            <span className="info-card-label">COMBUSTIBLE</span>
            <h3>{station.fuel ? "⛽ Hay Gasolina Disponible" : "⚠️ Sin Combustible"}</h3>
            <p className="info-card-sub">
              {station.fuel ? "Abastecimiento regular para vehículos" : "Cisterna en camino o agotado"}
            </p>
          </div>

          {/* Card 2: Fila de Vehículos */}
          <div className="info-card">
            <span className="info-card-label">TRÁFICO EN COLA</span>
            <h3>🚗 {station.queue} Vehículos en Fila</h3>
            <p className="info-card-sub">
              {station.queue <= 8 ? "Fila Fluida / Corta" : station.queue <= 20 ? "Fila Moderada" : "Fila Larga / Congestionado"}
            </p>
          </div>

          {/* Card 3: Tarifas de Combustibles */}
          <div className="info-card prices-card">
            <span className="info-card-label">TARIFAS OFICIALES</span>
            <div className="prices-grid">
              <div>
                <span>Especial</span>
                <strong>{station.prices?.especial || "Bs 3.74"}</strong>
              </div>
              <div>
                <span>Premium</span>
                <strong>{station.prices?.premium || "Bs 4.79"}</strong>
              </div>
              <div>
                <span>Diésel</span>
                <strong>{station.prices?.diesel || "Bs 3.72"}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* REPORTES Y NOVEDADES */}
        <div className="station-comments-section">
          <h2>💬 Novedades y Comentarios Oficiales</h2>
          {(!station.comments || station.comments.length === 0) ? (
            <p className="no-comments">No hay reportes recientes registrados para este surtidor.</p>
          ) : (
            <div className="comments-list">
              {station.comments.map((c, idx) => (
                <div key={c.id || idx} className="comment-item">
                  <div className="comment-header">
                    <strong>{c.userName}</strong>
                    <span>{c.timestamp}</span>
                  </div>
                  <p>{c.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default StationDetailPage;