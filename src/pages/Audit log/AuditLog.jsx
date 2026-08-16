const auditLogs = [
  {
    id: 1,
    user: "Super Admin",
    action: "Created role Hiring Manager",
    module: "Roles & Permissions",
    timestamp: "Jul 14, 09:16",
    ip: "10.4.2.18",
  },
  {
    id: 2,
    user: "Ayesha Khan",
    action: "Published job DevOps Engineer",
    module: "Job Requisitions",
    timestamp: "Jul 14, 08:55",
    ip: "10.4.5.61",
  },
  {
    id: 3,
    user: "Zeeshan Raza",
    action: "Submitted feedback for Sara Iqbal",
    module: "Interviews",
    timestamp: "Jul 13, 17:40",
    ip: "10.4.7.12",
  },
  {
    id: 4,
    user: "Super Admin",
    action: "Deactivated user Omer Sheikh",
    module: "User Management",
    timestamp: "Jul 13, 15:02",
    ip: "10.4.2.18",
  },
  {
    id: 5,
    user: "Ayesha Khan",
    action: "Sent offer to Usman Tariq",
    module: "Offer Letters",
    timestamp: "Jul 10, 11:30",
    ip: "10.4.5.61",
  },
];

function AuditLog() {
  return (
    <div className="w-full min-h-screen bg-slate-50 px-4 sm:px-8 py-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-[28x] font-bold leading-8 text-slate-700 ">
            Audit Log
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            System-wide activity, for compliance and traceability
          </p>
        </div>
        <button className="rounded-xl border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-900 shadow-sm transition hover:bg-slate-50">
          Export CSV
        </button>
      </div>

      <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                User
              </th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Action
              </th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Module
              </th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Timestamp
              </th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                IP Address
              </th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map((log) => (
              <tr
                key={log.id}
                className="border-b border-slate-200 last:border-b-0"
              >
                <td className="px-3 py-3 text-sm font-medium text-slate-900 whitespace-nowrap">
                  {log.user}
                </td>
                <td className="px-3 py-3 text-sm text-slate-900">
                  {log.action}
                </td>
                <td className="px-3 py-3 text-sm text-slate-900 whitespace-nowrap">
                  {log.module}
                </td>
                <td className="px-3 py-3 text-sm font-mono font-medium text-slate-900 whitespace-nowrap">
                  {log.timestamp}
                </td>
                <td className="px-3 py-3 text-sm font-mono font-medium text-slate-900 whitespace-nowrap">
                  {log.ip}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AuditLog;