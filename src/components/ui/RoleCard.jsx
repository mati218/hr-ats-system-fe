function RoleCard({
  role,
  selectedRole,
  setSelectedRole,
}) {
  const active = selectedRole?._id === role._id;

  return (
    <div
      onClick={() => setSelectedRole(role)}
      className={`cursor-pointer rounded-2xl border bg-white p-6 transition-all ${
        active
          ? "border-blue-500 shadow-sm"
          : "border-slate-200 hover:border-blue-300"
      }`}
    >
      <div className="text-left">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
            active
              ? "bg-blue-100 text-blue-700"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          {role.roleName}
        </span>

        <p className="mt-4 text-base text-slate-600">
          {role.description}
        </p>
      </div>
    </div>
  );
}

export default RoleCard;