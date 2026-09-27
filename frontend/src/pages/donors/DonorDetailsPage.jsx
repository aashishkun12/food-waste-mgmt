import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PaginatedTable from "../../components/ui/PaginatedTable";
import StatCard from "../../components/ui/StatCard";
import Modal from "../../components/ui/Modal";
import { hasRole } from "../../utils/auth";
import { getDonors } from "../../utils/donorApi";
import { getWasteItems } from "../../utils/wasteApi";

const getDonationStatus = (item) => {
  if (item.rejected) return { label: "Rejected", className: "bg-red-100 text-red-700" };
  if (item.processed) return { label: "Processed", className: "bg-green-100 text-green-700" };
  if (item.dispatched) return { label: "Dispatched", className: "bg-blue-100 text-blue-700" };
  if (item.accepted) return { label: "Accepted", className: "bg-emerald-100 text-emerald-700" };
  return { label: "Pending", className: "bg-amber-100 text-amber-700" };
};

const DonorDetailsPage = () => {
  const [donors, setDonors] = useState([]);
  const [donations, setDonations] = useState([]);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const canViewDetails = hasRole("ROLE_ADMIN") || hasRole("ROLE_OPERATOR");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [donorData, donationData] = await Promise.all([getDonors(), getWasteItems()]);
      setDonors(donorData || []);
      setDonations(donationData || []);
    } catch (requestError) {
      setError(requestError.message || "Unable to load donor details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!canViewDetails) {
      navigate("/dashboard");
      return;
    }
    loadData();
  }, [canViewDetails, navigate]);

  if (!canViewDetails) return null;

  const selectedDonations = donations.filter((item) => Number(item.donorId) === Number(selectedDonor?.id));
  const columns = [
    { key: "name", label: "Name" },
    { key: "address", label: "Address" },
    { key: "contactEmail", label: "Email" },
    { key: "contactPhone", label: "Phone" },
    {
      key: "totalDonations",
      label: "Donations",
      render: (donor) => donations.filter((item) => Number(item.donorId) === Number(donor.id)).length,
    },
    {
      key: "actions",
      label: "Actions",
      render: (donor) => <button type="button" onClick={() => setSelectedDonor(donor)} className="rounded bg-blue-500 px-3 py-1 text-xs text-white hover:bg-blue-600">View</button>,
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Donor Details</h2>
        <p className="mt-1 text-sm text-gray-500">View all donors and the outcome of every donated item.</p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="Total Donors" value={donors.length} icon="🤝" color="blue" />
        <StatCard label="Total Donations" value={donations.length} icon="📦" color="green" />
        <StatCard label="Rejected Items" value={donations.filter((item) => item.rejected).length} icon="⚠️" color="yellow" />
      </div>

      {error && <div className="mb-4 flex items-center justify-between rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"><span>{error}</span><button type="button" onClick={loadData} className="font-semibold underline">Retry</button></div>}
      {loading ? <p className="text-gray-500">Loading donors...</p> : <PaginatedTable columns={columns} data={donors} pageSize={8} />}

      <Modal open={!!selectedDonor} onClose={() => setSelectedDonor(null)} title="Donation Details" scrollable>
        {selectedDonor && (
          <>
            <div className="border-b border-gray-200 pb-5">
              <h3 className="font-semibold text-gray-800">Collection Centers</h3>
              {selectedDonor.collectionCenterLocations?.length ? (
                <ul className="mt-3 space-y-2 text-sm text-gray-700">
                  {selectedDonor.collectionCenterLocations.map((location) => <li key={location} className="rounded border border-gray-200 bg-gray-50 px-3 py-2">{location}</li>)}
                </ul>
              ) : <p className="mt-2 text-sm text-gray-500">No collection centers assigned.</p>}
            </div>
            <h3 className="mb-3 mt-5 font-semibold text-gray-800">Donation History ({selectedDonations.length})</h3>
            {selectedDonations.length === 0 ? <p className="text-sm text-gray-500">No donations recorded.</p> : (
              <div className="overflow-x-auto rounded border border-gray-200">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-gray-50"><tr><th className="px-3 py-2">Item</th><th className="px-3 py-2">Weight</th><th className="px-3 py-2">Expiry</th><th className="px-3 py-2">Status</th></tr></thead>
                  <tbody>{selectedDonations.map((item) => { const status = getDonationStatus(item); return <tr key={item.id} className="border-t"><td className="px-3 py-2">{item.wasteType || "Food item"}</td><td className="px-3 py-2">{item.weightKg ?? "-"} kg</td><td className="px-3 py-2">{item.expirationDate || "-"}</td><td className="px-3 py-2"><span className={`rounded-full px-2 py-1 text-xs font-semibold ${status.className}`}>{status.label}</span></td></tr>; })}</tbody>
                </table>
              </div>
            )}
          </>
        )}
      </Modal>
    </div>
  );
};

export default DonorDetailsPage;