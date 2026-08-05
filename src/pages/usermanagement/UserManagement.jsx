import { useState } from "react";
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
  <div className="p-6 bg-gray-50 min-h-screen">
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">
          User Management
        </h2>

        <p className="text-gray-500 mt-1">
          18 internal users • 3 pending invites
        </p>
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-sm transition"
      >
        + New User
      </button>
    </div>

    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
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
      user={selectedUser}
    />
  </div>
);
};


export default UserManagement;