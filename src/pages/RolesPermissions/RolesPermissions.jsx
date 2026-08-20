import { useEffect, useState } from "react";
import { toast } from "sonner";

import Button from "../../components/ui/Button";
import RoleCard from "../../components/ui/RoleCard";
import CreateRoleModal from "../../components/ui/CreateRoleModal";

import { useAuth } from "../../context/useAuth";

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

  // =====================================
  // CURRENT LOGGED-IN USER
  // =====================================
  const { user } = useAuth();

  // =====================================
  // FETCH ALL ROLES
  // =====================================
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

  // =====================================
  // LOAD ROLES
  // =====================================
  useEffect(() => {
    const loadRoles = async () => {
      await fetchRoles();
    };

    loadRoles();
  }, []);

  // =====================================
  // CREATE NEW ROLE
  // =====================================
  const handleNewRoleClick = () => {
    setEditingRole(null);
    setSaveError("");
    setOpenModal(true);
  };

  // =====================================
  // OPEN ROLE
  // =====================================
  const handleCardClick = async (roleStub) => {
    if (!roleStub?._id) return;

    // =====================================
    // SUPER ADMIN CANNOT BE OPENED
    // =====================================
    const roleName = String(
      roleStub?.roleName || ""
    )
      .toLowerCase()
      .trim();

    if (
      roleName === "super admin" ||
      roleName === "superadmin"
    ) {
      toast.info(
        "Super Admin role cannot be edited."
      );

      return;
    }

    // =====================================
    // OPEN OTHER ROLES
    // =====================================
    setSaveError("");
    setLoadingRole(true);
    setOpenModal(true);
    setEditingRole(null);

    try {
      const res = await getRole(roleStub._id);

      const roleData =
        res.data?.data || res.data;

      setEditingRole(roleData);
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

  // =====================================
  // SAVE ROLE
  // =====================================
  const handleSaveRole = async (payload) => {
    setSaveError("");

    try {
      if (editingRole?._id) {
        await updateRole(
          editingRole._id,
          payload
        );

        toast.success(
          "Role updated successfully"
        );
      } else {
        await createRole(payload);

        toast.success(
          "Role created successfully"
        );
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
        "Role didn't save. Try again";

      setSaveError(message);
      toast.error(message);
    }
  };

  // =====================================
  // DELETE ROLE
  // =====================================
  const handleDeleteRole = (roleToDelete) => {
    const targetId =
      roleToDelete?._id ||
      editingRole?._id;

    const roleName = String(
      roleToDelete?.roleName ||
        editingRole?.roleName ||
        "this role"
    )
      .toLowerCase()
      .trim();

    if (!targetId) return;

    // =====================================
    // SUPER ADMIN CANNOT BE DELETED
    // =====================================
    if (
      roleName === "super admin" ||
      roleName === "superadmin"
    ) {
      toast.info(
        "Super Admin role cannot be deleted."
      );

      return;
    }

    toast.warning(
      `Are you sure you want to delete "${roleToDelete?.roleName || editingRole?.roleName || "this role"}"? This action cannot be undone.`,
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

              toast.success(
                "Role deleted successfully"
              );
            } catch (error) {
              console.log(
                "DELETE ROLE ERROR:",
                error.response?.data ||
                  error.message
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

      {/* =====================================
          PAGE HEADER
      ===================================== */}
      <div className="mb-5 flex items-center justify-between font-semibold">

        <div>
          <h1 className="float-left gap-1 text-2xl">
            Roles & Permissions
          </h1>

          <p className="mt-9 flex text-sm text-gray-400">
            Control what each role can view, create,
            edit and delete.
          </p>
        </div>

        <Button
          text="+ New Role"
          onClick={handleNewRoleClick}
        />

      </div>

      {/* =====================================
          ROLE CARDS
      ===================================== */}
      <div className="grid grid-cols-1 gap-6 text-left md:grid-cols-3">

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

      {/* =====================================
          ROLE MODAL
      ===================================== */}
      {openModal && (
        <CreateRoleModal
          isOpen={openModal}
          role={editingRole}
          loading={loadingRole}
          currentUser={user}

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