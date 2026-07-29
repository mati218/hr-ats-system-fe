import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../../components/ui/Button";
import RoleCard from "../../components/ui/RoleCard";
import PermissionTable from "../../components/ui/PermissionTable";
import CreateRoleModal from "../../components/ui/CreateRoleModal";
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
} from "../../lib/api/authroleApi";
const modules = [
    { label: "Job Requisitions", key: "jobRequisitions" },
    { label: "Candidates", key: "candidates" },
    { label: "Interviews", key: "interviews" },
    { label: "Offer Letters", key: "offerLetters" },
    { label: "Users", key: "users" },
    { label: "Reports", key: "reports" },
  ];
function RolesPermissions() {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const fetchRoles = async () => {
    try {
      console.log("Fetching Roles...");
      const res = await getRoles();
      console.log("API Response:", res);

      if (res.data?.length > 0) {
        setRoles(res.data);
        setSelectedRole(res.data[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Jab bhi selectedRole change ho, form ki values ko update/reset karein
  useEffect(() => {
    if (selectedRole) {
      reset({
        permissions: selectedRole.permissions || [],
      });
    }
  }, [selectedRole, reset]);

  const handleCreateRole = async (data) => {
    try {
      console.log("CREATE DATA:", data);
      const res = await createRole(data);
      console.log("CREATE RESPONSE:", res);
      await fetchRoles();
      setOpenModal(false);
    } catch (error) {
      console.log(
        "CREATE ERROR:",
        error.response?.data || error.message
      );
    }
  };

  const modules = [
    "Job Requisitions",
    "Candidates",
    "Interviews",
    "Offer Letters",
    "Users",
    "Reports",
  ];

  const onSubmit = async (data) => {
    try {
      console.log("FORM DATA:", data);
      const response = await updateRole(
        selectedRole._id,
        data
      );
      console.log("API RESPONSE:", response);
      // Optional: Aap yahan dobara fetchRoles() call kar saktay hain taake updated data refresh ho jaye
    } catch (error) {
      console.log(
        "API ERROR:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-10">
      {/* Header */}
      <div className="mt-6 mb-6 flex items-start justify-between">
        <div className="text-left">
          <h1 className="text-2xl font-bold text-slate-900">
            Roles & Permissions
          </h1>
          <p className="mt-1 text-slate-500">
            Control what each role can view, create, edit or delete.
          </p>
        </div>

        <Button
          text="+ New Role"
          onClick={() => setOpenModal(true)}
        />
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {roles.map((role) => (
          <RoleCard
            key={role._id}
            role={role}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
          />
        ))}
      </div>

      {/* Permission Table */}
      <div className="mt-6 rounded-2xl ">
        <h2 className="text-left text-xl font-bold text-slate-900">
          Permission Matrix
        </h2>
        <p className="mb-6 mt-2 text-left text-slate-500">
          Toggle module-level access. Changes apply immediately to all users with this role.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <PermissionTable
            modules={modules}
            register={register}
            errors={errors}
          />
        </form>
      </div>

      <CreateRoleModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleCreateRole}
      />
    </div>
  );
}

export default RolesPermissions;