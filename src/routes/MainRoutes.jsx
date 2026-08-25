import { Routes, Route } from "react-router-dom";

import AuthRoutes from "./AuthRoutes";
import ProtectedRoutes from "./ProtectedRoutes";
import CareerPortal from "../pages/CareerPortal/CareerPortal";

const MainRoutes = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route
        path="/career-portal"
        element={<CareerPortal />}
      />

      {/* Authentication Routes */}
      <AuthRoutes />

      {/* Protected Routes */}
      <ProtectedRoutes />
    </Routes>
  );
};

export default MainRoutes;