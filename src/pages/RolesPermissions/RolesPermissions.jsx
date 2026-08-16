import { useEffect, useState } from "react";
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
      const roleData = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setRoles(roleData);
      return roleData;
    } catch (error) {
      console.log("FETCH ROLES ERROR:", error.response?.data || error.message);
      return [];
    }
  };

  useEffect(() => {
    fetchRoles();
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
      console.log("GET ROLE ERROR:", error.response?.data || error.message);
      setSaveError("Role ka data load nahi ho saka.");
    } finally {
      setLoadingRole(false);
    }
  };

  const handleSaveRole = async (payload) => {
    setSaveError("");
    try {
      if (editingRole?._id) {
        await updateRole(editingRole._id, payload);
      } else {
        await createRole(payload);
      }
      await fetchRoles();
      setOpenModal(false);
      setEditingRole(null);
    } catch (error) {
      console.log("SAVE ROLE ERROR:", error.response?.data || error.message);
      setSaveError(
        error.response?.data?.message || "Role save nahi hua, dobara try karein."
      );
    }
  };

 const handleDeleteRole = async (roleToDelete) => {
  const targetId = roleToDelete?._id || editingRole?._id;
  if (!targetId) return;

  setSaveError("");
  try {
    await deleteRole(targetId);
    await fetchRoles();
    setOpenModal(false);
    setEditingRole(null);
  } catch (error) {
    console.log("DELETE ROLE ERROR:", error.response?.data || error.message);
    alert(
      error.response?.data?.message || "Role delete nahi hua, dobara try karein."
    );
  }
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