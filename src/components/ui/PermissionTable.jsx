import Checkbox from "./Checkbox";

function PermissionTable({ modules, register, errors, disabled = false }) {
  return (
    <div className="w-full">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="py-2.5 pl-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Module
            </th>

            <th className="w-[100px] py-2.5 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              View
            </th>

            <th className="w-[100px] py-2.5 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Create
            </th>

            <th className="w-[100px] py-2.5 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Edit
            </th>

            <th className="w-[100px] py-2.5 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Delete
            </th>
          </tr>
        </thead>

        <tbody>
          {modules.map((module) => (
            <tr
              key={module.key}
              className="border-b border-slate-200 last:border-b-0"
            >
              <td className="py-2.5 pl-2 text-sm font-semibold text-slate-800">
                {module.label}

                <input
                  type="hidden"
                  value={module.key}
                  {...register(`permissions.${module.key}.module`)}
                />
              </td>

              {["view", "create", "edit", "delete"].map((action) => (
                <td
                  key={action}
                  className="py-2.5 text-center"
                >
                  <div className="flex justify-center">
                    <Checkbox
                      name={`permissions.${module.key}.${action}`}
                      register={register}
                      errors={errors}
                      disabled={disabled}
                    />
                  </div>
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