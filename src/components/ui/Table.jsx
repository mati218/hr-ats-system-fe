const Table = ({ columns, data }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

      <div className="grid grid-cols-[2.2fr_2.5fr_1.5fr_2fr_1.2fr_1.6fr_0.8fr] bg-gray-50 border-b px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
        {columns.map((column, index) => (
          <div key={index}>{column}</div>
        ))}
      </div>

      {data.map((row, index) => (
        <div
          key={index}
          className="grid grid-cols-[2.2fr_2.5fr_1.5fr_2fr_1.2fr_1.6fr_0.8fr] items-center border-b px-6 py-5 hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-400 font-semibold text-white">
              {row.avatar}
            </div>

            <span className="font-medium text-gray-900">
              {row.name}
            </span>
          </div>

          <div className="text-gray-600">
            {row.email}
          </div>

          <div className="text-gray-700">
            {row.role}
          </div>

          <div className="text-gray-700">
            {row.department}
          </div>

         <div className="text-gray-700 font-medium">
          {row.status}
          </div>

          <div className="text-gray-600">
            {row.lastLogin}
          </div>

          <div>
            <button className="font-medium text-blue-600 hover:text-blue-700">
              Edit →
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Table;