import { useEffect, useState } from "react";
import Table from "../../components/ui/Table";
import NewUserModal from "./NewUserModal";

import { getUsers } from "../../lib/api/authApi";

const UserManagement = () => {

  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);


  const loadUsers = async () => {
    try {

      const response = await getUsers();

      const fetchedUsers = response.data?.data;

      const usersData = Array.isArray(fetchedUsers)
        ? fetchedUsers
        : [];

      console.log("Users:", fetchedUsers);

      setUsers(usersData);


    } catch (error) {

      console.log(
        error.response?.data
      );

      setUsers([]);

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

          <h2 className="text-3xl ml-7 mt-8 font-bold text-gray-900">
            User Management
          </h2>

          <p className="text-gray-500 float-left ml-7 mt-1">
            18 internal users • 3 pending invites
          </p>

        </div>


        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 mr-6 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-sm transition"
        >
          + New User
        </button>

      </div>


      <div className="mx-6 bg-white rounded-2xl border border-gray-200 overflow-hidden">

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