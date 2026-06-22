import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiHome, FiUsers, FiTrash2, FiMapPin, FiBarChart2, FiUserCheck, FiLogOut, FiSettings } from "react-icons/fi";

const ICONS = {
  Dashboard:    FiHome,
  Donors:       FiUsers,
  "Waste Items": FiTrash2,
  Centers:      FiMapPin,
  Processors:   FiSettings,
  Reports:      FiBarChart2,
  Users:        FiUserCheck,
};

const ROLE_STYLES = {
  ROLE_ADMIN:    "bg-purple-500/20 text-purple-200",
  ROLE_OPERATOR: "bg-blue-500/20 text-blue-200",
  ROLE_DONOR:    "bg-green-500/20 text-green-200",
};

const MENU_ITEMS = {
  ROLE_ADMIN: [
    { name: "Dashboard",   path: "/dashboard" },
    { name: "Donors",      path: "/donors" },
    { name: "Waste Items", path: "/waste" },
    { name: "Centers",     path: "/centers" },
    { name: "Processors",  path: "/processors" },
    { name: "Reports",     path: "/reports" },
    { name: "Users",       path: "/users" },
  ],
  ROLE_OPERATOR: [
    { name: "Dashboard",   path: "/dashboard" },
    { name: "Donors",      path: "/donors" },
    { name: "Waste Items", path: "/waste" },
    { name: "Centers",     path: "/centers" },
    { name: "Processors",  path: "/processors" },
    { name: "Reports",     path: "/reports" },
  ],
  ROLE_DONOR: [
    { name: "Dashboard", path: "/dashboard" },
  ],
};

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // ── Read from localStorage ──
  const token       = localStorage.getItem("wfms_token");
  const currentUser = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const username    = currentUser?.sub;
  const role        = localStorage.getItem("wfms_role");

  const handleLogout = () => {
    localStorage.removeItem("wfms_token");
    localStorage.removeItem("wfms_role");
    setShowLogoutModal(false);
    navigate("/");
  };

  return (
    <>
      <div className="w-64 h-screen sticky top-0 bg-green-900 text-white p-5 flex flex-col justify-between overflow-y-auto">
        <div>
          {/* Brand */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">🌱</span>
            <h1 className="text-xl font-bold">Food Waste</h1>
          </div>

          {/* User info */}
          {username && (
            <div className="mb-6 pb-4 border-b border-green-700/60">
              <p className="text-sm font-medium truncate">{username}</p>
              <span className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${ROLE_STYLES[role] || "bg-white/10 text-white"}`}>
                {role}
              </span>
            </div>
          )}

          {/* Nav */}
          <nav className="flex flex-col gap-1">
            {MENU_ITEMS[role]?.map((item) => {
              const Icon     = ICONS[item.name];
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                    isActive ? "bg-green-700 text-white font-medium" : "text-green-100 hover:bg-green-800 hover:text-white"
                  }`}
                >
                  {Icon && <Icon size={16} />}
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center justify-center gap-2 bg-red-500/90 hover:bg-red-600 text-sm p-2 rounded-lg mt-10 transition"
        >
          <FiLogOut size={16} />
          Logout
        </button>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm mx-4 rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                <FiLogOut className="text-red-600" size={28} />
              </div>
            </div>
            <h2 className="mt-4 text-center text-xl font-semibold text-gray-900">Confirm Logout</h2>
            <p className="mt-2 text-center text-sm text-gray-500">Are you sure you want to log out?</p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-white font-medium hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;