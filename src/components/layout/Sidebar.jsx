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

const Sidebar = () => {
  const recruitment = [
    {
      name: "Job Requisitions",
      icon: <FaSuitcase />,
      path: "/job-requisitions",
    },
    {
      name: "Candidate Pipeline",
      icon: <FaSliders />,
      path: "/candidate-pipeline",
    },
    {
      name: "ATS Ranking",
      icon: <FaChartLine />,
      path: "/ats-ranking",
    },
    {
      name: "Interviews",
      icon: <FaCalendarDays />,
      path: "/interviews",
    },
    {
      name: "Offer Letters",
      icon: <FaFileLines />,
      path: "/offer-letters",
    },
    {
      name: "Reports",
      icon: <FaClock />,
      path: "/reports",
    },
  ];

  const administration = [
    {
      name: "User Management",
      icon: <FaUsers />,
      path: "/user-management",
    },
    {
      name: "Roles & Permissions",
      icon: <FaShield />,
      path: "/roles-permissions",
    },
    {
      name: "Departments & Types",
      icon: <FaBuilding />,
      path: "/departments",
    },
    {
      name: "Audit Log",
      icon: <FaClock />,
      path: "/audit-log",
    },
  ];

  return (
<aside className="w-72 h-full min-h-screen overflow-y-auto bg-[#11131d] text-white flex flex-col">
      <div className="flex items-center gap-3 p-7">
        <div className="h-11 w-11 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-lg">
          T
        </div>

        <div>
          <h2 className="font-bold text-xl">Talenta</h2>
          <p className="text-sm text-gray-400">HR / ATS</p>
        </div>
      </div>

      <div className="px-6 flex-1">

        <p className="text-s text-gray-500 uppercase mb-3 flex">
          Overview
        </p>
        
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-1 p-2 rounded-xl mb-2 ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-800"
            }`
          }
        >
          <FaTableColumns />
          Dashboard
        </NavLink>

        <p className="text-s text-gray-500 uppercase gap-1.5 mt-8 mb-3 flex font-semibold">
          Recruitment
        </p>

        {recruitment.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-1 p-2 rounded-xl mb-2 ${
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

        <p className="text-s text-gray-500 uppercase mt-8 mb-3 flex">
          Administration
        </p>

        {administration.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-1 p-2 rounded-xl mb-2 ${
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
      </div>

      <div className="border-t border-gray-800 p-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-violet-600 flex items-center justify-center font-bold">
            SA
          </div>

          <div>
            <h3 className="font-semibold">Super Admin</h3>
            <p className="text-sm text-gray-400">Super Admin</p>
          </div>
        </div>

        <button className="mt-4 text-sm text-gray-400 hover:text-white">
          Log out / switch role →
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;