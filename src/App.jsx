import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/LoginPage";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import JobRequisition from "./pages/JobRequistitions/JobRequisition";
import UserManagement from "./pages/usermanagement/UserManagement";
import RolesPermissions from "./pages/RolesPermissions/RolesPermissions";
import Departmenttype from "./pages/DepartmentTypes.jsx/Departmenttype";
import AuditLog from "./pages/Audit Log/AuditLog"; 
import ATSRanking from "./pages/ATSRanking/ATSRanking";
import CandidatePipeline from "./pages/CandidatePipeline/CandidatePipeline";

function App() {
  return (
  
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />

        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/roles-permissions" element={<RolesPermissions />} />
          <Route path="/roles" element={<Navigate to="/roles-permissions" replace />} />
          <Route path="/departments" element={<Departmenttype />} />
          <Route path="/audit-log" element={<AuditLog />} />
          <Route path="/ats-ranking" element={<ATSRanking />} />
          <Route path="/job-requisitions" element={<JobRequisition />} />
          <Route path="/candidate-pipeline" element={<CandidatePipeline />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;