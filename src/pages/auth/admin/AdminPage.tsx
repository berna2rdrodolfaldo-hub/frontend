import { useNavigate } from "react-router-dom";
import { authRepository } from "../../../repositories/authRepository";
import Sidebar from "../../../components/Sidebar";
import "./AdminPage.css";

function AdminPage() {
  const navigate = useNavigate();
  const currentUser = authRepository.getCurrentUser();

  // Permitir acceso a Administradores y al Desarrollador Único
  const isAdmin = currentUser?.role === "ADMIN" || currentUser?.role === "DEVELOPER";
  const isDeveloper = currentUser?.role === "DEVELOPER";

  if (!isAdmin) {
    return (
      <div className="dashboard">
        <Sidebar />
        <main className="dashboard-content">
          <h2>Acceso Denegado</h2>
          <p>No tienes permisos para ver este panel.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <span className="header-label">MÓDULO DE ADMINISTRACIÓN</span>
            <h1>Panel de Control del Administrador</h1>
            <p>Gestiona los surtidores, el personal y las configuraciones del sistema.</p>
          </div>

          <button className="back-btn" onClick={() => navigate("/")}>
            ⬅ Volver al Inicio
          </button>
        </header>

        {/* TARJETA DEL PERFIL */}
        <section className="admin-profile-card">
          <div className="profile-badge">
            <span className="crown-large">👑</span>
            <div>
              <h2>{currentUser?.name}</h2>
              <span className="role-tag">{currentUser?.role}</span>
            </div>
          </div>
          <p className="profile-desc">
            Sesión activa como {currentUser?.role}. Tienes acceso a la gestión de estaciones y usuarios.
          </p>

          {/* BOTÓN EXCLUSIVO DEL DESARROLLADOR */}
          {isDeveloper && (
            <div style={{ marginTop: "18px" }}>
              <button
                className="admin-action-btn"
                style={{
                  backgroundColor: "#f59e0b",
                  fontSize: "0.9rem",
                  padding: "10px 18px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer"
                }}
                onClick={() => navigate("/developer")}
              >
                👑 Ir al Panel de Desarrollador
              </button>
            </div>
          )}
        </section>

        {/* ACCIONES DE ADMINISTRACIÓN */}
        <section className="admin-grid">
          <div className="admin-card">
            <div className="admin-card-icon">⛽</div>
            <div className="admin-card-info">
              <h3>Gestión de Surtidores</h3>
              <p>Abre, cierra o modifica el estado del combustible de las estaciones.</p>
              <button
                className="admin-action-btn"
                onClick={() => navigate("/surtidores")}
              >
                Gestionar
              </button>
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card-icon">👥</div>
            <div className="admin-card-info">
              <h3>Trabajadores Asignados</h3>
              <p>Consulta el personal a tu cargo y sus turnos asignados.</p>
              <button className="admin-action-btn">
                Ver Equipo
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminPage;