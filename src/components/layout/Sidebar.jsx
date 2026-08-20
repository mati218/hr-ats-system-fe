import { NavLink } from "react-router-dom";
import {
  FaTableColumns,
  FaSuitcase,
  FaSliders,
  FaChartLine,
  FaCalendarDays,
  FaFileLines,
  FaClock,
  FaUsers,
  FaShield,
  FaBuilding,
} from "react-icons/fa6";

import { useAuth } from "../../context/useAuth";

const Sidebar = () => {
  const { user, logout } = useAuth();

  const userName = user?.name || "User";
  const roleName = user?.role?.roleName || "No Role";
  const permissions = user?.role?.permissions || [];

  const canView = (module) => {
    if (module === "roles" || module === "auditLogs") {
      return true;
    }

    const moduleAliases = {
      roles: ["roles", "rolePermissions", "rolesPermissions"],
      auditLogs: ["auditLogs", "auditLog", "audit"],
    };
    const supportedModules = moduleAliases[module] || [module];
    const permission = permissions.find((item) =>
      supportedModules.includes(item.module)
    );

    return permission?.view === true;
  };

  const recruitment = [
    {
      name: "Job Requisitions",
      icon: <FaSuitcase />,
      path: "/job-requisitions",
      module: "jobRequisitions",
    },
    {
      name: "Candidate Pipeline",
      icon: <FaSliders />,
      path: "/candidate-pipeline",
      module: "candidates",
    },
    {
      name: "ATS Ranking",
      icon: <FaChartLine />,
      path: "/ats-ranking",
      module: "candidates",
    },
    {
      name: "Interviews",
      icon: <FaCalendarDays />,
      path: "/interviews",
      module: "interviews",
    },
    {
      name: "Offer Letters",
      icon: <FaFileLines />,
      path: "/offer-letters",
      module: "offerLetters",
    },
    {
      name: "Reports",
      icon: <FaClock />,
      path: "/reports",
      module: "reports",
    },
  ];

  const administration = [
    {
      name: "User Management",
      icon: <FaUsers />,
      path: "/user-management",
      module: "users",
    },
    {
      name: "Roles & Permissions",
      icon: <FaShield />,
      path: "/roles-permissions",
      module: "roles",
    },
    {
      name: "Departments & Types",
      icon: <FaBuilding />,
      path: "/departments",
      module: "departments",
    },
    {
      name: "Audit Log",
      icon: <FaClock />,
      path: "/audit-log",
      module: "auditLogs",
    },
  ];

  const visibleRecruitment = recruitment.filter((item) =>
    canView(item.module)
  );

  const visibleAdministration = administration.filter((item) =>
    canView(item.module)
  );

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <aside className="w-63 h-full min-h-screen overflow-y-auto bg-[#11131d] text-white flex flex-col">

      <div className="flex items-center gap-2 p-6">
        <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center font-semibold text-md">
          T
        </div>

        <div>
          <h2 className="font-bold text-md">Talenta</h2>
          <p className="text-xs text-gray-400">HR / ATS</p>
        </div>
      </div>

      <div className="px-6 flex-1">

        <p className="text-[11px] text-gray-500 uppercase mb-2 flex">
          Overview
        </p>

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 p-1.5 text-sm font-semibold rounded-lg mb-2 ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-800"
            }`
          }
        >
          <FaTableColumns />
          Dashboard
        </NavLink>

        {visibleRecruitment.length > 0 && (
          <>
            <p className="text-[11px] text-gray-500 uppercase mt-3 mb-3 flex font-semibold">
              Recruitment
            </p>

            {visibleRecruitment.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center text-gray-400 gap-3 p-1.5 font-semibold text-sm rounded-lg mb-1 ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </>
        )}

        {visibleAdministration.length > 0 && (
          <>
            <p className="text-[11px] text-gray-500 uppercase mt-4 mb-1 flex font-semibold">
              Administration
            </p>

            {visibleAdministration.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center text-gray-400 gap-3 p-1.5 font-semibold text-sm rounded-lg mb-1 ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </>
        )}
      </div>

      <div className="border-t border-gray-800 p-6">
        <div className="flex items-center gap-3">

          <div className="h-8 w-8 rounded-full bg-violet-600 flex items-center justify-center font-bold">
            {userName.charAt(0).toUpperCase()}
          </div>

          <div>
            <h3 className="font-semibold text-sm">
              {userName}
            </h3>

            <p className="text-xs text-gray-400">
              {roleName}
            </p>
          </div>

        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-1 text-xs text-gray-400 hover:text-white"
        >
          Log out →
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;