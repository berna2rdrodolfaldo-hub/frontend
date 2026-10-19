import { NavLink, useNavigate } from "react-router-dom";
import { authRepository } from "../repositories/authRepository";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const user = authRepository.getCurrentUser() as any;

  // Función para borrar la sesión y redirigir
  const handleLogout = () => {
    authRepository.logout();
    navigate("/login", { replace: true });
  };

  // Normalizamos el rol a mayúsculas
  const rawRole = user?.role || user?.rol || "";
  const role = String(rawRole).toUpperCase().trim();

  // Verificación de roles
  const isDev = role === "DEVELOPER" || role === "DEV";
  const isOwner = role === "DUENO" || role === "ADMIN" || isDev;
  const isWorker = role === "TRABAJADOR";

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">⛽</div>
        <div>
          <h2>SAS</h2>
          <span>Administración</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" className="nav-item">
          <span>🏠</span>
          Inicio
        </NavLink>

        <NavLink to="/surtidores" className="nav-item">
          <span>⛽</span>
          Surtidores
        </NavLink>

        <NavLink to="/estadisticas" className="nav-item">
          <span>📊</span>
          Estadísticas
        </NavLink>

        {/* ACCESO A JUSTADOR DE ESTADO PARA TRABAJADORES */}
        {isWorker && (
          <NavLink to="/worker" className="nav-item nav-admin">
            <span>⚙️</span>
            Ajustador de Estado
          </NavLink>
        )}

        {/* ACCESO A PANEL ADMINISTRATIVO PARA DUEÑOS */}
        {isOwner && (
          <NavLink to="/admin" className="nav-item nav-admin">
            <span>⚙️</span>
            Panel Admin
          </NavLink>
        )}

        {/* MÓDULO EXCLUSIVO DE DESARROLLADOR */}
        {isDev && (
          <NavLink to="/developer" className="nav-item nav-admin">
            <span>👑</span>
            Módulo Dev
          </NavLink>
        )}

        <NavLink to="/informacion" className="nav-item">
          <span>ℹ️</span>
          Información
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        {user && (
          <div className="user-card">
            <div className="user-avatar">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="user-info">
              <strong>{user.name}</strong>
              <span>{user.role || user.rol}</span>
            </div>
          </div>
        )}

        <button
          className="sidebar-logout"
          onClick={handleLogout}
          type="button"
        >
          🚪 Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;