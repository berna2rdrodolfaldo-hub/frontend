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

  return (
    <header className="top-header">
      <div className="header-title">
        <h1>Panel de Control</h1>
      </div>

      {/* SECCIÓN DEL ADMIN EN LA ESQUINA DERECHA */}
      <div className="admin-profile-corner">
        {user && (
          <div className="admin-info-badge">
            <div className="admin-avatar">
              {user.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="admin-details">
              <span className="admin-name">{user.name}</span>
              <span className="admin-role">{user.role}</span>
            </div>
          </div>
        )}

        <button
          className="header-logout-btn"
          onClick={handleLogout}
          type="button"
          title="Cerrar sesión"
        >
          🚪 Salir
        </button>
      </div>
    </header>
  );
}

export default Header;