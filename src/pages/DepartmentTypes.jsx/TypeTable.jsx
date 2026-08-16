const TypeTable = ({ title, tableType, data, handleEdit }) => {
  return (
    <div className="w-full h-full rounded-2xl border border-slate-200 bg-white p-4">
      <h2 className="mb-2 font-bold text-slate-900 ">
        {title}
      </h2>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-slate-200">

            {tableType === "department" ? (
              <>
                <th className="px-2 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Name
                </th>

                <th className="px-2 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Employees
                </th>
              </>
            ) : (
              <>
                <th className="px-2 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Type
                </th>

                <th className="px-2 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Active Jobs
                </th>
              </>
            )}

            <th className="w-[100px] px-2 py-2.5"></th>
          </tr>
        </thead>

        <tbody>
          {(Array.isArray(data) ? data : []).map((item, index) => (
            <tr
              key={item?._id || index}
              className="border-b border-slate-200 last:border-b-0"
            >
              {tableType === "department" ? (
                <>
                  <td className="px-2 py-3.5 text-sm font-medium text-slate-700">
                    {item.name}
                  </td>

                  <td className="px-2 py-3.5 text-sm font-medium text-slate-600">
                    {item.employees}
                  </td>
                </>
              ) : (
                <>
                  <td className="px-2 py-3.5 text-sm font-medium text-slate-700">
                    {item.type}
                  </td>

                  <td className="px-2 py-3.5 text-sm font-medium text-slate-700">
                    {item.jobs}
                  </td>
                </>
              )}

              <td className="px-2 py-3.5 text-right">
                <button
                  className="text-sm font-semibold text-blue-600 transition hover:text-blue-700 hover:underline"
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TypeTable;