const applications = [
  {
    id: 1,
    initials: "RN",
    name: "Rabia Nasir",
    role: "UX Designer",
    avatar: "bg-blue-600",
    status: "Screening",
    badge: "bg-blue-50 text-blue-600",
  },
  {
    id: 2,
    initials: "HM",
    name: "Hamza Malik",
    role: "Backend Engineer",
    avatar: "bg-violet-600",
    status: "Interview",
    badge: "bg-amber-50 text-amber-600",
  },
  {
    id: 3,
    initials: "SF",
    name: "Sana Farooq",
    role: "Product Manager",
    avatar: "bg-emerald-600",
    status: "Shortlisted",
    badge: "bg-emerald-50 text-emerald-600",
  },
  {
    id: 4,
    initials: "AJ",
    name: "Ali Jawad",
    role: "QA Engineer",
    avatar: "bg-red-600",
    status: "Rejected",
    badge: "bg-red-50 text-red-600",
  },
];

function RecentApplications() {
  return (
    <div className="rounded-2xl border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-3  font-semibold text-slate-900">
        Recent applications
      </h2>

      <div>
        {applications.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b border-slate-200 py-2 last:border-b-0"
          >
            {/* Left side */}
            <div className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${item.avatar}`}
              >
                {item.initials}
              </div>

              <div>
                <h3 className="text-sm font-semibold leading-5 text-slate-900">
                  {item.name}
                </h3>

                <p className="text-xs text-slate-500">
                  {item.role}
                </p>
              </div>
            </div>

            {/* Status */}
            <span
              className={`rounded-full mr-23  px-3 py-1 text-xs font-semibold ${item.badge}`}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentApplications;