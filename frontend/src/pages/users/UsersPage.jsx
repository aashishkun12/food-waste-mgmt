import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PaginatedTable from "../../components/ui/PaginatedTable";
import StatCard from "../../components/ui/StatCard";
import ToggleStatusModal from "./ToggleStatusModal";
import UserDetailsModal from "./UserDetailsModal";
import { hasRole } from "../../utils/auth";
import { getUsers, updateUserDetails, updateUserStatus } from "../../utils/userApi";

const getDisplayRole = (user) => {
  const rawRole = user?.roles?.[0]?.role ?? user?.roles?.[0] ?? user?.role ?? "ROLE_DONOR";
  const roleValue = typeof rawRole === "string" ? rawRole : rawRole?.role ?? "ROLE_DONOR";
  return String(roleValue).replace(/^ROLE_/i, "").toUpperCase();
};

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusTarget, setStatusTarget] = useState(null);
  const [detailsTarget, setDetailsTarget] = useState(null);

  const navigate = useNavigate();
  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();
  const isAdmin = hasRole("ROLE_ADMIN");

  useEffect(() => {
    if (!isAdmin) {
      navigate("/dashboard");
    }
  }, [isAdmin, navigate]);

  const loadUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const userData = await getUsers();
      setUsers(userData || []);
    } catch (requestError) {
      setError(requestError.message || "Unable to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) loadUsers();
  }, [isAdmin]);

  const confirmStatusChange = async () => {
    try {
      const updated = await updateUserStatus(statusTarget.id, !statusTarget.active);
      setUsers((previous) => previous.map((item) => item.id === statusTarget.id ? updated : item));
      setStatusTarget(null);
    } catch (requestError) {
      setError(requestError.message || "Unable to update user status.");
    }
  };

  const saveUserDetails = async (userId, details) => {
    const updated = await updateUserDetails(userId, details);
    setUsers((previous) => previous.map((item) => item.id === userId ? updated : item));
    setDetailsTarget(updated);
  };

  if (!isAdmin) return null;

  const filteredUsers = users.filter((user) => {
    const term = search.trim().toLowerCase();
    const matchesSearch = !term || user.username.toLowerCase().includes(term) || user.email.toLowerCase().includes(term);
    const matchesRole = roleFilter === "ALL" || getDisplayRole(user) === roleFilter;
    return matchesSearch && matchesRole;
  });
  const activeUsers = users.filter((user) => user.active).length;
  const adminCount = users.filter((user) => getDisplayRole(user) === "ADMIN").length;

  const columns = [
    { key: "username", label: "Username", width: "w-32" },
    { key: "email", label: "Email", width: "w-64" },
    {
      key: "roles",
      label: "Role",
      width: "w-36",
      render: (user) => <span className="text-sm font-medium text-gray-700">{getDisplayRole(user)}</span>,
    },
    {
      key: "active",
      label: "Status",
      width: "w-24",
      render: (user) => <span className={`inline-flex items-center justify-center w-20 px-2 py-1 text-xs font-semibold rounded-full ${user.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{user.active ? "Active" : "Inactive"}</span>,
    },
    {
      key: "actions",
      label: "Actions",
      width: "w-44",
      render: (user) => (
        <div className="flex flex-wrap gap-1">
          <button onClick={() => setDetailsTarget(user)} className="px-2 py-1 text-xs rounded bg-blue-500 text-white hover:bg-blue-600">View</button>
          <button
            onClick={() => setStatusTarget(user)}
            disabled={user.id === currentUser?.id}
            className={`px-2 py-1 text-xs rounded text-white disabled:opacity-50 disabled:cursor-not-allowed ${user.active ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
          >
            {user.active ? "Deactivate" : "Activate"}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Users Management</h2>
          <p className="text-sm text-gray-500 mt-1">Manage all system users, roles, and account access</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search username or email" className="border border-gray-300 rounded px-3 py-2 text-sm w-64 focus:outline-none focus:border-green-500" />
          <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} aria-label="Filter users by role" className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-green-500">
            <option value="ALL">All roles</option>
            <option value="ADMIN">Admins</option>
            <option value="OPERATOR">Operators</option>
            <option value="DONOR">Donors</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Users" value={users.length} icon="👥" color="blue" />
        <StatCard label="Active" value={activeUsers} icon="✅" color="green" />
        <StatCard label="Inactive" value={users.length - activeUsers} icon="🚫" color="yellow" />
        <StatCard label="Admins" value={adminCount} icon="🛡️" color="blue" />
      </div>

      {error && <div className="mb-4 flex items-center justify-between rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"><span>{error}</span><button onClick={loadUsers} className="font-semibold underline">Retry</button></div>}
      {loading ? <p className="text-gray-500">Loading users...</p> : <PaginatedTable columns={columns} data={filteredUsers} pageSize={8} />}

      <ToggleStatusModal open={!!statusTarget} user={statusTarget} onClose={() => setStatusTarget(null)} onConfirm={confirmStatusChange} />
      <UserDetailsModal
        user={detailsTarget}
        onClose={() => setDetailsTarget(null)}
        onSave={saveUserDetails}
      />
    </div>
  );
};

export default UsersPage;
