import { FaBars, FaMagnifyingGlass } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useContext } from "react";

import { AuthContext } from "../../context/AuthContextValue";
function Topbar({ toggle }) {
  const { user } = useContext(AuthContext);

  const roleName =
    typeof user?.role === "string"
      ? user.role
      : user?.role?.roleName ||
        user?.role?.name ||
        user?.roleName ||
        "User";

  const userName =
    user?.name ||
    user?.username ||
    "User";

  const initials = userName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 h-16 w-full bg-white border-b border-slate-200">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={toggle}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white lg:hidden"
          >
            <FaBars />
          </button>

          <div className="hidden sm:flex h-9 w-full max-w-90 text-xs items-center rounded-xl border border-slate-200 bg-slate-100 px-4">
            <FaMagnifyingGlass className="text-slate-400 text-xs" />

            <input
              type="search"
              placeholder="Search candidates, jobs, requisition ID..."
              className="ml-4 w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/career-portal"
            className="
              hidden sm:block
              rounded-xl
              border border-slate-200
              bg-white
              px-2 py-2
              text-xs
              font-semibold
              text-[#111827]
              hover:bg-slate-50
              transition "
          >
            Career Portal (public)
          </Link>

          <div className="hidden sm:block rounded-xl bg-violet-100 px-2 py-2">
            <p className="text-xs font-semibold text-violet-700">
              {roleName}
            </p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 font-semibold text-white">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;