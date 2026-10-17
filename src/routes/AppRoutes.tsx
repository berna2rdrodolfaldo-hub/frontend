import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";
import HomePage from "../pages/HomePage";
import StationsPage from "../pages/StationsPage";
import StatisticsPage from "../pages/StatisticsPage";
import InformationPage from "../pages/InformationPage";
import AdminPage from "../pages/auth/admin/AdminPage";
import DeveloperPage from "../pages/auth/developer/DeveloperPage"; // Nueva vista de Desarrollador
import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* LOGIN (Pública) */}
      <Route path="/login" element={<LoginPage />} />

      {/* RUTAS PROTEGIDAS GENERALES */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/surtidores"
        element={
          <ProtectedRoute>
            <StationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/estadisticas"
        element={
          <ProtectedRoute>
            <StatisticsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/informacion"
        element={
          <ProtectedRoute>
            <InformationPage />
          </ProtectedRoute>
        }
      />

      {/* RUTA EXCLUSIVA PARA ADMINISTRADORES Y DESARROLLADOR */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "DEVELOPER"]}>
            <AdminPage />
          </ProtectedRoute>
        }
      />

      {/* RUTA EXCLUSIVA PARA EL DESARROLLADOR ÚNICO */}
      <Route
        path="/developer"
        element={
          <ProtectedRoute allowedRoles={["DEVELOPER"]}>
            <DeveloperPage />
          </ProtectedRoute>
        }
      />

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;