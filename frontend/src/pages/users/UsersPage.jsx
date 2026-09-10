import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/ui/Table";
import StatCard from "../../components/ui/StatCard";
import ToggleStatusModal from "./ToggleStatusModal";
import { getCurrentRole, hasRole } from "../../utils/auth";
import { getUsers, updateUserRoles, updateUserStatus } from "../../utils/userApi";

const ROLE_OPTIONS = ["ADMIN", "OPERATOR", "DONOR"];

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
  const [statusTarget, setStatusTarget] = useState(null);
  const [roleTarget, setRoleTarget] = useState(null);
  const [pendingRole, setPendingRole] = useState("");

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
      setUsers(await getUsers() || []);
    } catch (requestError) {
      setError(requestError.message || "Unable to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) loadUsers();
  }, [isAdmin]);

  const handleRoleChangeRequest = (user, role) => {
    if (user.id === currentUser?.id || getDisplayRole(user) === role) return;
    setRoleTarget(user);
    setPendingRole(role);
  };

  const confirmRoleChange = async () => {
    if (!roleTarget) return;
    try {
      const updated = await updateUserRoles(roleTarget.id, pendingRole);
      setUsers((previous) => previous.map((item) => item.id === roleTarget.id ? updated : item));
      setRoleTarget(null);
      setPendingRole("");
    } catch (requestError) {
      setError(requestError.message || "Unable to update user role.");
    }
  };

  const confirmStatusChange = async () => {
    try {
      const updated = await updateUserStatus(statusTarget.id, !statusTarget.active);
      setUsers((previous) => previous.map((item) => item.id === statusTarget.id ? updated : item));
      setStatusTarget(null);
    } catch (requestError) {
      setError(requestError.message || "Unable to update user status.");
    }
  };

  if (!isAdmin) return null;

  const filteredUsers = users.filter((user) => {
    const term = search.trim().toLowerCase();
    return !term || user.username.toLowerCase().includes(term) || user.email.toLowerCase().includes(term);
  });
  const activeUsers = users.filter((user) => user.active).length;
  const adminCount = users.filter((user) => getDisplayRole(user) === "ADMIN").length;

  const columns = [
    { key: "username", label: "Username" },
    { key: "email", label: "Email" },
    {
      key: "roles",
      label: "Role",
      render: (user) => (
        <select
          value={getDisplayRole(user)}
          disabled={user.id === currentUser?.id}
          onChange={(event) => handleRoleChangeRequest(user, event.target.value)}
          className="border rounded px-2 py-1 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          {ROLE_OPTIONS.map((role) => <option key={role} value={role}>{role}</option>)}
        </select>
      ),
    },
    {
      key: "active",
      label: "Status",
      render: (user) => <span className={`inline-flex items-center justify-center w-20 px-2 py-1 text-xs font-semibold rounded-full ${user.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{user.active ? "Active" : "Inactive"}</span>,
    },
    {
      key: "actions",
      label: "Actions",
      render: (user) => (
        <button
          onClick={() => setStatusTarget(user)}
          disabled={user.id === currentUser?.id}
          className={`w-28 px-3 py-1 text-sm rounded text-white disabled:opacity-50 disabled:cursor-not-allowed ${user.active ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
        >
          {user.active ? "Deactivate" : "Activate"}
        </button>
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
        <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search username or email" className="border border-gray-300 rounded px-3 py-2 text-sm w-64 focus:outline-none focus:border-green-500" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Users" value={users.length} icon="👥" color="blue" />
        <StatCard label="Active" value={activeUsers} icon="✅" color="green" />
        <StatCard label="Inactive" value={users.length - activeUsers} icon="🚫" color="yellow" />
        <StatCard label="Admins" value={adminCount} icon="🛡️" color="blue" />
      </div>

      {error && <div className="mb-4 flex items-center justify-between rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"><span>{error}</span><button onClick={loadUsers} className="font-semibold underline">Retry</button></div>}
      {loading ? <p className="text-gray-500">Loading users...</p> : <Table columns={columns} data={filteredUsers} />}

      {roleTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-96">
            <h2 className="text-lg font-semibold">Change User Role</h2>
            <p className="mt-2 text-gray-600">
              Are you sure you want to change <span className="font-medium">{roleTarget.username}</span> from <span className="font-medium">{getDisplayRole(roleTarget)}</span> to <span className="font-medium">{pendingRole}</span>?
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => { setRoleTarget(null); setPendingRole(""); }} className="px-3 py-1 border rounded">Cancel</button>
              <button onClick={confirmRoleChange} className="px-3 py-1 rounded bg-blue-600 text-white">Confirm</button>
            </div>
          </div>
        </div>
      )}

      <ToggleStatusModal open={!!statusTarget} user={statusTarget} onClose={() => setStatusTarget(null)} onConfirm={confirmStatusChange} />
    </div>
  );
};

export default UsersPage;
