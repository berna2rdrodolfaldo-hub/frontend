import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { authRepository } from "../repositories/authRepository";
import type { UserRole } from "../types/auth";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  // 1. Si NO está autenticado, redirigir inmediatamente al login
  if (!authRepository.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const currentUser = authRepository.getCurrentUser();

  // 2. Si se especifican roles permitidos y el usuario actual no los tiene, redirigir al inicio
  if (allowedRoles && currentUser && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }

  // 3. Si todo está en orden, permitir ver la página
  return <>{children}</>;
}

export default ProtectedRoute;