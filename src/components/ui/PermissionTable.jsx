import Checkbox from "./Checkbox";

function PermissionTable({ modules, register, errors, disabled = false }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50 ">
            <th className="py-3.5 pl-4 text-xs font-semibold uppercase tracking-wider text-slate-600">Module</th>
            <th className="py-3.5 px-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-600">View</th>
            <th className="py-3.5 px-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-600">Create</th>
            <th className="py-3.5 px-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-600">Edit</th>
            <th className="py-3.5 px-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-600">Delete</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {modules.map((module) => (
            <tr key={module.key}>
              <td className="py-3.5 pl-4 text-sm font-medium text-slate-800">
                {module.label}
                <input
                  type="hidden"
                  value={module.key}
                  {...register(`permissions.${module.key}.module`)}
                />
              </td>

              {["view", "create", "edit", "delete"].map((action) => (
                <td key={action} className="py-3.5 px-3 text-center">
                  <Checkbox
                    name={`permissions.${module.key}.${action}`}
                    register={register}
                    errors={errors}
                    disabled={disabled}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PermissionTable;