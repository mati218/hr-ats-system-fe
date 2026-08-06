import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "./Button";
import FormInput from "./FormInput";
import PermissionTable from "./PermissionTable";

const modules = [
  { label: "Job Requisitions", key: "jobRequisitions" },
  { label: "Candidates", key: "candidates" },
  { label: "Interviews", key: "interviews" },
  { label: "Offer Letters", key: "offerLetters" },
  { label: "Users", key: "users" },
  { label: "Reports", key: "reports" },
];

// Ye 4 roles ke liye update AND delete dono blocked
const LOCKED_ROLES = ["SuperAdmin", "Admin", "HR", "Employee"];

function buildDefaultPermissions(role) {
  const permissionData = {};
  modules.forEach((m) => {
    permissionData[m.key] = { view: false, create: false, edit: false, delete: false };
  });
  (role?.permissions || []).forEach((item) => {
    if (permissionData[item.module]) {
      permissionData[item.module] = {
        view: item.view || false,
        create: item.create || false,
        edit: item.edit || false,
        delete: item.delete || false,
      };
    }
  });
  return permissionData;
}

function CreateRoleModal({ isOpen, onClose, onSave, onDelete, errorMessage, role, loading }) {
  const isEditing = Boolean(role?._id);
  const isLocked = isEditing && LOCKED_ROLES.includes(role.roleName);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      roleName: "",
      description: "",
      permissions: buildDefaultPermissions(null),
    },
  });

  useEffect(() => {
    if (!isOpen || loading) return;
    reset({
      roleName: role?.roleName || "",
      description: role?.description || "",
      permissions: buildDefaultPermissions(role),
    });
  }, [isOpen, loading, role, reset]);

  if (!isOpen) return null;

  const submitHandler = async (data) => {
    if (isLocked) return;
    const permissions = modules.map((module) => ({
      module: module.key,
      view: data.permissions?.[module.key]?.view || false,
      create: data.permissions?.[module.key]?.create || false,
      edit: data.permissions?.[module.key]?.edit || false,
      delete: data.permissions?.[module.key]?.delete || false,
    }));

    await onSave({
      roleName: data.roleName,
      description: data.description || "",
      permissions,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-[900px] rounded-[24px] bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-gray-200 px-8 py-6">
          <div className="text-left">
            <h2 className="text-3xl font-bold text-slate-900">
              {isEditing ? "Edit Role" : "Create Role"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {loading
                ? "Loading role data..."
                : isLocked
                ? "This is a system role. It cannot be edited or deleted."
                : isEditing
                ? "Update the role name and module-level permissions"
                : "Define a name and module-level permissions"}
            </p>
          </div>
          <button type="button" onClick={onClose} className="text-3xl text-gray-400 hover:text-red-500">
            ×
          </button>
        </div>

        {loading ? (
          <div className="px-8 py-16 text-center text-slate-400">Loading...</div>
        ) : (
          <form onSubmit={handleSubmit(submitHandler)}>
            <fieldset disabled={isLocked} className="space-y-6 px-8 py-6 text-left disabled:opacity-60">
              {errorMessage && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {errorMessage}
                </div>
              )}

              {isLocked && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  🔒 {role.roleName} is a protected system role and cannot be modified or deleted.
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Role Name</label>
                <FormInput
                  type="text"
                  name="roleName"
                  placeholder="e.g. Hiring Manager"
                  register={register}
                  errors={errors}
                  rules={{ required: "Role Name is required" }}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Description</label>
                <FormInput
                  type="text"
                  name="description"
                  placeholder="Role description"
                  register={register}
                  errors={errors}
                />
              </div>

              <div>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">
                  Permissions
                </h3>
                <div className="overflow-hidden rounded-xl border">
                  <PermissionTable modules={modules} register={register} errors={errors} />
                </div>
              </div>
            </fieldset>

            <div className="flex items-center justify-between border-t px-8 py-5">
              <div>
                {isEditing && !isLocked && (
                  <button
                    type="button"
                    onClick={onDelete}
                    className="text-sm font-semibold text-red-600 hover:text-red-700"
                  >
                    Delete Role
                  </button>
                )}
              </div>

              <div className="flex gap-3">
                <Button type="button" text="Cancel" variant="secondary" onClick={onClose} />
                {!isLocked && (
                  <Button
                    type="submit"
                    text={isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Save Role"}
                  />
                )}
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default CreateRoleModal;