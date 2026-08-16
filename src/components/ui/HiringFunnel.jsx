const funnelData = [
  {
    title: "Applied",
    value: 612,
    width: "100%",
    color: "bg-indigo-500",
  },
  {
    title: "Screening",
    value: 392,
    width: "64%",
    color: "bg-indigo-500",
  },
  {
    title: "Shortlisted",
    value: 196,
    width: "32%",
    color: "bg-indigo-500",
  },
  {
    title: "Interview",
    value: 108,
    width: "18%",
    color: "bg-indigo-500",
  },
  {
    title: "Offer",
    value: 38,
    width: "6%",
    color: "bg-indigo-500",
  },
  {
    title: "Hired",
    value: 29,
    width: "4%",
    color: "bg-emerald-500",
  },
];

function HiringFunnel() {
  return (
    <div className="h-full rounded-2xl  border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-slate-900">
        Hiring funnel — this quarter
      </h2>

      <div className="space-y-3">
        {funnelData.map((item) => (
          <div
            key={item.title}
            className="grid grid-cols-[115px_1fr_35px] items-center gap-3"
          >
            {/* Label */}
            <p className="text-sm text-slate-600">
              {item.title}
            </p>

            {/* Progress background */}
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${item.color}`}
                style={{
                  width: item.width,
                }}
              />
            </div>

            {/* Number */}
            <p className="text-right text-sm font-semibold text-slate-900">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HiringFunnel;