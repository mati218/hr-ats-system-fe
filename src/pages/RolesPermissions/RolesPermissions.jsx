import { useEffect, useState } from "react";
import { toast } from "sonner";
import Button from "../../components/ui/Button";
import RoleCard from "../../components/ui/RoleCard";
import CreateRoleModal from "../../components/ui/CreateRoleModal";

import {
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
} from "../../lib/api/authroleApi";

function RolesPermissions() {
  const [roles, setRoles] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [saveError, setSaveError] = useState("");
  const [loadingRole, setLoadingRole] = useState(false);

  const fetchRoles = async () => {
    try {
      const res = await getRoles();

      const roleData = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      setRoles(roleData);

      return roleData;
    } catch (error) {
      console.log(
        "FETCH ROLES ERROR:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
        "Failed to load roles"
      );

      return [];
    }
  };

  useEffect(() => {
    const loadRoles = async () => {
      await fetchRoles();
    };

    loadRoles();
  }, []);

  const handleNewRoleClick = () => {
    setEditingRole(null);
    setSaveError("");
    setOpenModal(true);
  };

  const handleCardClick = async (roleStub) => {
    if (!roleStub?._id) return;
    setSaveError("");
    setLoadingRole(true);
    setOpenModal(true);
    setEditingRole(null);

    try {
      const res = await getRole(roleStub._id);
      setEditingRole(res.data);
    } catch (error) {
      console.log(
        "GET ROLE ERROR:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
        "Failed to load role"
      );

      setOpenModal(false);
    } finally {
      setLoadingRole(false);
    }
  };

  const handleSaveRole = async (payload) => {
    setSaveError("");

    try {
      if (editingRole?._id) {
        await updateRole(editingRole._id, payload);

        toast.success("Role updated successfully");
      } else {
        await createRole(payload);

        toast.success("Role created successfully");
      }

      await fetchRoles();

      setOpenModal(false);
      setEditingRole(null);
    } catch (error) {
      console.log(
        "SAVE ROLE ERROR:",
        error.response?.data || error.message
      );

      const message =
        error.response?.data?.message ||
        "Role didn't save.Try again";

      setSaveError(message);
      toast.error(message);
    }
  };

  const handleDeleteRole = (roleToDelete) => {
  const targetId = roleToDelete?._id || editingRole?._id;

  const roleName =
    roleToDelete?.roleName ||
    editingRole?.roleName ||
    "this role";

  if (!targetId) return;

  toast.warning(
    `Are you sure you want to delete "${roleName}"? This action cannot be undone.`,
    {
      duration: Infinity,

      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await deleteRole(targetId);

            await fetchRoles();

            setOpenModal(false);
            setEditingRole(null);

            toast.success("Role deleted successfully");
          } catch (error) {
            console.log(
              "DELETE ROLE ERROR:",
              error.response?.data || error.message
            );

            toast.error(
              error.response?.data?.message ||
                "Failed to delete role"
            );
          }
        },
      },

      cancel: {
        label: "Cancel",
      },
    }
  );
};
  return (
    <div className="min-h-screen bg-slate-50 p-6">

      <div className="mb-5 flex  items-center justify-between font-semibold">
        <div>
          <h1 className="text-2xl  float-left gap-1">Roles & Permissions</h1>
          <p className="text-gray-400 mt-9 flex text-sm">
            Control what each role can view, create, edit and delete.
          </p>
        </div>
        <Button text="+ New Role" onClick={handleNewRoleClick} />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 text-left">
        {roles.map((role) => (
          <RoleCard
            key={role._id}
            role={role}
            selectedRole={editingRole}
            setSelectedRole={handleCardClick}
            onDelete={handleDeleteRole}
          />
        ))}
      </div>

      {openModal && (
        <CreateRoleModal
          isOpen={openModal}
          role={editingRole}
          loading={loadingRole}
          onClose={() => {
            setOpenModal(false);
            setEditingRole(null);
          }}
          onSave={handleSaveRole}
          onDelete={handleDeleteRole}
          errorMessage={saveError}
        />
      )}

    </div>
  );
}

export default RolesPermissions;