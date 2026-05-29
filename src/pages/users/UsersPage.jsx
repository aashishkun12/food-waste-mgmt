import { useEffect, useState } from "react";

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

  // fake API fetch
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

  // change role (local only)
  const handleRoleChange = (userId, role) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, role } : u
      )
    );
  };

  // toggle status (local only)
  const toggleStatus = (userId) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, active: !u.active }
          : u
      )
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">
        Users Management
      </h2>

      {loading ? (
        <p className="text-gray-500">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3 border-b">Username</th>
                <th className="p-3 border-b">Email</th>
                <th className="p-3 border-b">Role</th>
                <th className="p-3 border-b">Status</th>
                <th className="p-3 border-b">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50"
                >
                  <td className="p-3 border-b">
                    {user.username}
                  </td>

                  <td className="p-3 border-b">
                    {user.email}
                  </td>

                  <td className="p-3 border-b">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(
                          user.id,
                          e.target.value
                        )
                      }
                      className="border rounded px-2 py-1 text-sm"
                    >
                      {roleOptions.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="p-3 border-b">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        user.active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.active
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </td>

                  <td className="p-3 border-b">
                    <button
                      onClick={() =>
                        toggleStatus(user.id)
                      }
                      className={`px-3 py-1 text-sm rounded text-white ${
                        user.active
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {user.active
                        ? "Deactivate"
                        : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsersPage;