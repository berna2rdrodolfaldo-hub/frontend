import { NavLink, useNavigate } from "react-router-dom";
import { authRepository } from "../repositories/authRepository";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const user = authRepository.getCurrentUser();

  // Función para borrar la sesión y redirigir
  const handleLogout = () => {
    authRepository.logout();
    navigate("/login", { replace: true });
  };

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

        <NavLink to="/informacion" className="nav-item">
          <span>ℹ️</span>
          Información
        </NavLink>

        {/* Botón con la corona reposicionado JUSTO DEBAJO de Información */}
        <NavLink to="/admin" className="nav-item">
          <span>👑</span>
          Administrador
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
              <span>{user.role}</span>
            </div>
          </div>
        )}

        {/* AQUÍ ESTÁ EL BOTÓN DE CERRAR SESIÓN */}
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