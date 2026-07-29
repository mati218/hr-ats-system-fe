import React, { useState } from "react";
import Table from "../../components/ui/Table";
import NewUserModal from "./NewUserModal";


const users = [
  {
    _id: "6a6910bbbb30171f36e8bdfe",
    avatar: "SA",
    name: "Super Admin",
    email: "superadmin@gmail.com",
    role: "Super Admin",
    department: "-",
    status: "Active",
    lastLogin: "Today - 09:14",
  },
  {
    _id: "6a6910bbbb30171f36e8bdff",
    avatar: "AK",
    name: "Ayesha Khan",
    email: "recruiter@gmail.com",
    role: "Recruiter",
    department: "Talent Acquisition",
    status: "Active",
    lastLogin: "Today - 08:52",
  },
  {
    _id: "6a6910bbbb30171f36e8be01",
    avatar: "ZR",
    name: "Zehshan Raza",
    email: "interviewer@gmail.com",
    role: "Interviewer",
    department: "Engineering",
    status: "Active",
    lastLogin: "Yesterday",
  },
  {
    _id: "6a6910bbbb30171f36e8bdff",
    avatar: "SF",
    name: "Sana Farooq",
    email: "sana.f@gmail.com",
    role: "Recruiter",
    department: "Design",
    status: "Invited",
    lastLogin: "-",
  },
];

const UserManagement = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
    <div className="space-y-4  p-6">

      <div className="flex justify-between items-center mb-6">

        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            User Management
          </h2>

          <p className="text-md text-gray-500">
            Manage users, roles, and account status.
          </p>
        </div>


        <button
          onClick={() => setShowModal(true)}
          className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-4 py-2 rounded-lg font-semibold"
        >
          + New User
        </button>

      </div>

     <Table
  columns={columns}
  data={users}
  onEdit={(user) => {
    setSelectedUser(user);
    setShowModal(true);
  }}
/>

      <NewUserModal
      isOpen={showModal}
     onClose={() => {
    setShowModal(false);
    setSelectedUser(null);
  }}
  user={selectedUser}
  />
</div>

  );
};


export default UserManagement;