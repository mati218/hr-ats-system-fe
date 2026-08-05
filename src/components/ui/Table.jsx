const Table = ({ columns, data, onEdit }) => {

  return (
    <table className="w-full border bg-white">

      <thead>
        <tr className="bg-gray-50">

          {
            columns.map((column, index) => (
              <th key={index} className="px-4 py-3 text-left">
                {column}
              </th>
            ))
          }

        </tr>
      </thead>

      <tbody>

        {
          data.map((user, index) => (
            <tr key={index} className="border-b">

              <td className="px-4 py-3 flex items-center gap-3">

                <div className="h-10 w-10 rounded-full bg-violet-400 text-white flex items-center justify-center">

                  {user.avatar}

                </div>

                {user.name}

              </td>

              <td className="px-4 py-3">
                {user.email}
              </td>

              <td className="px-4 py-3">
                {user.role}
              </td>

              <td className="px-4 py-3">
                {user.department}
              </td>

              <td className="px-4 py-3">
                {user.status}
              </td>

              <td className="px-4 py-3">
                {user.lastLogin}
              </td>

              <td className="px-4 py-3">
                <button
                  onClick={() => onEdit(user)}
                  className="text-blue-600"
                >
                  Edit
                </button>

              </td>

            </tr>

          ))
        }
      </tbody>

    </table>
  );
};

export default Table;