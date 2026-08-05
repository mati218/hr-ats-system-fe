const Table = ({ columns, data, onEdit }) => {
  return (
<table className="w-full table-fixed bg-white rounded-3xl overflow-hidden border border-gray-200">        <thead>
        <tr className="border-b border-gray-200">
          {columns.map((column, index) => (
            <th
              key={index}
              className="px-6 py-4 text-left text-sm font-semibold uppercase text-gray-500"
            >
              {column}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((user, index) => (
          <tr
            key={index}
            className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
          >
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
               <div
              className={`h-9 w-9 rounded-full text-white font-semibold flex items-center justify-center
               ${
               user.role === "Super Admin"
               ? "bg-violet-600"
               : user.role === "Recruiter"
               ? "bg-blue-600"
               : user.role === "Interviewer"
               ? "bg-emerald-600"
                : "bg-red-500"
    }`}
>
                  {user.avatar}
                </div>

                <span className="font-medium text-gray-900">
                  {user.name}
                </span>
              </div>
            </td>

            <td className="px-6 py-4 text-gray-700">
              {user.email}
            </td>

           <td className="px-6 py-4">
  <div
    className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium ${
      user.role === "Super Admin"
        ? "bg-violet-100 text-violet-600"
        : user.role === "Recruiter"
        ? "bg-blue-100 text-blue-600"
        : user.role === "Interviewer"
        ? "bg-amber-100 text-amber-600"
        : "bg-gray-100 text-gray-600"
    }`}
  >
    {user.role}
  </div>
</td>

            <td className="px-6 py-4 text-gray-700">
              {user.department}
            </td>

            <td className="px-6 py-4">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                {user.status}
              </span>
            </td>

            <td className="px-6 py-4 text-gray-700">
              {user.lastLogin}
            </td>

            <td className="px-6 py-4">
              <button
                onClick={() => onEdit(user)}
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

export default Table;