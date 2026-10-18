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
      {/* RUTAS PÚBLICAS (Navegación libre sin login) */}
      <Route path="/" element={<HomePage />} />
      <Route path="/surtidores" element={<StationsPage />} />
      <Route path="/estadisticas" element={<StatisticsPage />} />
      <Route path="/informacion" element={<InformationPage />} />
      
      {/* LOGIN */}
      <Route path="/login" element={<LoginPage />} />

      {/* RUTA ADMINISTRACIÓN DE SURTIDOR (Solo para Dueños, Trabajadores o Devs) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["DUENO", "TRABAJADOR", "DEVELOPER"]}>
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
      {/* RUTA ADMINISTRACIÓN DE SURTIDOR */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["DUENO", "ADMIN", "TRABAJADOR", "DEVELOPER"]}>
              <AdminPage />
            </ProtectedRoute>
     }
          />

      {/* REDIRECCIÓN POR DEFECTO */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;