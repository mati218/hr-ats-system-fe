import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

const PrivateRoute = ({
  module,
  requires = [],
  interviewerOnly = false,
}) => {
  const {
    user,
    isAuthenticated,
  } = useAuth();

  // ==========================================
  // NOT LOGGED IN
  // ==========================================

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // ==========================================
  // GET ROLE NAME
  // ==========================================

  const roleName =
    typeof user?.role === "object"
      ? user?.role?.roleName ||
        user?.role?.name ||
        ""
      : user?.role || "";

  const normalizedRole = String(roleName)
    .toLowerCase()
    .replace(/\s+/g, "")
    .trim();

  const isSuperAdmin =
    normalizedRole === "superadmin";

  const isInterviewer =
    normalizedRole === "interviewer";

  // ==========================================
  // INTERVIEWER
  // ==========================================
  //
  // Interviewer can ONLY access routes that
  // explicitly have interviewerOnly={true}
  //
  // ==========================================

  if (isInterviewer) {
    if (!interviewerOnly) {
      return (
        <Navigate
          to="/my-interviews"
          replace
        />
      );
    }

    return <Outlet />;
  }

  // ==========================================
  // SUPER ADMIN
  // ==========================================

  if (isSuperAdmin) {
    return <Outlet />;
  }

  // ==========================================
  // OTHER ROLES
  // ==========================================

  const permissions = Array.isArray(
    user?.role?.permissions
  )
    ? user.role.permissions
    : [];

  const modulesToCheck = [
    module,
    ...requires,
  ].filter(Boolean);

  // If no module is provided, deny access
  if (modulesToCheck.length === 0) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  const hasPermission =
    modulesToCheck.every(
      (requiredModule) => {
        const permission =
          permissions.find(
            (item) =>
              String(item?.module || "")
                .toLowerCase()
                .trim() ===
              String(requiredModule || "")
                .toLowerCase()
                .trim()
          );

        return (
          permission?.view === true ||
          permission?.view === "true"
        );
      }
    );

  // ==========================================
  // ACCESS DENIED
  // ==========================================

  if (!hasPermission) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  // ==========================================
  // ALLOWED
  // ==========================================

  return <Outlet />;
};

export default PrivateRoute;