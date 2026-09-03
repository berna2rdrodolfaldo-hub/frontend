
import Sidebar from "../components/Sidebar";
import { stations } from "../data/stations";
import "./StatisticsPage.css";

function StatisticsPage() {

  const total = stations.length;

  const open = stations.filter(
    (station) => station.open
  ).length;

  const closed = total - open;

  const fuel = stations.filter(
    (station) => station.fuel
  ).length;

  const noFuel = total - fuel;

  const totalQueue = stations.reduce(
    (sum, station) => sum + station.queue,
    0
  );

  const averageQueue =
    total > 0
      ? (totalQueue / total).toFixed(1)
      : "0";

  const maxQueue =
    Math.max(
      ...stations.map((station) => station.queue)
    );

  return (
    <div className="statistics-page">

      <Sidebar />

      <main className="statistics-content">

        <header className="page-header">

          <span>ESTADÍSTICAS</span>

          <h1>
            Estadísticas de los surtidores
          </h1>

          <p>
            Resumen general del estado de las estaciones.
          </p>

        </header>


        <section className="statistics-cards">

          <div>
            <small>Total de surtidores</small>
            <strong>{total}</strong>
          </div>

          <div>
            <small>Abiertos</small>
            <strong>{open}</strong>
          </div>

          <div>
            <small>Con combustible</small>
            <strong>{fuel}</strong>
          </div>

          <div>
            <small>Autos en cola</small>
            <strong>{totalQueue}</strong>
          </div>

        </section>


        <section className="statistics-grid">

          {/* ESTADO */}

          <div className="chart-card">

            <span>ESTADO</span>

            <h2>
              Estado de los surtidores
            </h2>

            <div className="bar-row">

              <div className="bar-label">
                <span>Abiertos</span>
                <strong>{open}</strong>
              </div>

              <div className="bar">
                <div
                  className="bar-fill open-bar"
                  style={{
                    width: `${(open / total) * 100}%`,
                  }}
                />
              </div>

            </div>


            <div className="bar-row">

              <div className="bar-label">
                <span>Cerrados</span>
                <strong>{closed}</strong>
              </div>

              <div className="bar">
                <div
                  className="bar-fill closed-bar"
                  style={{
                    width: `${(closed / total) * 100}%`,
                  }}
                />
              </div>

            </div>

          </div>


          {/* COMBUSTIBLE */}

          <div className="chart-card">

            <span>COMBUSTIBLE</span>

            <h2>
              Disponibilidad
            </h2>

            <div className="bar-row">

              <div className="bar-label">
                <span>Disponible</span>
                <strong>{fuel}</strong>
              </div>

              <div className="bar">
                <div
                  className="bar-fill fuel-bar"
                  style={{
                    width: `${(fuel / total) * 100}%`,
                  }}
                />
              </div>

            </div>


            <div className="bar-row">

              <div className="bar-label">
                <span>No disponible</span>
                <strong>{noFuel}</strong>
              </div>

              <div className="bar">
                <div
                  className="bar-fill no-fuel-bar"
                  style={{
                    width: `${(noFuel / total) * 100}%`,
                  }}
                />
              </div>

            </div>

          </div>


          {/* COLAS */}

          <div className="chart-card queue-card">

            <span>TRÁFICO</span>

            <h2>
              Autos en cola
            </h2>

            <div className="average">

              <strong>
                {averageQueue}
              </strong>

              <span>
                promedio de autos
              </span>

            </div>


            {stations.map((station) => (

              <div
                className="queue-row"
                key={station.id}
              >

                <span>
                  {station.name}
                </span>

                <strong>
                  {station.queue}
                </strong>

              </div>

            ))}

          </div>


          {/* MAYOR COLA */}

          <div className="highlight-card">

            <span>⚠ MAYOR COLA</span>

            <strong>
              {maxQueue}
            </strong>

            <p>
              Autos en espera en el surtidor
              con mayor demanda.
            </p>

          </div>

        </section>

      </main>

    </div>
  );
}

export default StatisticsPage;

