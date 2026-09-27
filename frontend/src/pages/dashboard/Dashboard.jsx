import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiTrash2, FiAlertTriangle, FiCheckCircle, FiPackage, FiMapPin, FiClock, FiTruck, FiActivity, FiUserCheck, FiSettings, FiBarChart2 } from "react-icons/fi";
import DonorFormModal from "../donors/DonorFormModal";
import api from "../../utils/api";
import { getDonors, updateDonor } from "../../utils/donorApi";
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
  const [donorProfile, setDonorProfile] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCenterSelection, setShowCenterSelection] = useState(false);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const [donorData, centerData, wasteData, userData] = await Promise.all([
          getDonors(),
          getCenters(),
          role === "ROLE_DONOR" ? Promise.resolve([]) : api.get("/api/food-waste-items"),
          role === "ROLE_ADMIN" ? api.get("/api/users") : Promise.resolve([]),
        ]);

        setDonors(donorData || []);
        setCenters(centerData || []);
        setWasteItems(wasteData || []);
        setUsers(userData || []);

        if (role === "ROLE_DONOR") {
          const userEmail = String((JSON.parse(localStorage.getItem("user") || "{}")?.email || "")).trim().toLowerCase();
          const userName = String((JSON.parse(localStorage.getItem("user") || "{}")?.username || currentUser?.sub || "")).trim().toLowerCase();

          const matchedDonor = (donorData || []).find((donor) => {
            const donorEmail = String(donor.contactEmail || "").trim().toLowerCase();
            const donorName = String(donor.name || "").trim().toLowerCase();
            return donorEmail === userEmail || donorName === userName || donorName.includes(userName);
          });

          setDonorProfile(matchedDonor || null);
        }
      } catch (requestError) {
        setError(requestError.message || "Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    if (role) {
      loadDashboard();
    } else {
      setLoading(false);
    }
  }, [role, currentUser?.sub]);

  const totalDonors        = donors.length;
  const totalWasteToday    = wasteItems.filter((i) => isToday(i.createdAt)).length;
  const itemsProcessedToday = wasteItems.filter(isProcessedToday).length;
  const centersNearCapacity = centers.filter((c) => {
    const maxCapacity = Number(c.maxCapacityKg || 0);
    const currentLoad = Number(c.currentLoadKg || 0);
    return maxCapacity > 0 && currentLoad / maxCapacity >= 0.8;
  }).length;
  const workflowStats = useMemo(() => {
    const pendingReview = wasteItems.filter((item) => !item.accepted && !item.rejected && !item.dispatched && !item.processed).length;
    const readyDispatch = wasteItems.filter((item) => item.accepted && !item.rejected && !item.dispatched && !item.processed).length;
    const processing = wasteItems.filter((item) => item.dispatched && !item.processed && !item.rejected).length;
    const rejected = wasteItems.filter((item) => item.rejected).length;
    const nearExpiry = wasteItems.filter((item) => {
      if (!item.accepted || item.rejected || item.dispatched || item.processed || !item.expirationDate) return false;
      const days = Math.ceil((new Date(`${item.expirationDate}T00:00:00`) - new Date()) / 86400000);
      return days >= 0 && days <= 3;
    }).length;
    return { pendingReview, readyDispatch, processing, rejected, nearExpiry };
  }, [wasteItems]);

  const donorCenterIds = useMemo(() => {
    if (!donorProfile) return [];

    const selectedLocations = Array.isArray(donorProfile.collectionCenterLocations)
      ? donorProfile.collectionCenterLocations
      : [];

    if (Array.isArray(donorProfile.collectionCenterIds) && donorProfile.collectionCenterIds.length > 0) {
      return donorProfile.collectionCenterIds;
    }

    return (centers || [])
      .filter((center) => {
        const centerLocation = String(center.location || "").trim().toLowerCase();
        const centerName = String(center.name || "").trim().toLowerCase();

        return selectedLocations.some((value) => {
          const normalizedValue = String(value || "").trim().toLowerCase();
          return normalizedValue === centerLocation || normalizedValue === centerName;
        });
      })
      .map((center) => center.id);
  }, [centers, donorProfile]);

  const donorStats = useMemo(() => {
    const totalDonations = Number(donorProfile?.totalDonations || 0);
    const centerCount = Array.isArray(donorProfile?.collectionCenterLocations)
      ? donorProfile.collectionCenterLocations.length
      : 0;

    return [
      {
        label: "Total Donations",
        value: totalDonations,
        icon: <FiPackage className="text-blue-600" size={22} />,
        accent: "bg-blue-50 text-blue-700",
      },
      {
        label: "Active Centers",
        value: centerCount,
        icon: <FiMapPin className="text-emerald-600" size={22} />,
        accent: "bg-emerald-50 text-emerald-700",
      },
      {
        label: "Profile Status",
        value: donorProfile ? "Active" : "Pending",
        icon: <FiCheckCircle className="text-violet-600" size={22} />,
        accent: "bg-violet-50 text-violet-700",
      },
    ];
  }, [donorProfile]);

  const handleCenterSelectionSave = async (payload) => {
    if (!donorProfile?.id) return;

    const updated = await updateDonor({
      ...donorProfile,
      ...payload,
      id: donorProfile.id,
      collectionCenterIds: payload.collectionCenterIds || donorCenterIds,
    });

    setDonorProfile(updated);
    setShowCenterSelection(false);
  };

  // ── DONOR: detailed donation dashboard ──
  if (role === "ROLE_DONOR") {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <RoleBadge role={role} />
        </div>

        {error && <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        {loading ? (
          <div className="rounded-xl bg-white p-10 text-center text-sm text-gray-500 shadow-sm">
            Loading donor dashboard...
          </div>
        ) : (
          <>
            {!donorProfile || !Array.isArray(donorProfile.collectionCenterLocations) || donorProfile.collectionCenterLocations.length === 0 ? (
              <div className="rounded-xl border border-red-300 bg-red-50 px-5 py-4 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3 text-red-800">
                    <div className="mt-0.5 rounded-full bg-red-100 p-2">
                      <FiMapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-base font-semibold">Please select a collection center to make a donation.</p>
                      <p className="text-sm text-red-700">Your donor profile needs an assigned collection center before you can submit waste donations.</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowCenterSelection(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-red-700"
                  >
                    <FiMapPin className="h-4 w-4" />
                    Select collection center
                  </button>
                </div>
              </div>
            ) : null}

            {donorProfile && (
              <DonorFormModal
                open={showCenterSelection}
                onClose={() => setShowCenterSelection(false)}
                onSubmit={handleCenterSelectionSave}
                donor={{
                  ...donorProfile,
                  collectionCenterIds: donorCenterIds,
                }}
                centers={centers}
                allowEditDetails={false}
              />
            )}

            <div className="bg-white shadow rounded-2xl p-6 border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-sm font-medium uppercase tracking-wide text-green-600">Donor profile</p>
                  <h2 className="text-2xl font-bold mt-2">Welcome, {donorProfile?.name || username}</h2>
                </div>
                <button
                  onClick={() => navigate("/donation-history")}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  View Donation History
                </button>
              </div>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {donorStats.map((card) => (
                  <div key={card.label} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div className={`inline-flex rounded-lg p-2 ${card.accent}`}>{card.icon}</div>
                    <p className="mt-4 text-2xl font-bold text-gray-900">{card.value}</p>
                    <p className="text-sm text-gray-500">{card.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-white shadow rounded-2xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">Profile</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex justify-between gap-4 border-b pb-2">
                    <span className="text-gray-500">Name</span>
                    <span className="font-medium">{donorProfile?.name || username || "Not available"}</span>
                  </div>
                  <div className="flex justify-between gap-4 border-b pb-2">
                    <span className="text-gray-500">Email</span>
                    <span className="font-medium break-all">{donorProfile?.contactEmail || currentUser?.email || "Not available"}</span>
                  </div>
                  <div className="flex justify-between gap-4 border-b pb-2">
                    <span className="text-gray-500">Phone</span>
                    <span className="font-medium">{donorProfile?.contactPhone || "Not available"}</span>
                  </div>
                  <div className="flex justify-between gap-4 border-b pb-2">
                    <span className="text-gray-500">Address</span>
                    <span className="font-medium text-right">{donorProfile?.address || "Not available"}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-2xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">Donation history</h3>
                <div className="space-y-3">
                  <div className="rounded-lg bg-green-50 p-3 text-sm text-green-800">
                    <span className="font-semibold">{donorProfile?.totalDonations ?? 0}</span> donation records registered in the system.
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-sm font-medium text-gray-700">Collection center access</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(donorProfile?.collectionCenterLocations?.length ? donorProfile.collectionCenterLocations : ["No assigned center yet"]).map((center, index) => (
                        <span key={`${center}-${index}`} className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                          {center}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                    {donorProfile ? "Your donation profile is active and ready for waste submissions." : "Your donor profile is still being linked to your account."}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
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

      {role === "ROLE_OPERATOR" ? (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <MetricCard icon={<FiClock className="text-amber-600" size={22} />} label="Awaiting Review" value={loading ? "..." : workflowStats.pendingReview} />
          <MetricCard icon={<FiTruck className="text-green-600" size={22} />} label="Ready to Dispatch" value={loading ? "..." : workflowStats.readyDispatch} />
          <MetricCard icon={<FiAlertTriangle className="text-red-600" size={22} />} label="Near Expiry" value={loading ? "..." : workflowStats.nearExpiry} />
          <MetricCard icon={<FiActivity className="text-blue-600" size={22} />} label="Processing" value={loading ? "..." : workflowStats.processing} />
          <MetricCard icon={<FiCheckCircle className="text-purple-600" size={22} />} label="Processed Today" value={loading ? "..." : itemsProcessedToday} />
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <MetricCard icon={<FiUsers className="text-blue-600" size={22} />} label="Total Users" value={loading ? "..." : users.length} />
          <MetricCard icon={<FiUserCheck className="text-green-600" size={22} />} label="Total Donors" value={loading ? "..." : totalDonors} />
          <MetricCard icon={<FiTrash2 className="text-emerald-600" size={22} />} label="Waste Today" value={loading ? "..." : totalWasteToday} />
          <MetricCard icon={<FiAlertTriangle className="text-yellow-600" size={22} />} label="Centers Near Capacity" value={loading ? "..." : centersNearCapacity} />
          <MetricCard icon={<FiCheckCircle className="text-purple-600" size={22} />} label="Processed Today" value={loading ? "..." : itemsProcessedToday} />
        </div>
      )}

      <div className="bg-white shadow rounded p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {role === "ROLE_OPERATOR" ? (
            <>
              <button onClick={() => navigate("/waste")} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Review Waste</button>
              <button onClick={() => navigate("/dispatch_waste")} className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700">Dispatch Waste</button>
              <button onClick={() => navigate("/processors")} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">View Processors</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate("/users")} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"><FiUsers className="mr-1 inline" />Manage Users</button>
              <button onClick={() => navigate("/centers")} className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"><FiMapPin className="mr-1 inline" />Collection Centers</button>
              <button onClick={() => navigate("/processors")} className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"><FiSettings className="mr-1 inline" />Processors</button>
              <button onClick={() => navigate("/reports")} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"><FiBarChart2 className="mr-1 inline" />Reports</button>
            </>
          )}
        </div>
      </div>

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