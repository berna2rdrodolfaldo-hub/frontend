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

  // Obtenemos los estados de los combustibles de forma segura
  const fuels = (station as any)?.fuels || {
    especial: station.fuel ?? true,
    premium: station.fuel ?? true,
    diesel: station.fuel ?? true,
    gnv: station.fuel ?? true,
  };

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
          {/* Card 1: Inventario Independiente de Combustibles */}
          <div className="info-card" style={{ gridColumn: "span 1" }}>
            <span className="info-card-label">INVENTARIO DE COMBUSTIBLES</span>
            <h3 style={{ margin: "8px 0 12px 0", fontSize: "1rem" }}>Disponibilidad por Tipo</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem" }}>
                <span>Gasolina Especial:</span>
                <strong style={{ color: fuels.especial ? "#059669" : "#dc2626" }}>
                  {fuels.especial ? "🟢 Hay Stock" : "🔴 Agotado"}
                </strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem" }}>
                <span>Gasolina Premium:</span>
                <strong style={{ color: fuels.premium ? "#059669" : "#dc2626" }}>
                  {fuels.premium ? "🟢 Hay Stock" : "🔴 Agotado"}
                </strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem" }}>
                <span>Diésel:</span>
                <strong style={{ color: fuels.diesel ? "#059669" : "#dc2626" }}>
                  {fuels.diesel ? "🟢 Hay Stock" : "🔴 Agotado"}
                </strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem" }}>
                <span>GNV:</span>
                <strong style={{ color: fuels.gnv ? "#059669" : "#dc2626" }}>
                  {fuels.gnv ? "🟢 Hay Stock" : "🔴 Agotado"}
                </strong>
              </div>
            </div>
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
                <strong>{(station as any)?.prices?.especial || "Bs 3.74"}</strong>
              </div>
              <div>
                <span>Premium</span>
                <strong>{(station as any)?.prices?.premium || "Bs 4.79"}</strong>
              </div>
              <div>
                <span>Diésel</span>
                <strong>{(station as any)?.prices?.diesel || "Bs 3.72"}</strong>
              </div>
              <div>
                <span>GNV</span>
                <strong>{(station as any)?.prices?.gnv || "Bs 2.25"}</strong>
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