import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiTrash2, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import DonorFormModal from "../donors/DonorFormModal";

// --- dummy data (relative to "today" so date-based metrics work correctly) ---
const today = new Date();
const daysAgo = (n) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

const DUMMY_TOP_DONORS = [
  { donorId: 1, donorName: "Green Farm Foods", totalKg: 120 },
  { donorId: 2, donorName: "Fresh Market", totalKg: 95 },
  { donorId: 3, donorName: "Valley Bakery", totalKg: 60 },
];

const DUMMY_CENTERS = [
  { id: 1, location: "Kathmandu - Baneshwor", maxCapacity: 500, currentLoad: 460 }, // near capacity
  { id: 2, location: "Pokhara - Lakeside", maxCapacity: 300, currentLoad: 120 },
  { id: 3, location: "Lalitpur - Patan", maxCapacity: 400, currentLoad: 410 }, // over capacity
];

const DUMMY_WASTE_ITEMS = [
  { id: 1, weight: 12, wasteType: "VEGETABLES", processed: true, createdAt: daysAgo(0), processedAt: daysAgo(0) },
  { id: 2, weight: 8, wasteType: "DAIRY", processed: false, createdAt: daysAgo(0) },
  { id: 3, weight: 20, wasteType: "GRAINS", processed: true, createdAt: daysAgo(1), processedAt: daysAgo(1) },
  { id: 4, weight: 5, wasteType: "FRUITS", processed: false, createdAt: daysAgo(2) },
  { id: 5, weight: 15, wasteType: "MEAT", processed: true, createdAt: daysAgo(0), processedAt: daysAgo(0) },
];

const ROLE_STYLES = {
  ADMIN: "bg-purple-100 text-purple-700",
  OPERATOR: "bg-blue-100 text-blue-700",
  DONOR: "bg-green-100 text-green-700",
};

const isToday = (dateString) => {
  if (!dateString) return false;
  const d = new Date(dateString);
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
};

const isProcessedToday = (item) => {
  if (!item.processed) return false;
  const ref = item.processedAt || item.createdAt;
  return isToday(ref);
};

const RoleBadge = ({ role }) => (
  <span
    className={`text-xs font-semibold px-2 py-1 rounded-full ${
      ROLE_STYLES[role] || "bg-gray-100 text-gray-700"
    }`}
  >
    {role}
  </span>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const role = currentUser?.role;

  const [donors, setDonors] = useState(DUMMY_TOP_DONORS);
  const [centers] = useState(DUMMY_CENTERS);
  const [wasteItems] = useState(DUMMY_WASTE_ITEMS);
  const [showAddDonor, setShowAddDonor] = useState(false);

  const handleAddDonor = async (payload) => {
    setDonors((prev) => [
      ...prev,
      { donorId: Date.now(), donorName: payload.name, totalKg: 0 },
    ]);
  };

  // ---- metric calculations ----
  const totalDonors = donors.length;

  const wasteToday = wasteItems.filter((item) => isToday(item.createdAt));
  const totalWasteToday = wasteToday.length;

  const itemsProcessedToday = wasteItems.filter(isProcessedToday).length;

  const centersNearCapacity = centers.filter((c) => {
    const max = c.maxCapacity || 0;
    const load = c.currentLoad || 0;
    return max > 0 && load / max >= 0.8;
  }).length;

  // ---- DONOR role: simplified view ----
  if (role === "DONOR") {
    return (
      <div className="p-10">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <div className="bg-white shadow rounded p-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold">Welcome, {currentUser?.username}</h2>
            <RoleBadge role={role} />
          </div>
          <p className="text-gray-600 mt-2 text-sm">
            You're signed in as a {role?.toLowerCase()}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <RoleBadge role={role} />
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          icon={<FiUsers className="text-blue-600" size={22} />}
          label="Total Donors"
          value={totalDonors}
        />
        <MetricCard
          icon={<FiTrash2 className="text-green-600" size={22} />}
          label="Waste Items Today"
          value={totalWasteToday}
        />
        <MetricCard
          icon={<FiAlertTriangle className="text-yellow-600" size={22} />}
          label="Centers Near Capacity"
          value={centersNearCapacity}
        />
        <MetricCard
          icon={<FiCheckCircle className="text-emerald-600" size={22} />}
          label="Items Processed Today"
          value={itemsProcessedToday}
        />
      </div>

      {/* Quick actions */}
      <div className="bg-white shadow rounded p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowAddDonor(true)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            + Add Donor
          </button>
          <button
            onClick={() => navigate("/centers")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Accept Waste at Center
          </button>
          <button
            onClick={() => navigate("/centers")}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
          >
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