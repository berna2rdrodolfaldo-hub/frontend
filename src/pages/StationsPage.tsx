import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import StationCard from "../components/StationCard";
import { stations as initialStations } from "../data/stations";
import "./StationsPage.css";

function StationsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("todos");

  // Cargar datos garantizando la migración a los surtidores reales de Sucre
  const [stations, setStations] = useState(() => {
    try {
      const saved = localStorage.getItem("sas_stations");
      if (saved) {
        const parsed = JSON.parse(saved);

        // Detecta si en el navegador persiste la lista desactualizada
        const hasLegacyData = parsed.some((s: any) => 
          s.name === "Surtidor Central" || s.name === "Surtidor Norte"
        );

        if (hasLegacyData) {
          // Limpia los datos desactualizados y carga los surtidores reales de Sucre
          localStorage.setItem("sas_stations", JSON.stringify(initialStations));
          return initialStations;
        }

        return parsed;
      }
    } catch (e) {
      console.error("Error al recuperar datos de estaciones", e);
    }
    
    // Guardar por defecto si es la primera lectura
    localStorage.setItem("sas_stations", JSON.stringify(initialStations));
    return initialStations;
  });

  // Escuchar cambios guardados desde el Panel Admin o en otras pestañas
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("sas_stations");
      if (saved) {
        setStations(JSON.parse(saved));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const filteredStations = stations.filter((station: any) => {
    const matchesSearch =
      station.name.toLowerCase().includes(search.toLowerCase()) ||
      station.location.toLowerCase().includes(search.toLowerCase());

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
          <h1>Estaciones de servicio</h1>
          <p>
            Consulta precios, disponibilidad, estado y cantidad de autos.
          </p>
        </header>

        <section className="stations-controls">
          <div className="search-box">
            🔍
            <input
              type="text"
              placeholder="Buscar surtidor..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="abiertos">Abiertos</option>
            <option value="cerrados">Cerrados</option>
            <option value="combustible">Con combustible</option>
            <option value="sin-combustible">Sin combustible</option>
          </select>
        </section>

        <section className="stations-results">
          <div className="results-heading">
            <h2>{filteredStations.length} surtidores</h2>
          </div>

          <div className="stations-grid">
            {filteredStations.map((station: any) => (
              <StationCard key={station.id} station={station} />
            ))}
          </div>

          {filteredStations.length === 0 && (
            <div className="no-results">
              <span>🔎</span>
              <h3>No encontramos surtidores</h3>
              <p>Prueba con otro nombre o filtro.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default StationsPage;