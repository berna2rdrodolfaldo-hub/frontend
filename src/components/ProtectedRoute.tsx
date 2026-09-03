import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { authRepository } from "../repositories/authRepository";

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Si NO está autenticado, redirigir inmediatamente al login
  if (!authRepository.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, permitir ver la página
  return <>{children}</>;
}

export default ProtectedRoute;