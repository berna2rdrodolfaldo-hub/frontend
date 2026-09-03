import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import LoginForm from "../../components/auth/LoginForm";
import { authRepository } from "../../repositories/authRepository";

import type { LoginCredentials } from "../../types/auth";

function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  if (authRepository.isAuthenticated()) {
    // Redirigir siempre a la página principal sin importar el rol
    return <Navigate to="/" replace />;
  }

  const handleLogin = (credentials: LoginCredentials) => {
    setError("");

    const user = authRepository.login(credentials);

    if (!user) {
      setError("El carnet o la contraseña son incorrectos.");
      return;
    }

    // Redirección unificada al Inicio para todos los usuarios
    navigate("/", { replace: true });
  };

  return (
    <main>
      <LoginForm
        error={error}
        onSubmit={handleLogin}
      />
    </main>
  );
}

export default LoginPage;