import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";
import HomePage from "../pages/HomePage";
import StationsPage from "../pages/StationsPage";
import StationDetailPage from "../pages/StationDetailPage";
import StatisticsPage from "../pages/StatisticsPage";
import InformationPage from "../pages/InformationPage";
import AdminPage from "../pages/auth/admin/AdminPage";
import WorkerPage from "../pages/auth/worker/WorkerPage";
import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* RUTAS PÚBLICAS */}
      <Route path="/" element={<HomePage />} />
      <Route path="/surtidores" element={<StationsPage />} />
      <Route path="/surtidores/:id" element={<StationDetailPage />} />
      <Route path="/estadisticas" element={<StatisticsPage />} />
      <Route path="/informacion" element={<InformationPage />} />

      {/* LOGIN */}
      <Route path="/login" element={<LoginPage />} />

      {/* RUTA AJUSTADOR OPERATIVO (Para Trabajadores, Dueños o Devs en modo prueba) */}
      <Route
        path="/worker"
        element={
          <ProtectedRoute allowedRoles={["TRABAJADOR", "DUENO", "ADMIN", "DEVELOPER"]}>
            <WorkerPage />
          </ProtectedRoute>
        }
      />

      {/* RUTA ADMINISTRACIÓN DE SURTIDOR (Exclusiva para Dueños y Devs) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["DUENO", "ADMIN", "DEVELOPER"]}>
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