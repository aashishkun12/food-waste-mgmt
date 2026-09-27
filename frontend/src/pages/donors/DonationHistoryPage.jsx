import { useEffect, useMemo, useState } from "react";
import { getCurrentRole, hasRole } from "../../utils/auth";
import { createDonor, getDonors } from "../../utils/donorApi";
import { getWasteItems } from "../../utils/wasteApi";

const DonationHistoryPage = () => {
  const role = getCurrentRole();
  const isDonor = hasRole("ROLE_DONOR");
  const isOperator = hasRole("ROLE_OPERATOR");
  const canViewHistory = isDonor || isOperator;

  const [donors, setDonors] = useState([]);
  const [selectedDonorId, setSelectedDonorId] = useState("");
  const [donor, setDonor] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [donorData, wasteData] = await Promise.all([getDonors(), getWasteItems()]);
        const donorList = donorData || [];
        setDonors(donorList);

        const user = JSON.parse(localStorage.getItem("user") || "{}");
        let profile = donorList.find((entry) => {
          const donorEmail = String(entry.contactEmail || "").trim().toLowerCase();
          const donorName = String(entry.name || "").trim().toLowerCase();
          const userEmail = String(user.email || "").trim().toLowerCase();
          const userName = String(user.username || "").trim().toLowerCase();
          return donorEmail === userEmail || donorName === userName || donorName.includes(userName);
        });

        if (!profile && isDonor && (user.email || user.username)) {
          profile = await createDonor({
            name: user.username || "Donor",
            address: "Pending address",
            contactEmail: user.email || `${user.username || "donor"}@local.user`,
            contactPhone: "+9800000000",
            collectionCenterIds: [],
          });
          setDonors((previous) => [...previous, profile]);
        }

        const donorToUse = isOperator
          ? donorList.find((entry) => String(entry.id) === String(selectedDonorId)) || donorList[0] || null
          : profile || null;

        setDonor(donorToUse);
        setSelectedDonorId(donorToUse ? String(donorToUse.id) : "");

        const filteredItems = (wasteData || []).filter((item) => Number(item.donorId) === Number(donorToUse?.id ?? -1));
        setItems(filteredItems);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    if (canViewHistory) loadData();
  }, [canViewHistory, isDonor, isOperator, selectedDonorId]);

  useEffect(() => {
    if (!isOperator || !selectedDonorId || donors.length === 0) return;

    const selected = donors.find((entry) => String(entry.id) === String(selectedDonorId));
    if (!selected) return;

    setDonor(selected);
  }, [selectedDonorId, donors, isOperator]);

  const totalWeight = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.weightKg || 0), 0),
    [items]
  );
  const statusTotals = useMemo(() => ({
    accepted: items.filter((item) => item.accepted && !item.dispatched && !item.processed && !item.rejected).length,
    rejected: items.filter((item) => item.rejected).length,
    rejectedWeight: items.filter((item) => item.rejected).reduce((sum, item) => sum + Number(item.weightKg || 0), 0),
    processing: items.filter((item) => item.dispatched && !item.processed && !item.rejected).length,
    processed: items.filter((item) => item.processed && !item.rejected).length,
  }), [items]);

  if (!canViewHistory) {
    return <div className="p-6 text-sm text-red-600">This page is available to donors and operators. Current role: {role || "unknown"}</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Donation History</h2>
        <p className="text-sm text-gray-500 mt-1">
          {isOperator ? "Review donor submissions and their current processing status." : "Track every donated waste item and its status."}
        </p>
      </div>

      {isOperator && donors.length > 0 && (
        <div className="mb-6 rounded-xl bg-white p-4 shadow-sm border border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select donor</label>
          <select
            value={selectedDonorId}
            onChange={(event) => setSelectedDonorId(event.target.value)}
            className="w-full max-w-md rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-green-500 focus:outline-none"
          >
            {donors.map((entry) => (
              <option key={entry.id} value={entry.id}>{entry.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Total Donations</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{items.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Total Weight</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{totalWeight.toFixed(2)} kg</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-green-100 p-4">
          <p className="text-sm text-green-600">Accepted / Ready</p>
          <p className="text-2xl font-bold text-green-700 mt-2">{statusTotals.accepted}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-red-100 p-4">
          <p className="text-sm text-red-600">Rejected Weight</p>
          <p className="text-2xl font-bold text-red-700 mt-2">{statusTotals.rejectedWeight.toFixed(2)} kg</p>
          <p className="text-xs text-red-500">{statusTotals.rejected} item{statusTotals.rejected === 1 ? "" : "s"}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-4">
          <p className="text-sm text-blue-600">Processing</p>
          <p className="text-2xl font-bold text-blue-700 mt-2">{statusTotals.processing}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-4">
          <p className="text-sm text-purple-600">Processed</p>
          <p className="text-2xl font-bold text-purple-700 mt-2">{statusTotals.processed}</p>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl p-8 text-center text-sm text-gray-500">Loading donation history...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-700">Waste Type</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Weight</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Expiry</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Center</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item) => (
                  <tr key={item.id} className="border-t border-gray-200">
                    <td className="px-4 py-3 text-gray-700">{item.wasteType}</td>
                    <td className="px-4 py-3 text-gray-700">{Number(item.weightKg || 0).toFixed(2)} kg</td>
                    <td className="px-4 py-3 text-gray-700">{item.expirationDate || "N/A"}</td>
                    <td className="px-4 py-3 text-gray-700">{item.collectionCenterLocation || "Not assigned"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${item.rejected ? "bg-red-100 text-red-700" : item.processed ? "bg-purple-100 text-purple-700" : item.dispatched ? "bg-blue-100 text-blue-700" : item.accepted ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {item.rejected ? "Rejected" : item.processed ? "Processed" : item.dispatched ? "Dispatched" : item.accepted ? "Accepted" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-10 text-center text-sm text-gray-500">
                    {isOperator ? "No donation history found for the selected donor." : "No donation history found for this donor."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DonationHistoryPage;
