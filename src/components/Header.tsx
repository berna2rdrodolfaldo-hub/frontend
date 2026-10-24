import { useNavigate } from "react-router-dom";
import { authRepository } from "../repositories/authRepository";
import "./Header.css";

function Header() {
  const navigate = useNavigate();
  const user = authRepository.getCurrentUser();

  const handleLogout = () => {
    authRepository.logout();
    navigate("/login", { replace: true });
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <header className="top-header">
      <div className="header-title">
        <h1>Panel de Control</h1>
      </div>

      {/* SECCIÓN DE USUARIO / LOGIN EN LA ESQUINA DERECHA */}
      <div className="admin-profile-corner">
        {user ? (
          <>
            <div className="admin-info-badge">
              <div className="admin-avatar">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="admin-details">
                <span className="admin-name">{user.name}</span>
                <span className="admin-role">{user.role}</span>
              </div>
            </div>

            <button
              className="header-logout-btn"
              onClick={handleLogout}
              type="button"
              title="Cerrar sesión"
            >
              🚪 Salir
            </button>
          </>
        ) : (
          <button
            className="header-logout-btn"
            onClick={handleLoginRedirect}
            type="button"
            title="Iniciar sesión"
          >
            🔑 Iniciar sesión
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;