import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { authRepository } from "../repositories/authRepository";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const user = authRepository.getCurrentUser() as any;

  // Función para borrar la sesión y redirigir
  const handleLogout = () => {
    authRepository.logout();
    navigate("/login", { replace: true });
  };

  // Función para ir al login si no hay sesión
  const handleLoginRedirect = () => {
    navigate("/login", { replace: true });
  };

  // Normalizamos el rol a mayúsculas
  const rawRole = user?.role || user?.rol || "";
  const role = String(rawRole).toUpperCase().trim();

  // Verificación de roles (si no hay usuario, por defecto es rol visitante/usuario básico sin privilegios admin/dev)
  const isDev = user && (role === "DEVELOPER" || role === "DEV");
  const isOwner = user && (role === "DUENO" || role === "ADMIN" || isDev);
  const isWorker = user && (role === "TRABAJADOR");

  // Función para cerrar el menú lateral en dispositivos móviles
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* BOTÓN HAMBURGUESA FLOTANTE SOLO EN CELULARES */}
      <button
        className="mobile-menu-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Menu"
        type="button"
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {/* FONDO OSCURO DE Sombra AL ABRIR EL MENÚ EN MÓVILES */}
      {isOpen && <div className="sidebar-overlay" onClick={closeMenu} />}

      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">⛽</div>
          <div>
            <h2>SAS</h2>
            <span>Administración</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" className="nav-item" onClick={closeMenu}>
            <span>🏠</span>
            Inicio
          </NavLink>

          <NavLink to="/surtidores" className="nav-item" onClick={closeMenu}>
            <span>⛽</span>
            Surtidores
          </NavLink>

          <NavLink to="/estadisticas" className="nav-item" onClick={closeMenu}>
            <span>📊</span>
            Estadísticas
          </NavLink>

          {/* ACCESO A AJUSTADOR DE ESTADO PARA TRABAJADORES */}
          {isWorker && (
            <NavLink to="/worker" className="nav-item nav-admin" onClick={closeMenu}>
              <span>⚙️</span>
              Ajustador de Estado
            </NavLink>
          )}

          {/* ACCESO A PANEL ADMINISTRATIVO PARA DUEÑOS */}
          {isOwner && (
            <NavLink to="/admin" className="nav-item nav-admin" onClick={closeMenu}>
              <span>⚙️</span>
              Panel Admin
            </NavLink>
          )}

          {/* MÓDULO EXCLUSIVO DE DESARROLLADOR */}
          {isDev && (
            <NavLink to="/developer" className="nav-item nav-admin" onClick={closeMenu}>
              <span>👑</span>
              Módulo Dev
            </NavLink>
          )}

          <NavLink to="/informacion" className="nav-item" onClick={closeMenu}>
            <span>ℹ️</span>
            Información
          </NavLink>
        </nav>

        <div className="sidebar-bottom">
          {user ? (
            <div className="user-card">
              <div className="user-avatar">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="user-info">
                <strong>{user.name}</strong>
                <span>{user.role || user.rol}</span>
              </div>
            </div>
          ) : (
            <div className="user-card">
              <div className="user-avatar">U</div>
              <div className="user-info">
                <strong>Usuario</strong>
                <span>Invitado</span>
              </div>
            </div>
          )}

          {user ? (
            <button
              className="sidebar-logout"
              onClick={() => {
                closeMenu();
                handleLogout();
              }}
              type="button"
            >
              🚪 Cerrar sesión
            </button>
          ) : (
            <button
              className="sidebar-logout"
              onClick={() => {
                closeMenu();
                handleLoginRedirect();
              }}
              type="button"
            >
              🔑 Iniciar sesión
            </button>
          )}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;