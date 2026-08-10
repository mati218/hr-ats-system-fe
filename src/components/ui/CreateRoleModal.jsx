import { Lock } from "lucide-react";
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

function CreateRoleModal({ isOpen, onClose, onSave, errorMessage, role, loading }) {
  const isEditing = Boolean(role?._id);
  const isLocked = isEditing && role?.isSystemRole === true; // sirf SuperAdmin — name+description lock

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
    const permissions = modules.map((module) => ({
      module: module.key,
      view: data.permissions?.[module.key]?.view || false,
      create: data.permissions?.[module.key]?.create || false,
      edit: data.permissions?.[module.key]?.edit || false,
      delete: data.permissions?.[module.key]?.delete || false,
    }));

    const payload = isEditing
      ? { description: data.description, permissions }
      : { roleName: data.roleName, description: data.description, permissions };

    await onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-225 rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-gray-200 px-8 py-6">
          <div className="text-left">
            <h2 className="text-3xl font-bold text-slate-900">
              {isEditing ? "Edit Role" : "Create Role"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {loading
                ? "Loading role data..."
                : isLocked
                ? "This is a protected system role. Name and description are fixed, but permissions can still be updated."
                : isEditing
                ? "Update the description and module-level permissions"
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
            <div className="space-y-6 px-8 py-6 text-left">
              {errorMessage && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {errorMessage}
                </div>
              )}

            {isLocked && (
  <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
    <Lock className="h-4 w-4 flex-shrink-0" />
    <span>
      {role.roleName} is a protected system role — name and description are fixed, but you can still update its permissions.
    </span>
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
                  disabled={isEditing} // kisi bhi role ki naam edit me change nahi hoti
                  rules={{ required: "Role Name is required" }}
                />
                {isEditing && (
                  <p className="mt-1 text-xs text-slate-400">Role name cannot be changed after creation.</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Description</label>
                <FormInput
                  type="text"
                  name="description"
                  placeholder="Role description"
                  register={register}
                  errors={errors}
                  disabled={isLocked} // sirf SuperAdmin ke liye description disabled
                  rules={{ required: "Description is required" }}
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
            </div>

            <div className="flex justify-end gap-3 border-t px-8 py-5">
              <Button type="button" text="Cancel" variant="secondary" onClick={onClose} />
              <Button
                type="submit"
                text={isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Save Role"}
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default CreateRoleModal;