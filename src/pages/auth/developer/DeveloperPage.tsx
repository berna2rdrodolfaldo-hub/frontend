import { useState, useEffect } from "react";
import { authRepository } from "../../../repositories/authRepository";
import { stations } from "../../../data/stations";
import Sidebar from "../../../components/Sidebar";
import type { UserRecord, UserRole } from "../../../types/auth";

function DeveloperPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [selectedStation, setSelectedStation] = useState<Record<string, string>>({});

  const [name, setName] = useState("");
  const [carnet, setCarnet] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("USUARIO");
  const [stationId, setStationId] = useState(stations[0]?.id ? String(stations[0].id) : "1");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
        localStorage.setItem("sas_users", JSON.stringify(data));
      } else {
        const repo = authRepository as any;
        setUsers(repo.getAllUsers());
      }
    } catch {
      const repo = authRepository as any;
      setUsers(repo.getAllUsers());
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !carnet || !password) {
      alert("Por favor completa todos los campos requeridos.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          carnet,
          password,
          role,
          assignedStationId: role === "ADMIN" ? stationId : undefined,
        }),
      });

      if (!response.ok) throw new Error("Error en el servidor");

      const createdUser = await response.json();
      const repo = authRepository as any;
      if (typeof repo.createUser === "function") {
        repo.createUser(createdUser);
      }

      setUsers((prev) => [...prev, createdUser]);

      setName("");
      setCarnet("");
      setPassword("");
      setRole("USUARIO");
      alert("¡Usuario guardado exitosamente!");
    } catch {
      alert("Asegúrate de ejecutar: node server.js");
    }
  };

  const handleRoleChange = (userId: string, currentRole: UserRole) => {
    const newRole: UserRole = currentRole === "ADMIN" ? "USUARIO" : "ADMIN";
    const defaultStationId = stations[0]?.id ? String(stations[0].id) : "1";
    const assignedStId = newRole === "ADMIN" ? (selectedStation[userId] || defaultStationId) : undefined;

    const repo = authRepository as any;
    if (typeof repo.updateUserRole === "function") {
      repo.updateUserRole(userId, newRole, assignedStId);
    }

    setUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.id === userId
          ? { ...u, role: newRole, assignedStationId: assignedStId }
          : u
      )
    );
  };

  const getStationName = (id?: string) => {
    if (!id) return "-";
    const station = stations.find((s: any) => String(s.id) === String(id));
    return station ? station.name : `Surtidor ${id}`;
  };

  return (
    <div className="dashboard" style={{ display: "flex" }}>
      <Sidebar />

      {/* MARGIN LEFT PARA DESPLAZAR EL CONTENIDO Y NO TAPARLO CON EL SIDEBAR */}
      <main className="dashboard-content" style={{ marginLeft: "260px", padding: "20px", flex: 1, minWidth: 0 }}>
        <header className="dashboard-header">
          <div>
            <span className="header-label">MÓDULO EXCLUSIVO - DESARROLLADOR</span>
            <h1>Gestión Global de Usuarios y Rangos 👑</h1>
            <p>Crea nuevos usuarios o concede/revoca rangos de Administrador.</p>
          </div>
        </header>

        {/* FORMULARIO PARA CREAR USUARIO */}
        <section className="admin-profile-card" style={{ marginTop: "20px" }}>
          <h2>➕ Crear Nuevo Usuario</h2>
          <form onSubmit={handleCreateUser} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "15px", marginTop: "15px" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "5px", fontWeight: "bold" }}>Nombre Completo</label>
              <input
                type="text"
                placeholder="Ej. Juan Pérez"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                required
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "5px", fontWeight: "bold" }}>Carnet (Usuario)</label>
              <input
                type="text"
                placeholder="Ej. 123456"
                value={carnet}
                onChange={(e) => setCarnet(e.target.value)}
                style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                required
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "5px", fontWeight: "bold" }}>Contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                required
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "5px", fontWeight: "bold" }}>Rol Inicial</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
              >
                <option value="USUARIO">USUARIO</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            {role === "ADMIN" && (
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", marginBottom: "5px", fontWeight: "bold" }}>Surtidor Asignado</label>
                <select
                  value={stationId}
                  onChange={(e) => setStationId(e.target.value)}
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                >
                  {stations.map((s: any) => (
                    <option key={s.id} value={String(s.id)}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ gridColumn: "1 / -1" }}>
              <button
                type="submit"
                style={{
                  backgroundColor: "#10b981",
                  color: "#fff",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "6px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                🚀 Registrar Usuario
              </button>
            </div>
          </form>
        </section>

        {/* TABLA DE USUARIOS */}
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
                        getStationName(u.assignedStationId)
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