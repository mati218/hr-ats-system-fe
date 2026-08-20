import { useEffect, useState } from "react";
import Table from "../../components/ui/Table";
import NewUserModal from "./NewUserModal";

import { getUsers } from "../../lib/api/authApi";

const UserManagement = () => {
  const [selectedUser, setSelectedUser] =
    useState(null);

  const [showModal, setShowModal] =
    useState(false);

  const [users, setUsers] = useState([]);

  const [pendingInvites, setPendingInvites] =
    useState(0);

  const loadUsers = async () => {
    try {
      const response = await getUsers();

      const fetchedUsers =
        response.data?.data;

      const usersData =
        Array.isArray(fetchedUsers)
          ? fetchedUsers
          : [];

      setUsers(usersData);

      setPendingInvites(
        response.data?.pendingInvites ?? 0
      );
    } catch (error) {
      console.log(
        error.response?.data
      );

      setUsers([]);
      setPendingInvites(0);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await loadUsers();
    };

    initialize();
  }, []);

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
          <h2 className="text-2xl ml-7 mt-6 font-semibold text-gray-900">
            User Management
          </h2>

          <p className="text-gray-500 ml-7 text-sm">
            {users.length} internal users •{" "}
            {pendingInvites} pending invites
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedUser(null);
            setShowModal(true);
          }}
          className="bg-blue-700 mr-9 hover:bg-blue-800 text-white font-semibold px-3 py-1 rounded-xl shadow-sm transition"
        >
          + New User
        </button>
      </div>

      <div className="mx-8 bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <Table
          columns={columns}
          data={users}
          onEdit={(user) => {
            setSelectedUser(user);
            setShowModal(true);
          }}
        />
      </div>

      <NewUserModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedUser(null);
        }}
        onCreated={loadUsers}
        user={selectedUser}
      />
    </>
  );
};

export default UserManagement;