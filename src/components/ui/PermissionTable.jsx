import Checkbox from "./Checkbox";

function PermissionTable({ modules, register, errors }) {
  return (
    <div className="overflow-x-auto rounded-lg  bg-white shadow-sm">
      <table className="w-full border-collapse text-left">
        
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="py-3.5 pl-4 text-xs font-semibold uppercase tracking-wider text-slate-600">
              Module
            </th>
            <th className="py-3.5 px-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-600">
              View
            </th>
            <th className="py-3.5 px-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-600">
              Create
            </th>
            <th className="py-3.5 px-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-600">
              Edit
            </th>
            <th className="py-3.5 px-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-600">
              Delete
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {modules.map((module, index) => (
            <tr
              key={index}
              className="transition-colors hover:bg-slate-50/80"
            >
              <td className="py-3.5 pl-4 text-sm font-medium text-slate-800">
                {module}
              </td>

              <td className="py-3.5 px-3 text-center">
                <div className="flex justify-center">
                  <Checkbox
                    name={`permissions.${index}.view`}
                    register={register}
                    errors={errors}
                  />
                </div>
              </td>

              <td className="py-3.5 px-3 text-center">
                <div className="flex justify-center">
                  <Checkbox
                    name={`permissions.${index}.create`}
                    register={register}
                    errors={errors}
                  />
                </div>
              </td>

              <td className="py-3.5 px-3 text-center">
                <div className="flex justify-center">
                  <Checkbox
                    name={`permissions.${index}.edit`}
                    register={register}
                    errors={errors}
                  />
                </div>
              </td>

              <td className="py-3.5 px-3 text-center">
                <div className="flex justify-center">
                  <Checkbox
                    name={`permissions.${index}.delete`}
                    register={register}
                    errors={errors}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}

export default PermissionTable;