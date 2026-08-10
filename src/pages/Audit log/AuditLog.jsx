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
      <div className="min-h-screen  p-8">
      <div className="mb-6 flex items-start justify-between  text-left">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Audit Log
          </h1>
          <p className="mt-2 text-lg text-slate-500">
            System-wide activity, for compliance and traceability
          </p>
        </div>
        <button className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-black hover:bg-slate-50">
          Export CSV
        </button>
      </div>
      <div className="overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm">
        <table className="w-full ">

          <thead>
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-black">
                User
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-black">
                Action
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-black">
                Module
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-black">
                Timestamp
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-black">
                IP Address
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-left">
            {auditLogs.map((log) => (
              <tr key={log.id} >
                <td className="px-6 py-5 font-medium text-black">
                  {log.user}
                </td>
                <td className="px-6 py-5 text-black">
                  {log.action}
                </td>
                <td className="px-6 py-5 text-black">
                  {log.module}
                </td>
                <td className="px-6 py-5 text-black">
                  {log.timestamp}
                </td>
                <td className="px-6 py-5 text-black">
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