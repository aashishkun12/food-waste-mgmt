import { useEffect, useState } from "react";
import Table from "../../components/ui/Table";

const roleOptions = ["DONOR", "OPERATOR"];

const DUMMY_USERS = [
  {
    id: 1,
    username: "john_doe",
    email: "john@example.com",
    role: "DONOR",
    active: true,
  },
  {
    id: 2,
    username: "alice_smith",
    email: "alice@example.com",
    role: "OPERATOR",
    active: false,
  },
  {
    id: 3,
    username: "mike_johnson",
    email: "mike@example.com",
    role: "DONOR",
    active: true,
  },
];

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);

    setTimeout(() => {
      setUsers(DUMMY_USERS);
      setLoading(false);
    }, 800);
  };

  const handleRoleChange = (userId, role) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, role } : u
      )
    );
  };

  const toggleStatus = (userId) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, active: !u.active }
          : u
      )
    );
  };

  const columns = [
    {
      key: "username",
      label: "Username",
      width: "w-1/5",
    },
    {
      key: "email",
      label: "Email",
      width: "w-1/4",
    },
    {
      key: "role",
      label: "Role",
      width: "w-1/5",
      render: (user) => (
        <select
          value={user.role}
          onChange={(e) =>
            handleRoleChange(user.id, e.target.value)
          }
          className="border rounded px-2 py-1 text-sm w-full"
        >
          {roleOptions.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      ),
    },
    {
      key: "active",
      label: "Status",
      width: "w-32",
      render: (user) => (
        <span
          className={`inline-flex items-center justify-center w-20 px-2 py-1 text-xs font-semibold rounded-full ${
            user.active
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {user.active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      width: "w-36",
      render: (user) => (
        <button
          onClick={() => toggleStatus(user.id)}
          className={`w-28 px-3 py-1 text-sm rounded text-white ${
            user.active
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {user.active ? "Deactivate" : "Activate"}
        </button>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">
        Users Management
      </h2>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <Table columns={columns} data={users} />
      )}
    </div>
  );
};

export default UsersPage;