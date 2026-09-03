
import { useState } from "react";
import type { FormEventHandler } from "react";
import type { LoginCredentials } from "../../types/auth";
import "./LoginForm.css";

interface LoginFormProps {
  error?: string;
  onSubmit: (credentials: LoginCredentials) => void;
}

function LoginForm({ error, onSubmit }: LoginFormProps) {
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

        </form>
      </div>
    </div>
  );
}

export default LoginForm;
