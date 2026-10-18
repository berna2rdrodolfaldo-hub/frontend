import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";
import HomePage from "../pages/HomePage";
import StationsPage from "../pages/StationsPage";
import StatisticsPage from "../pages/StatisticsPage";
import InformationPage from "../pages/InformationPage";
import AdminPage from "../pages/auth/admin/AdminPage";
import DeveloperPage from "../pages/auth/developer/DeveloperPage";
import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* LOGIN */}
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

      {/* RUTA ADMINISTRADOR */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["ADMIN", "DEVELOPER"]}>
            <AdminPage />
          </ProtectedRoute>
        }
      />

      {/* RUTA EXCLUSIVA DESARROLLADOR */}
      <Route
        path="/developer"
        element={
          <ProtectedRoute allowedRoles={["DEVELOPER"]}>
            <DeveloperPage />
          </ProtectedRoute>
        }
      />

      {/* REDIRECCIÓN POR DEFECTO */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;