import React from "react";
import { Navigate } from "react-router-dom";
import { authRepository } from "../repositories/authRepository";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const user: any = authRepository.getCurrentUser();

  // 1. Si no hay usuario autenticado, redirige al Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Verificación de roles
  if (allowedRoles && allowedRoles.length > 0) {
    const rawRole = user.role || user.rol || "";
    const userRole = String(rawRole).toUpperCase().trim();

    const hasPermission = allowedRoles.some(
      (role) => role.toUpperCase().trim() === userRole
    );

    if (!hasPermission) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}