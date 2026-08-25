import { Navigate, Route } from "react-router-dom";
import { useAuth } from "../context/useAuth";

import Login from "../pages/auth/LoginPage";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import ChangePassword from "../pages/ChangePassword";
import UpdatePassword from "../pages/UpdatePassword";

const AuthRoutes = () => {
  const { token } = useAuth();

  console.log("AuthRoutes token:", token);

  const isAuthenticated = Boolean(token);

  return (
    <>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login />
          )
        }
      />

      <Route
        path="/forgot-password"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <ForgotPassword />
          )
        }
      />

      <Route
        path="/reset-password/:token"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <ResetPassword />
          )
        }
      />

      <Route
        path="/change-password"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <ChangePassword />
          )
        }
      />

      <Route
        path="/update-password/:token"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <UpdatePassword />
          )
        }
      />
    </>
  );
};

export default AuthRoutes;