import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import StationCard from "../components/StationCard";
import { stations as initialStations } from "../data/stations";
import "./StationsPage.css";

function StationsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("todos");

  const getSafeStationsList = (incomingList: any[]) => {
    if (!Array.isArray(incomingList) || incomingList.length === 0) {
      return initialStations;
    }
    if (incomingList.length < initialStations.length) {
      return initialStations.map((initS: any) => {
        const found = incomingList.find((p: any) => String(p.id) === String(initS.id));
        return found || initS;
      });
    }
    return incomingList;
  };

  const [stations, setStations] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("sas_stations");
      if (saved) {
        const parsed = JSON.parse(saved);
        return getSafeStationsList(parsed);
      }
    } catch (e) {
      console.error(e);
    }
    return initialStations;
  });

  useEffect(() => {
    const fetchStationsFromCloud = async () => {
      try {
        const response = await fetch(`https://frontend-9rgm.onrender.com/api/stations?t=${Date.now()}`);
        if (response.ok) {
          const cloudStations = await response.json();
          const safeCloudList = getSafeStationsList(cloudStations);
          setStations(safeCloudList);
          localStorage.setItem("sas_stations", JSON.stringify(safeCloudList));
          return;
        }
      } catch (error) {
        console.warn("No se pudo conectar al servidor de Render, usando respaldo local:", error);
      }

      try {
        const saved = localStorage.getItem("sas_stations");
        if (saved) {
          const parsed = JSON.parse(saved);
          const safeList = getSafeStationsList(parsed);
          setStations(safeList);
          localStorage.setItem("sas_stations", JSON.stringify(safeList));
        } else {
          localStorage.setItem("sas_stations", JSON.stringify(initialStations));
          setStations(initialStations);
        }
      } catch (e) {
        console.error("Error al recuperar datos locales", e);
        setStations(initialStations);
      }
    };

    fetchStationsFromCloud();
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("sas_stations");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setStations(getSafeStationsList(parsed));
        } catch (e) {
          console.error(e);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const filteredStations = stations.filter((station: any) => {
    const matchesSearch =
      station.name.toLowerCase().includes(search.toLowerCase()) ||
      station.location.toLowerCase().includes(search.toLowerCase());

    if (filter === "abiertos") return matchesSearch && station.open;
    if (filter === "cerrados") return matchesSearch && !station.open;
    if (filter === "combustible") return matchesSearch && station.fuel;
    if (filter === "sin-combustible") return matchesSearch && !station.fuel;

    return matchesSearch;
  });

  return (
    <div className="stations-page" style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <main className="stations-content" style={{ marginLeft: "260px", padding: "20px", flex: 1, minWidth: 0 }}>
        <header className="page-header">
          <span>SURTIDORES</span>
          <h1>Estaciones de servicio</h1>
          <p>Consulta precios, disponibilidad, estado y cantidad de autos.</p>
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

          <select value={filter} onChange={(event) => setFilter(event.target.value)}>
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
