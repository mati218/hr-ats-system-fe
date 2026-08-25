import { Navigate, Route, Routes } from "react-router-dom";

import { useAuth } from "../context/useAuth";
import AuthRoutes from "./AuthRoutes";
import ProtectedRoutes from "./ProtectedRoutes";
import CareerPortal from "../pages/CareerPortal/CareerPortal";

const MainRoutes = () => {
  const { token } = useAuth();
  const isAuthenticated = Boolean(token);

  return (
    <Routes>
      {/* Public Route */}
      <Route
        path="/career-portal"
        element={<CareerPortal />}
      />

      {isAuthenticated ? ProtectedRoutes() : AuthRoutes()}

      <Route
        path="*"
        element={
          <Navigate
            to={isAuthenticated ? "/dashboard" : "/login"}
            replace
          />
        }
      />
    </Routes>
  );
};

export default MainRoutes;