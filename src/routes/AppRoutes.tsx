import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";
import HomePage from "../pages/HomePage";
import StationsPage from "../pages/StationsPage";
import StatisticsPage from "../pages/StatisticsPage";
import InformationPage from "../pages/InformationPage";
import AdminPage from "../pages/auth/admin/AdminPage";
import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* LOGIN (Pública) */}
      <Route path="/login" element={<LoginPage />} />

      {/* RUTAS PROTEGIDAS */}
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
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminPage />
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

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;