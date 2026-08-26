import { Route, Navigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import PrivateRoute from "../components/ui/PrivateRoute";

import Dashboard from "../pages/dashboard/Dashboard";
import JobRequisition from "../pages/JobRequistitions/JobRequisition";
import UserManagement from "../pages/usermanagement/UserManagement";
import RolesPermissions from "../pages/RolesPermissions/RolesPermissions";
import Departmenttype from "../pages/DepartmentTypes.jsx/Departmenttype";
import AuditLog from "../pages/Audit Log/AuditLog";
import ATSRanking from "../pages/ATSRanking/ATSRanking";
import CandidatePipeline from "../pages/CandidatePipeline/CandidatePipeline";
import Interviews from "../pages/interviews/Interviews";
import OfferLetters from "../pages/OfferLetters/OfferLetters";

const ProtectedRoutes = () => {
  return (
    <Route element={<PrivateRoute />}>
      <Route element={<MainLayout />}>

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* Users */}
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

        {/* Roles & Permissions */}
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

        {/* Old roles URL */}
        <Route
          path="/roles"
          element={
            <Navigate
              to="/roles-permissions"
              replace
            />
          }
        />

        {/* Departments */}
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

        {/* Audit Log */}
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

        {/* ATS Ranking */}
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

        {/* Job Requisitions */}
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

        {/* Candidate Pipeline */}
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

        {/* Interviews */}
        <Route
          element={
            <PrivateRoute module="interviews" />
          }
        >
          <Route
            path="/interviews"
            element={<Interviews />}
          />
        </Route>

        {/* Offer Letters */}
        <Route
          element={
            <PrivateRoute module="offerLetters" />
          }
        >
          <Route
            path="/offer-letters"
            element={<OfferLetters />}
          />
        </Route>

        
      </Route>
    </Route>
  );
};

export default ProtectedRoutes;