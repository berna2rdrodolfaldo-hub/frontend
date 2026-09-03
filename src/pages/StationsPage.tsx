
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import StationCard from "../components/StationCard";
import { stations } from "../data/stations";
import "./StationsPage.css";

function StationsPage() {

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("todos");

  const filteredStations = stations.filter((station) => {

    const matchesSearch =
      station.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      station.location
        .toLowerCase()
        .includes(search.toLowerCase());

    if (filter === "abiertos") {
      return matchesSearch && station.open;
    }

    if (filter === "cerrados") {
      return matchesSearch && !station.open;
    }

    if (filter === "combustible") {
      return matchesSearch && station.fuel;
    }

    if (filter === "sin-combustible") {
      return matchesSearch && !station.fuel;
    }

    return matchesSearch;
  });

  return (
    <div className="stations-page">

      <Sidebar />

      <main className="stations-content">

        <header className="page-header">

          <span>SURTIDORES</span>

          <h1>
            Estaciones de servicio
          </h1>

          <p>
            Consulta precios, disponibilidad,
            estado y cantidad de autos.
          </p>

        </header>


        <section className="stations-controls">

          <div className="search-box">

            🔍

            <input
              type="text"
              placeholder="Buscar surtidor..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

          </div>


          <select
            value={filter}
            onChange={(event) =>
              setFilter(event.target.value)
            }
          >

            <option value="todos">
              Todos
            </option>

            <option value="abiertos">
              Abiertos
            </option>

            <option value="cerrados">
              Cerrados
            </option>

            <option value="combustible">
              Con combustible
            </option>

            <option value="sin-combustible">
              Sin combustible
            </option>

          </select>

        </section>


        <section className="stations-results">

          <div className="results-heading">

            <h2>
              {filteredStations.length} surtidores
            </h2>

          </div>


          <div className="stations-grid">

            {filteredStations.map((station) => (

              <StationCard
                key={station.id}
                station={station}
              />

            ))}

          </div>


          {filteredStations.length === 0 && (

            <div className="no-results">

              <span>🔎</span>

              <h3>
                No encontramos surtidores
              </h3>

              <p>
                Prueba con otro nombre o filtro.
              </p>

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default StationsPage;

