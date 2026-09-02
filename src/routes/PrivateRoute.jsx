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

  // ==============================
  // NOT LOGGED IN
  // ==============================

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // ==============================
  // GET ROLE
  // ==============================

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

  const isInterviewer =
    normalizedRole === "interviewer";

  const isSuperAdmin =
    normalizedRole === "superadmin";

  console.log("PRIVATE ROUTE");
  console.log("ROLE:", roleName);
  console.log("NORMALIZED:", normalizedRole);
  console.log("INTERVIEWER:", isInterviewer);
  console.log("MODULE:", module);
  console.log("INTERVIEWER ONLY:", interviewerOnly);

  // ==============================
  // INTERVIEWER
  // ==============================

  if (isInterviewer) {
    // Only routes specifically marked
    // interviewerOnly can be opened.

    if (interviewerOnly === true) {
      return <Outlet />;
    }

    // Candidate Pipeline, Dashboard,
    // ATS, Users, Roles, etc.
    // ALL blocked for interviewer.

    return (
      <Navigate
        to="/my-interviews"
        replace
      />
    );
  }

  // ==============================
  // SUPER ADMIN
  // ==============================

  if (isSuperAdmin) {
    return <Outlet />;
  }

  // ==============================
  // NORMAL USER PERMISSIONS
  // ==============================

  const permissions = Array.isArray(
    user?.role?.permissions
  )
    ? user.role.permissions
    : [];

  const modulesToCheck = [
    module,
    ...requires,
  ].filter(Boolean);

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

  if (!hasPermission) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return <Outlet />;
};

export default PrivateRoute;