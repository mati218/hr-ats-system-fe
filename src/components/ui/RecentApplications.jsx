const applications = [
  {
    id: 1,
    initials: "RN",
    name: "Rabia Nasir",
    role: "UX Designer",
    avatar: "bg-blue-600",
    status: "Screening",
    badge: "bg-blue-100 text-blue-700",
  },
  {
    id: 2,
    initials: "HM",
    name: "Hamza Malik",
    role: "Backend Engineer",
    avatar: "bg-violet-600",
    status: "Interview",
    badge: "bg-amber-100 text-amber-700",
  },
  {
    id: 3,
    initials: "SF",
    name: "Sana Farooq",
    role: "Product Manager",
    avatar: "bg-emerald-600",
    status: "Shortlisted",
    badge: "bg-emerald-100 text-emerald-700",
  },
  {
    id: 4,
    initials: "AJ",
    name: "Ali Jawad",
    role: "QA Engineer",
    avatar: "bg-red-600",
    status: "Rejected",
    badge: "bg-red-100 text-red-700",
  },
];

function RecentApplications() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="mb-4 text-2xl font-bold text-slate-900">
        Recent applications
      </h2>

      <div className="space-y-2">
        {applications.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b border-slate-200 py-3 "
          >
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-12 items-center justify-center rounded-full font-bold text-white ${item.avatar}`}
              >
                {item.initials}
              </div>

              <div>
                <h3 className="text-md font-bold text-slate-900">
                  {item.name}
                </h3>

                <p className="text-base text-slate-500">
                  {item.role}
                </p>
              </div>
            </div>

            <span
              className={`rounded-full px-2 py-1 text-sm font-semibold ${item.badge}`}
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