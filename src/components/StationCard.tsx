
import type { Station } from "../data/stations";
import "./StationCard.css";

interface StationCardProps {
  station: Station;
}

function StationCard({ station }: StationCardProps) {

  const queueClass =
    station.queue <= 5
      ? "queue-low"
      : station.queue <= 15
      ? "queue-medium"
      : "queue-high";

  return (
    <article className="station-card">

      <div className="station-image-wrapper">

        <img
          src={station.image}
          alt={station.name}
          className="station-image"
        />

        <span
          className={
            station.open
              ? "station-status open"
              : "station-status closed"
          }
        >
          <span></span>

          {station.open
            ? "ABIERTO"
            : "CERRADO"}
        </span>

      </div>


      <div className="station-content">

        <h3>{station.name}</h3>

        <span className="station-location">
          📍 {station.location}
        </span>


        <div className="prices">

          <div>
            <span>Gasolina Especial</span>
            <strong>
              Bs {station.special.toFixed(2)}
            </strong>
          </div>

          <div>
            <span>Gasolina Premium</span>
            <strong>
              Bs {station.premium.toFixed(2)}
            </strong>
          </div>

          <div>
            <span>Diésel</span>
            <strong>
              Bs {station.diesel.toFixed(2)}
            </strong>
          </div>

        </div>


        <div className="station-details">

          <div className="detail">

            <span>🚗</span>

            <div>
              <small>Cola</small>

              <strong className={queueClass}>
                {station.queue} autos
              </strong>
            </div>

          </div>


          <div className="detail">

            <span>⛽</span>

            <div>
              <small>Combustible</small>

              <strong
                className={
                  station.fuel
                    ? "fuel-available"
                    : "fuel-unavailable"
                }
              >
                {station.fuel
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

