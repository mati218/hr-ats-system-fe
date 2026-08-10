function StatCard({
  title,
  value,
  subtitle,
  subtitleColor = "text-green-600",
  showProgress = false,
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4">
      <p className="text-sm font-bold  text-slate-500">
        {title}
      </p>

      <div className="mt-2 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            {value}
          </h2>

          <p className={`mt-4 font-semibold ${subtitleColor}`}>
            {subtitle}
          </p>
        </div>

        {showProgress && (
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-[6px] border-emerald-600">
            <span className="text-lg font-bold text-slate-900">
              78%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;