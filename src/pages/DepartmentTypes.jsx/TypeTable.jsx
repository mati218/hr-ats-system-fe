const TypeTable = ({ title, tableType, data }) => {
  return (
    <div className="w-full h-full rounded-3xl border border-gray-200 bg-white p-6">

      <h2 className="mb-6 text-xl float-left font-semibold">
        {title}
      </h2>

      <table className="w-full">

        <thead>
          <tr className="border-b border-gray-200">

            {tableType === "department" ? (
              <>
                <th className="px-3 py-3 text-left text-md font-semibold uppercase text-gray-500">
                  Name
                </th>

                <th className="px-3 py-3 text-left text-md font-semibold uppercase text-gray-500">
                  Open Roles
                </th>
              </>
            ) : (
              <>
                <th className="px-3 py-3 text-left text-md font-semibold uppercase text-gray-500">
                  Type
                </th>

                <th className="px-3 py-3 text-left text-md font-semibold uppercase text-gray-500">
                  Active Jobs
                </th>
              </>
            )}

           <th>  </th>

          </tr>
        </thead>

        <tbody>

          {data.map((item, index) => (
            <tr
              key={index}
              className="border-b border-gray-100 hover:bg-gray-50 text-left"
            >

              {tableType === "department" ? (
                <>
                  <td className="px-3 py-4">{item.name}</td>
                  <td className="px-3 py-4">{item.roles}</td>
                </>
              ) : (
                <>
                  <td className="px-3 py-4">{item.type}</td>
                  <td className="px-3 py-4">{item.jobs}</td>
                </>
              )}

              <td className="px-3 py-4 text-right">
                <button className="text-blue-600 hover:text-blue-800">
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