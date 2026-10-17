import { useState, useEffect } from "react";
import { authRepository } from "../../../repositories/authRepository";
import { stations } from "../../../data/stations";
import Sidebar from "../../../components/Sidebar";
import type { UserRecord, UserRole } from "../../../types/auth";

function DeveloperPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [selectedStation, setSelectedStation] = useState<Record<string, string>>({});

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const repo = authRepository as any;
    if (typeof repo.getAllUsers === "function") {
      setUsers(repo.getAllUsers());
    } else if (typeof repo.getUsers === "function") {
      setUsers(repo.getUsers());
    }
  };

  const handleRoleChange = (userId: string, currentRole: UserRole) => {
    const repo = authRepository as any;
    if (currentRole === "ADMIN") {
      repo.updateUserRole(userId, "USUARIO");
    } else {
      const defaultStationId = stations[0]?.id ? String(stations[0].id) : "1";
      const stationId = selectedStation[userId] || defaultStationId;
      repo.updateUserRole(userId, "ADMIN", stationId);
    }
    loadUsers();
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <span className="header-label">MÓDULO EXCLUSIVO - DESARROLLADOR</span>
            <h1>Gestión Global de Usuarios y Rangos 👑</h1>
            <p>Concede o revoca el rango de Administrador a cualquier usuario del sistema.</p>
          </div>
        </header>

        <section className="admin-profile-card" style={{ marginTop: "20px" }}>
          <h2>Listado General de Usuarios</h2>
          <div style={{ overflowX: "auto", marginTop: "15px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                  <th style={{ padding: "10px" }}>Nombre</th>
                  <th style={{ padding: "10px" }}>Carnet</th>
                  <th style={{ padding: "10px" }}>Rol Actual</th>
                  <th style={{ padding: "10px" }}>Surtidor Asignado</th>
                  <th style={{ padding: "10px" }}>Acción de Rango</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "10px", fontWeight: "bold" }}>{u.name}</td>
                    <td style={{ padding: "10px" }}>{u.carnet}</td>
                    <td style={{ padding: "10px" }}>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "12px",
                          fontSize: "0.85rem",
                          fontWeight: "bold",
                          backgroundColor:
                            u.role === "DEVELOPER"
                              ? "#fef08a"
                              : u.role === "ADMIN"
                              ? "#d1fae5"
                              : "#e5e7eb",
                          color:
                            u.role === "DEVELOPER"
                              ? "#854d0e"
                              : u.role === "ADMIN"
                              ? "#065f46"
                              : "#374151",
                        }}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: "10px" }}>
                      {u.role === "USUARIO" ? (
                        <select
                          value={selectedStation[u.id] || (stations[0]?.id ? String(stations[0].id) : "1")}
                          onChange={(e) =>
                            setSelectedStation({ ...selectedStation, [u.id]: e.target.value })
                          }
                          style={{ padding: "5px", borderRadius: "6px" }}
                        >
                          {stations.map((s: any) => (
                            <option key={s.id} value={String(s.id)}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        u.assignedStationId || "-"
                      )}
                    </td>
                    <td style={{ padding: "10px" }}>
                      {u.role === "DEVELOPER" ? (
                        <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                          (Desarrollador Único)
                        </span>
                      ) : u.role === "ADMIN" ? (
                        <button
                          onClick={() => handleRoleChange(u.id, u.role)}
                          style={{
                            backgroundColor: "#ef4444",
                            color: "#fff",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: "bold",
                          }}
                        >
                          🔻 Revocar Rango (Hacer Usuario)
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRoleChange(u.id, u.role)}
                          style={{
                            backgroundColor: "#10b981",
                            color: "#fff",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: "bold",
                          }}
                        >
                          👑 Otorgar Rango (Hacer Admin)
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DeveloperPage;