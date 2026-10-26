import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import LoginForm from "../../components/auth/LoginForm";
import { authRepository } from "../../repositories/authRepository";
import type { LoginCredentials } from "../../types/auth";

function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  if (authRepository.isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = (credentials: LoginCredentials) => {
    setError("");
    const user = authRepository.login(credentials);

    if (!user) {
      setError("El carnet o la contraseña son incorrectos.");
      return;
    }

    navigate("/", { replace: true });
  };

  return (
    <div style={{ width: "100vw", minHeight: "100vh", margin: 0, padding: 0, position: "relative" }}>
      {/* Botón para volver o mirar como usuario */}
      <div style={{ position: "absolute", top: "20px", left: "20px", zIndex: 10 }}>
        <button
          onClick={() => navigate("/", { replace: true })}
          style={{
            backgroundColor: "#f1f5f9",
            color: "#334155",
            border: "1px solid #cbd5e1",
            padding: "8px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "0.9rem",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            transition: "all 0.2s ease"
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e2e8f0")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f1f5f9")}
        >
          ← Volver / Mirar como usuario
        </button>
      </div>

      <LoginForm error={error} onSubmit={handleLogin} />
    </div>
  );
}

export default LoginPage;