import { useEffect, useState } from "react";
import Table from "../../components/ui/Table";
import StatCard from "../../components/ui/StatCard";
import ToggleStatusModal from "./ToggleStatusModal";

const ROLE_OPTIONS = ["ADMIN", "OPERATOR", "DONOR"];

const DUMMY_USERS = [
  { id: 1, username: "john_doe", email: "john@example.com", role: "DONOR", active: true },
  { id: 2, username: "alice_smith", email: "alice@example.com", role: "OPERATOR", active: false },
  { id: 3, username: "mike_johnson", email: "mike@example.com", role: "DONOR", active: true },
  { id: 4, username: "admin_user", email: "admin@example.com", role: "ADMIN", active: true },
];

const UsersPage = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusTarget, setStatusTarget] = useState(null);

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
    if (userId === currentUser?.id) return;
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
  };

  const requestStatusChange = (user) => {
    if (user.id === currentUser?.id) return;
    setStatusTarget(user);
  };

  const confirmStatusChange = () => {
    setUsers((prev) =>
      prev.map((u) => (u.id === statusTarget.id ? { ...u, active: !u.active } : u))
    );
    setStatusTarget(null);
  };

  // ── summary stats ──
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.active).length;
  const inactiveUsers = totalUsers - activeUsers;
  const adminCount = users.filter((u) => u.role === "ADMIN").length;

  const filteredUsers = users.filter((u) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return u.username.toLowerCase().includes(term) || u.email.toLowerCase().includes(term);
  });

  const columns = [
    { key: "username", label: "Username", width: "w-1/5" },
    { key: "email", label: "Email", width: "w-1/4" },
    {
      key: "role",
      label: "Role",
      width: "w-1/5",
      render: (user) => (
        <select
          value={user.role}
          disabled={user.id === currentUser?.id}
          onChange={(e) => handleRoleChange(user.id, e.target.value)}
          className="border rounded px-2 py-1 text-sm w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          {ROLE_OPTIONS.map((role) => (
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
            user.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
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
          onClick={() => requestStatusChange(user)}
          disabled={user.id === currentUser?.id}
          className={`w-28 px-3 py-1 text-sm rounded text-white disabled:opacity-50 disabled:cursor-not-allowed ${
            user.active ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {user.active ? "Deactivate" : "Activate"}
        </button>
      ),
    },
  ];

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Users Management</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage user roles and account access
          </p>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by username or email..."
          className="border border-gray-300 rounded px-3 py-2 text-sm w-64 focus:outline-none focus:border-green-500"
        />
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Users" value={totalUsers} icon="👥" color="blue" />
        <StatCard label="Active" value={activeUsers} icon="✅" color="green" />
        <StatCard label="Inactive" value={inactiveUsers} icon="🚫" color="yellow" />
        <StatCard label="Admins" value={adminCount} icon="🛡️" color="blue" />
      </div>

      {loading ? (
        <p className="text-gray-500">Loading users...</p>
      ) : filteredUsers.length === 0 ? (
        <p className="text-gray-500 text-sm">No users match your search.</p>
      ) : (
        <Table columns={columns} data={filteredUsers} />
      )}

      <ToggleStatusModal
        open={!!statusTarget}
        user={statusTarget}
        onClose={() => setStatusTarget(null)}
        onConfirm={confirmStatusChange}
      />
    </div>
  );
};

export default UsersPage;