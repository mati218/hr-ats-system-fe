import { useEffect, useState } from "react";
import Table from "../../components/ui/Table";
import NewUserModal from "./NewUserModal";

import { getUsers } from "../../lib/api/authApi";
import { useAuth } from "../../context/useAuth";

const UserManagement = () => {
  const { user } = useAuth();

  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);

  const permissions = user?.role?.permissions || [];

  const getPermission = (action) => {
    const permission = permissions.find(
      (item) => item.module === "users"
    );

    return permission?.[action] === true;
  };

  const canView = getPermission("view");
  const canCreate = getPermission("create");
  const canEdit = getPermission("edit");
  const canDelete = getPermission("delete");

  const loadUsers = async () => {
    try {
      const response = await getUsers();

      const fetchedUsers =
        response.data?.data;

      const usersData = Array.isArray(
        fetchedUsers
      )
        ? fetchedUsers
        : [];

      setUsers(usersData);
    } catch (error) {
      console.log(
        error.response?.data
      );

      setUsers([]);
    }
  };

  useEffect(() => {
    if (!canView) {
      return;
    }

    const loadTimeout = setTimeout(() => {
      void loadUsers();
    }, 0);

    return () => clearTimeout(loadTimeout);
  }, [canView]);

  if (!canView) {
    return (
      <div className="p-8">
        <h2 className="text-xl font-semibold text-gray-900">
          Access Denied
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          You do not have permission to view users.
        </p>
      </div>
    );
  }

  const columns = [
    "NAME",
    "EMAIL",
    "ROLE",
    "DEPARTMENT",
    "STATUS",
    "LAST LOGIN",
    "ACTION",
  ];

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl ml-7 mt-6 font-semibold">
            User Management
          </h2>

          <p className="text-gray-500 ml-7 text-sm">
            18 internal users • 3 pending invites
          </p>
        </div>

        {canCreate && (
          <button
            type="button"
            onClick={() => {
              setSelectedUser(null);
              setShowModal(true);
            }}
            className="bg-blue-700 mr-9 hover:bg-blue-800 text-white font-semibold px-3 py-1 rounded-xl shadow-sm transition"
          >
            + New User
          </button>
        )}
      </div>

      <div className="mx-8 bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <Table
          columns={columns}
          data={users}
          canEdit={canEdit}
          canDelete={canDelete}
          onEdit={(selected) => {
            setSelectedUser(selected);
            setShowModal(true);
          }}
          onDelete={(selected) => {
            console.log(
              "Delete user:",
              selected
            );
          }}
        />
      </div>

      {canCreate || canEdit ? (
        <NewUserModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedUser(null);
          }}
          onCreated={loadUsers}
          user={selectedUser}
        />
      ) : null}
    </>
  );
};

export default UserManagement;