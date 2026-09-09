import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiTrash2, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import DonorFormModal from "../donors/DonorFormModal";
import api from "../../utils/api";
import { createDonor, getDonors } from "../../utils/donorApi";
import { getCenters } from "../../utils/centerApi";

const ROLE_STYLES = {
  ROLE_ADMIN:    "bg-purple-100 text-purple-700",
  ROLE_OPERATOR: "bg-blue-100 text-blue-700",
  ROLE_DONOR:    "bg-green-100 text-green-700",
};

const isToday = (dateString) => {
  if (!dateString) return false;
  const d = new Date(dateString);
  const today = new Date();
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth()    === today.getMonth() &&
    d.getDate()     === today.getDate()
  );
};

const isProcessedToday = (item) => {
  if (!item.processed) return false;
  return isToday(item.processedAt || item.createdAt);
};

const RoleBadge = ({ role }) => (
  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${ROLE_STYLES[role] || "bg-gray-100 text-gray-700"}`}>
    {role}
  </span>
);

const Dashboard = () => {
  const navigate = useNavigate();

  // ── Read from localStorage ──
  const token = localStorage.getItem("wfms_token");
  const currentUser = token ? (() => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  })() : null;
  const username    = currentUser?.sub;
  const role        = localStorage.getItem("wfms_role");  // "ROLE_ADMIN" | "ROLE_OPERATOR" | "ROLE_DONOR"

  const [donors, setDonors] = useState([]);
  const [centers, setCenters] = useState([]);
  const [wasteItems, setWasteItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddDonor, setShowAddDonor] = useState(false);

  useEffect(() => {
    if (role === "ROLE_DONOR") {
      setLoading(false);
      return undefined;
    }

    const loadDashboard = async () => {
      setLoading(true);
      setError("");
      try {
        const [donorData, centerData, wasteData] = await Promise.all([
          getDonors(),
          getCenters(),
          api.get("/api/food-waste-items"),
        ]);
        setDonors(donorData || []);
        setCenters(centerData || []);
        setWasteItems(wasteData || []);
      } catch (requestError) {
        setError(requestError.message || "Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [role]);

  const handleAddDonor = async (payload) => {
    const created = await createDonor(payload);
    setDonors((prev) => [...prev, created]);
    setShowAddDonor(false);
  };

  const totalDonors        = donors.length;
  const totalWasteToday    = wasteItems.filter((i) => isToday(i.createdAt)).length;
  const itemsProcessedToday = wasteItems.filter(isProcessedToday).length;
  const centersNearCapacity = centers.filter((c) => {
    const maxCapacity = Number(c.maxCapacityKg || 0);
    const currentLoad = Number(c.currentLoadKg || 0);
    return maxCapacity > 0 && currentLoad / maxCapacity >= 0.8;
  }).length;

  // ── DONOR: simplified view ──
  if (role === "ROLE_DONOR") {
    return (
      <div className="p-10">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <div className="bg-white shadow rounded p-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold">Welcome, {username}</h2>
            <RoleBadge role={role} />
          </div>
          <p className="text-gray-600 mt-2 text-sm">
            You're signed in as a donor.
          </p>
        </div>
      </div>
    );
  }

  // ── ADMIN / OPERATOR: full dashboard ──
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <RoleBadge role={role} />
      </div>

      {error && <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard icon={<FiUsers className="text-blue-600" size={22} />} label="Total Donors" value={loading ? "..." : totalDonors} />
        <MetricCard icon={<FiTrash2 className="text-green-600" size={22} />} label="Waste Items Today" value={loading ? "..." : totalWasteToday} />
        <MetricCard icon={<FiAlertTriangle className="text-yellow-600" size={22} />} label="Centers Near Capacity" value={loading ? "..." : centersNearCapacity} />
        <MetricCard icon={<FiCheckCircle className="text-emerald-600" size={22} />} label="Items Processed Today" value={loading ? "..." : itemsProcessedToday} />
      </div>

      <div className="bg-white shadow rounded p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setShowAddDonor(true)} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            + Add Donor
          </button>
          <button onClick={() => navigate("/centers")} className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700">
            Dispatch to Processor
          </button>
        </div>
      </div>

      <DonorFormModal
        open={showAddDonor}
        onClose={() => setShowAddDonor(false)}
        onSubmit={handleAddDonor}
        centers={centers}
      />
    </div>
  );
};

const MetricCard = ({ icon, label, value }) => (
  <div className="bg-white shadow rounded p-5 flex items-center gap-4">
    <div className="bg-gray-100 p-3 rounded-full">{icon}</div>
    <div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-gray-500 text-sm">{label}</p>
    </div>
  </div>
);

export default Dashboard;