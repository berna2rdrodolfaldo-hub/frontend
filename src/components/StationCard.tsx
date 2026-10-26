import { Link } from "react-router-dom";
import "./StationCard.css";

interface StationCardProps {
  station: any;
}

function StationCard({ station }: StationCardProps) {

  const getPrice = (val: any, fallback: string) => {
    if (val === undefined || val === null) return fallback;
    if (typeof val === "number") return `Bs ${val.toFixed(2)}`;
    if (typeof val === "string" && val.includes("Bs")) return val;
    return `Bs ${val}`;
  };

  const specialPrice = getPrice(station?.prices?.especial ?? station?.special, "Bs 3.74");
  const premiumPrice = getPrice(station?.prices?.premium ?? station?.premium, "Bs 4.79");
  const dieselPrice = getPrice(station?.prices?.diesel ?? station?.diesel, "Bs 3.72");

  const queueCount = station?.queue ?? 0;

  const queueClass =
    queueCount <= 5
      ? "queue-low"
      : queueCount <= 15
      ? "queue-medium"
      : "queue-high";

  const fallbackImg =
    "https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=600&q=80";

  // Obtenemos los estados de los combustibles de forma segura con respaldo
  const fuels = station?.fuels || {
    especial: station?.fuel ?? true,
    premium: station?.fuel ?? true,
    diesel: station?.fuel ?? true,
    gnv: station?.fuel ?? true,
  };

  return (
    <Link 
      to={`/surtidores/${station?.id}`} 
      style={{ textDecoration: "none", color: "inherit", display: "block" }}
    >
      <article className="station-card" style={{ cursor: "pointer" }}>

        <div className="station-image-wrapper">
          <img
            src={station?.image || fallbackImg}
            alt={station?.name || "Surtidor"}
            className="station-image"
          />

          <span
            className={
              station?.open
                ? "station-status open"
                : "station-status closed"
            }
          >
            <span></span>
            {station?.open ? "ABIERTO" : "CERRADO"}
          </span>
        </div>

        <div className="station-content">
          <h3>{station?.name || "Surtidor"}</h3>

          <span className="station-location">
            📍 {station?.location || "Ubicación no especificada"}
          </span>

          <div className="prices">
            <div>
              <span>Gasolina Especial</span>
              <strong>{specialPrice}</strong>
            </div>

            <div>
              <span>Gasolina Premium</span>
              <strong>{premiumPrice}</strong>
            </div>

            <div>
              <span>Diésel</span>
              <strong>{dieselPrice}</strong>
            </div>
          </div>

          {/* 📍 Desglose de Disponibilidad por Combustible */}
          <div style={{ margin: "12px 0", display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.8rem" }}>
            <span style={{ fontWeight: "bold", color: "#64748b" }}>Disponibilidad:</span>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
              <span style={{ color: fuels.especial ? "#059669" : "#dc2626" }}>
                {fuels.especial ? "🟢 Esp: Hay" : "🔴 Esp: Agotado"}
              </span>
              <span style={{ color: fuels.premium ? "#059669" : "#dc2626" }}>
                {fuels.premium ? "🟢 Prem: Hay" : "🔴 Prem: Agotado"}
              </span>
              <span style={{ color: fuels.diesel ? "#059669" : "#dc2626" }}>
                {fuels.diesel ? "🟢 Diésel: Hay" : "🔴 Diésel: Agotado"}
              </span>
              <span style={{ color: fuels.gnv ? "#059669" : "#dc2626" }}>
                {fuels.gnv ? "🟢 GNV: Hay" : "🔴 GNV: Agotado"}
              </span>
            </div>
          </div>

          <div className="station-details">
            <div className="detail">
              <span>🚗</span>
              <div>
                <small>Cola</small>
                <strong className={queueClass}>
                  {queueCount} autos
                </strong>
              </div>
            </div>
          </div>

        </div>

      </article>
    </Link>
  );
}

export default StationCard;