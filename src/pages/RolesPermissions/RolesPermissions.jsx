import { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import RoleCard from "../../components/ui/RoleCard";
import CreateRoleModal from "../../components/ui/CreateRoleModal";

import {
  getRoles,
  getRole,
  createRole,
  updateRole,
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

  // Exact (case-sensitive) match — duplicate/fuzzy-named roles se bachne ke liye
  const findExact = (name) => roles.find((r) => r.roleName === name);

  const superAdmin = findExact("SuperAdmin");
  const recruiter = findExact("Recruiter");
  const interviewer = findExact("Interviewer");
  const fixedIds = [superAdmin?._id, recruiter?._id, interviewer?._id].filter(Boolean);
  const otherRoles = roles.filter((r) => !fixedIds.includes(r._id));

  const handleNewRoleClick = () => {
    setEditingRole(null);
    setSaveError("");
    setOpenModal(true);
  };

  // Card click par local array pe bharosa nahi — seedha DB se latest/exact data lo
  const handleCardClick = async (roleStub) => {
    if (!roleStub?._id) {
      console.warn("Ye fixed role DB me nahi mila — roleName check karo.");
      return;
    }
    setSaveError("");
    setLoadingRole(true);
    setOpenModal(true);
    setEditingRole(null); // purana data flash na ho, jab tak fresh na aaye

    try {
      const res = await getRole(roleStub._id);
      const freshRole = res.data;
      setEditingRole(freshRole);
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

  return (
    <div className="min-h-screen bg-slate-50 p-6">

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Roles & Permissions</h1>
          <p className="text-gray-500 mt-2 pl-10">
            Control what each role can view, create, edit and delete.
          </p>
        </div>
        <Button text="+ New Role" onClick={handleNewRoleClick} />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 text-left">

        <div
          onClick={() => handleCardClick(superAdmin)}
          className={`cursor-pointer rounded-2xl border bg-white p-6 shadow-sm transition-all duration-150 hover:shadow-md
            ${editingRole?._id === superAdmin?._id ? "border-violet-500 shadow" : "border-slate-200 hover:border-violet-300"}`}
        >
          <span className="inline-flex rounded-full bg-violet-100 px-3 py-1 text-sm font-semibold text-violet-700">
            Super Admin
          </span>
          <p className="mt-4 text-base text-slate-600">Full system access · 1 user</p>
        </div>

        <div
          onClick={() => handleCardClick(recruiter)}
          className="cursor-pointer rounded-2xl border bg-white p-6 justify-left shadow-sm transition-all duration-150 hover:shadow-md border-slate-200 hover:border-blue-300"
        >
          <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
            Recruiter / HR Manager
          </span>
          <p className="mt-4 text-base text-slate-600">Jobs, candidates, interviews, offers · 2 users</p>
        </div>

        <div
          onClick={() => handleCardClick(interviewer)}
          className="cursor-pointer rounded-2xl border bg-white p-6 shadow-sm transition-all duration-150 hover:shadow-md border-slate-200 hover:border-amber-300"
        >
          <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
            Interviewer
          </span>
          <p className="mt-4 text-base text-slate-600">Assigned interviews & feedback only · 1 user</p>
        </div>

      </div>

      {otherRoles.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">
            Other Roles
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 text-left">
            {otherRoles.map((role) => (
              <RoleCard
                key={role._id}
                role={role}
                selectedRole={editingRole}
                setSelectedRole={handleCardClick}
              />
            ))}
          </div>
        </div>
      )}

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
          errorMessage={saveError}
        />
      )}

    </div>
  );
}

export default RolesPermissions;