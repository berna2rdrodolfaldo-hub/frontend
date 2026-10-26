import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { FormEventHandler } from "react";
import type { LoginCredentials } from "../../types/auth";
import "./LoginForm.css";

interface LoginFormProps {
  error?: string;
  onSubmit: (credentials: LoginCredentials) => void;
}

function LoginForm({ error, onSubmit }: LoginFormProps) {
  const navigate = useNavigate();
  const [carnet, setCarnet] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const normalizedCarnet = carnet.trim();

    if (!normalizedCarnet || !password) {
      return;
    }

    onSubmit({
      carnet: normalizedCarnet,
      password,
    });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <form onSubmit={handleSubmit}>
          <h1>Iniciar Sesión</h1>

          <div>
            <label htmlFor="carnet">
              Carnet de identidad
            </label>

            <input
              id="carnet"
              name="carnet"
              type="text"
              value={carnet}
              onChange={(event) => setCarnet(event.target.value)}
              placeholder="Ingrese su carnet"
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label htmlFor="password">
              Contraseña
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Ingrese su contraseña"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p role="alert" aria-live="polite" className="error">
              {error}
            </p>
          )}

          <button type="submit">
            Ingresar
          </button>

          {/* Botón para volver o mirar como usuario dentro de la tarjeta */}
          <button
            type="button"
            onClick={() => navigate("/", { replace: true })}
            style={{
              marginTop: "12px",
              width: "100%",
              backgroundColor: "transparent",
              color: "#94a3b8",
              border: "1px dashed #475569",
              padding: "10px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.9rem",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = "#ffffff";
              e.currentTarget.style.borderColor = "#94a3b8";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = "#94a3b8";
              e.currentTarget.style.borderColor = "#475569";
            }}
          >
            ← Volver / Mirar como usuario
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;