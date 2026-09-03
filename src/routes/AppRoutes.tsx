
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";
import HomePage from "../pages/HomePage";
import StationsPage from "../pages/StationsPage";
import StatisticsPage from "../pages/StatisticsPage";
import InformationPage from "../pages/InformationPage";

function AppRoutes() {

  return (
    <BrowserRouter>

      <Routes>

        {/* LOGIN */}

        <Route
          path="/login"
          element={<LoginPage />}
        />


        {/* INICIO */}

        <Route
          path="/"
          element={<HomePage />}
        />


        {/* SURTIDORES */}

        <Route
          path="/surtidores"
          element={<StationsPage />}
        />


        {/* ESTADÍSTICAS */}

        <Route
          path="/estadisticas"
          element={<StatisticsPage />}
        />


        {/* INFORMACIÓN */}

        <Route
          path="/informacion"
          element={<InformationPage />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default AppRoutes;


