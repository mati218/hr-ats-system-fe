function getInitial(name = "") {
  return name.trim().charAt(0).toUpperCase() || "?";
}

function RoleCard({ role, selectedRole, setSelectedRole }) {
  const active = selectedRole?._id === role._id;

  let badgeClass = "bg-slate-100 text-slate-700";
  let hoverBorder = "hover:border-slate-300";
  let ringColor = "border-blue-500";

  const name = (role.roleName || "").toLowerCase();

  if (name.includes("super") && name.includes("admin")) {
    badgeClass = "bg-violet-100 text-violet-700";
    hoverBorder = "hover:border-violet-300";
    ringColor = "border-violet-500";
  } else if (name.includes("recruiter") || name.includes("hr")) {
    badgeClass = "bg-blue-100 text-blue-700";
    hoverBorder = "hover:border-blue-300";
    ringColor = "border-blue-500";
  } else if (name.includes("interview")) {
    badgeClass = "bg-amber-100 text-amber-700";
    hoverBorder = "hover:border-amber-300";
    ringColor = "border-amber-500";
  } else if (name.includes("admin")) {
    badgeClass = "bg-rose-100 text-rose-700";
    hoverBorder = "hover:border-rose-300";
    ringColor = "border-rose-500";
  } else if (name.includes("manager")) {
    badgeClass = "bg-emerald-100 text-emerald-700";
    hoverBorder = "hover:border-emerald-300";
    ringColor = "border-emerald-500";
  } else if (name.includes("employee")) {
    badgeClass = "bg-cyan-100 text-cyan-700";
    hoverBorder = "hover:border-cyan-300";
    ringColor = "border-cyan-500";
  }

  return (
    <div
      onClick={() => setSelectedRole(role)}
      className={`cursor-pointer rounded-2xl border bg-white text-left p-6 shadow-sm transition-all duration-150 hover:shadow-md ${
        active ? `${ringColor} shadow` : `border-slate-200 ${hoverBorder}`
      }`}
    >
      <div className="flex items-center justify-between">
        <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${badgeClass}`}>
          {role.roleName}
        </span>

        <span className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${badgeClass}`}>
          {getInitial(role.roleName)}
        </span>
      </div>

      <p className="mt-4 text-base text-slate-600">
        {role.description || "Custom role"}
        {role.userCount ? ` · ${role.userCount} user${role.userCount > 1 ? "s" : ""}` : ""}
      </p>

      <p className="mt-3 text-xs font-medium text-slate-400">
        {(role.permissions?.length || 0)} module{role.permissions?.length === 1 ? "" : "s"} configured
      </p>
    </div>
  );
}

export default RoleCard;