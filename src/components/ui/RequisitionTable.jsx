const statusStyles = {
  Open: "bg-green-100 text-green-700",
  Draft: "bg-amber-100 text-amber-700",
  Closed: "bg-gray-100 text-gray-600",
  Archived: "bg-slate-200 text-slate-600",
};

const RequisitionTable = ({ columns, data, onEdit }) => {
  return (
    <table className="min-w-full w-auto bg-white rounded-3xl overflow-hidden border border-gray-200">
      <thead>
        <tr className="border-b border-gray-200">
          {columns.map((column, index) => (
            <th
              key={index}
              className="px-4 py-4 text-left text-sm font-semibold uppercase text-gray-500"
            >
              {column}
            </th>
          ))}
          <th className="px-4 py-4 text-left"></th>
        </tr>
      </thead>

      <tbody>
        {data.map((req, index) => (
          <tr
            key={req._id || index}
            className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
          >
            {/* Role */}
            <td className="px-4 py-4 text-left font-semibold text-gray-900">
              {req.role}
            </td>

            {/* Department */}
            <td className="px-4 py-4 text-left text-gray-700">
              {req.department}
            </td>

            {/* Type */}
            <td className="px-4 py-4 text-left text-gray-700">
              {req.type}
            </td>

            {/* Status */}
            <td className="px-4 py-4 text-left">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[req.status] || "bg-gray-100 text-gray-600"
                  }`}
              >
                {req.status}
              </span>
            </td>

            {/* Candidates */}
            <td className="px-4 py-4 text-left text-gray-700">
              {req.candidates}
            </td>

            {/* Posted */}
            {/* Posted */}
            <td className="px-4 py-4 text-left text-gray-700">
              {req.createdAt
                ? new Date(req.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                })
                : "-"}
            </td>

            {/* Action */}
            <td className="px-4 py-4 text-left">
              <button
                onClick={() => onEdit(req)}
                className="text-blue-600 font-medium hover:underline"
              >
                Edit →
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RequisitionTable;