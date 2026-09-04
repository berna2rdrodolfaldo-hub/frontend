import "./StationCard.css";
interface StationCardProps {
  station: any; // Mantenemos 'any' para evitar conflictos si faltan propiedades en localStorage
}

function StationCard({ station }: StationCardProps) {

  // Obtener precios de forma segura independientemente de si vienen como objeto o propiedades sueltas
  const getPrice = (val: any, fallback: string) => {
    if (val === undefined || val === null) return fallback;
    if (typeof val === "number") return `Bs ${val.toFixed(2)}`;
    if (typeof val === "string" && val.includes("Bs")) return val;
    return `Bs ${val}`;
  };

  const specialPrice = getPrice(station?.prices?.especial ?? station?.special, "Bs 6.74");
  const premiumPrice = getPrice(station?.prices?.premium ?? station?.premium, "Bs 7.18");
  const dieselPrice = getPrice(station?.prices?.diesel ?? station?.diesel, "Bs 6.96");

  const queueCount = station?.queue ?? 0;

  const queueClass =
    queueCount <= 5
      ? "queue-low"
      : queueCount <= 15
      ? "queue-medium"
      : "queue-high";

  const fallbackImg =
    "https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=600&q=80";

  return (
    <article className="station-card">

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

          {station?.open
            ? "ABIERTO"
            : "CERRADO"}
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
            <strong>
              {specialPrice}
            </strong>
          </div>

          <div>
            <span>Gasolina Premium</span>
            <strong>
              {premiumPrice}
            </strong>
          </div>

          <div>
            <span>Diésel</span>
            <strong>
              {dieselPrice}
            </strong>
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


          <div className="detail">

            <span>⛽</span>

            <div>
              <small>Combustible</small>

              <strong
                className={
                  station?.fuel
                    ? "fuel-available"
                    : "fuel-unavailable"
                }
              >
                {station?.fuel
                  ? "Disponible"
                  : "No disponible"}
              </strong>
            </div>

          </div>

        </div>

      </div>

    </article>
  );
}

export default StationCard;