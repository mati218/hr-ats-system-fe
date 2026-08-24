import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

import Login from "./pages/auth/LoginPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword";
import UpdatePassword from "./pages/UpdatePassword";

import MainLayout from "./layouts/MainLayout";
import PrivateRoute from "./components/ui/PrivateRoute";

import Dashboard from "./pages/dashboard/Dashboard";
import JobRequisition from "./pages/JobRequistitions/JobRequisition";
import CareerPortal from "./pages/CareerPortal/CareerPortal";
import UserManagement from "./pages/usermanagement/UserManagement";
import RolesPermissions from "./pages/RolesPermissions/RolesPermissions";
import Departmenttype from "./pages/DepartmentTypes.jsx/Departmenttype";
import AuditLog from "./pages/Audit Log/AuditLog";
import ATSRanking from "./pages/ATSRanking/ATSRanking";
import CandidatePipeline from "./pages/CandidatePipeline/CandidatePipeline";

function App() {
  return (
    <>
      <Toaster position="bottom-right" richColors />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          <Route
            path="/reset-password/:token"
            element={<ResetPassword />}
          />

          <Route
            path="/change-password"
            element={<ChangePassword />}
          />

          <Route
            path="/update-password/:token"
            element={<UpdatePassword />}
          />

          <Route
            path="/career-portal"
            element={<CareerPortal />}
          />

          <Route element={<PrivateRoute />}>
            <Route element={<MainLayout />}>

              <Route
                path="/dashboard"
                element={<Dashboard />}
              />

              <Route
                element={
                  <PrivateRoute module="users" />
                }
              >
                <Route
                  path="/user-management"
                  element={<UserManagement />}
                />
              </Route>

              <Route
                element={
                  <PrivateRoute module="roles" />
                }
              >
                <Route
                  path="/roles-permissions"
                  element={<RolesPermissions />}
                />
              </Route>

              <Route
                path="/roles"
                element={
                  <Navigate
                    to="/roles-permissions"
                    replace
                  />
                }
              />

              <Route
                element={
                  <PrivateRoute module="departments" />
                }
              >
                <Route
                  path="/departments"
                  element={<Departmenttype />}
                />
              </Route>

              <Route
                element={
                  <PrivateRoute module="auditLogs" />
                }
              >
                <Route
                  path="/audit-log"
                  element={<AuditLog />}
                />
              </Route>

              <Route
                element={
                  <PrivateRoute
                    module="atsRanking"
                    requires={["candidates"]}
                  />
                }
              >
                <Route
                  path="/ats-ranking"
                  element={<ATSRanking />}
                />
              </Route>

              <Route
                element={
                  <PrivateRoute module="jobRequisitions" />
                }
              >
                <Route
                  path="/job-requisitions"
                  element={<JobRequisition />}
                />
              </Route>

              <Route
                element={
                  <PrivateRoute module="candidates" />
                }
              >
                <Route
                  path="/candidate-pipeline"
                  element={<CandidatePipeline />}
                />
              </Route>

            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;