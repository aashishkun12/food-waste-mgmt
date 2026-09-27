import { useEffect, useMemo, useState } from "react";
import PaginatedTable from "../../components/ui/PaginatedTable";
import StatCard from "../../components/ui/StatCard";
import WasteFormModal from "./WasteFormModal";
import DeleteWasteModal from "./DeleteWasteModal";
import ReviewWasteModal from "./ReviewWasteModal";
import WasteFilters from "./WasteFilters";
import { getCurrentRole, hasRole } from "../../utils/auth";
import { getCenters } from "../../utils/centerApi";
import { createDonor, getDonors } from "../../utils/donorApi";
import { acceptWasteItem, createWasteItem, deleteWasteItem, getWasteItems, rejectWasteItem, updateWasteItem } from "../../utils/wasteApi";

const WASTE_TYPE_COLORS = {
  VEGETABLES: "bg-green-100 text-green-700", DAIRY: "bg-blue-100 text-blue-700", GRAINS: "bg-yellow-100 text-yellow-700",
  MEAT: "bg-red-100 text-red-700", FRUITS: "bg-orange-100 text-orange-700", BEVERAGES: "bg-purple-100 text-purple-700", OTHER: "bg-gray-100 text-gray-700",
};

const STATUS_STYLES = {
  PENDING: "bg-yellow-100 text-yellow-700",
  ACCEPTED: "bg-green-100 text-green-700",
  DISPATCHED: "bg-blue-100 text-blue-700",
  PROCESSED: "bg-purple-100 text-purple-700",
  REJECTED: "bg-red-100 text-red-700",
};

const STATUS_LABELS = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  DISPATCHED: "Dispatched",
  PROCESSED: "Processed",
  REJECTED: "Rejected",
};

// "YYYY-MM-DD", matching <input type="date"> and the expirationDate format.
const todayStr = () => new Date().toISOString().slice(0, 10);

const DEFAULT_FILTERS = { date: "", type: "", status: "" };

const isExpired = (expiry) => {
  if (!expiry) return false;
  return new Date(expiry) < new Date();
};

// Status is derived purely from data we already have on the client — an
// expired item that hasn't been accepted is immediately treated as rejected,
// with no dependency on a backend call succeeding first.
const normalizeItem = (item) => {
  const rejected = Boolean(item.rejected);
  const accepted = Boolean(item.accepted);
  const processed = Boolean(item.processed);
  const dispatched = Boolean(item.dispatched);
  const expiry = item.expirationDate;
  const expired = isExpired(expiry);

  let status;
  if (rejected) status = "REJECTED";
  else if (processed) status = "PROCESSED";
  else if (dispatched) status = "DISPATCHED";
  else if (accepted) status = "ACCEPTED";
  else if (expired) status = "REJECTED";
  else status = "PENDING";

  return {
    ...item,
    type: item.wasteType,
    weight: Number(item.weightKg || 0),
    expiry,
    centerId: item.collectionCenterId,
    centerLocation: item.collectionCenterLocation,
    rejected,
    accepted,
    processed,
    dispatched,
    autoRejected: !rejected && !processed && expired,
    status,
  };
};

const WasteItemsPage = () => {
  const [items, setItems] = useState([]);
  const [donors, setDonors] = useState([]);
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [targetItem, setTargetItem] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [currentDonorId, setCurrentDonorId] = useState(null);
  const [donorAssignedCenters, setDonorAssignedCenters] = useState([]);

  const isDonor = hasRole("ROLE_DONOR");
  const isOperator = hasRole("ROLE_OPERATOR");
  const canManage = isDonor || hasRole("ROLE_ADMIN") || isOperator;
  const isAdmin = hasRole("ROLE_ADMIN");
  const canAddWaste = isDonor;
  const canEditWaste = isDonor || isAdmin;
  const canDeleteWaste = isAdmin;
  const canAcceptWaste = isOperator;

  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  })();

  const loadItems = async () => {
    setLoading(true);
    setError("");
    try {
      const [itemData, donorData, centerData] = await Promise.all([getWasteItems(), getDonors(), getCenters()]);
      let donorList = donorData || [];
      let matchedDonor = null;

      if (isDonor) {
        const userEmail = String(currentUser.email || "").trim().toLowerCase();
        const userName = String(currentUser.username || "").trim().toLowerCase();

        matchedDonor = donorList.find((donor) => {
          const donorEmail = String(donor.contactEmail || "").trim().toLowerCase();
          const donorName = String(donor.name || "").trim().toLowerCase();
          return (donorEmail && donorEmail === userEmail) || (donorName && donorName === userName);
        });

        if (!matchedDonor && (userEmail || userName)) {
          try {
            matchedDonor = await createDonor({
              name: currentUser.username || "Donor",
              address: "Pending address",
              contactEmail: userEmail || `${userName || "donor"}@local.user`,
              contactPhone: "+9800000000",
              collectionCenterIds: [],
            });
            donorList = [...donorList, matchedDonor];
          } catch {
            matchedDonor = donorList.find((donor) => {
              const donorEmail = String(donor.contactEmail || "").trim().toLowerCase();
              const donorName = String(donor.name || "").trim().toLowerCase();
              return donorEmail === userEmail || donorName === userName;
            });
          }
        }
      }

      const donorCenters = matchedDonor && Array.isArray(matchedDonor.collectionCenterLocations)
        ? (centerData || []).filter((center) => {
            const donorLocations = (matchedDonor.collectionCenterLocations || []).map((loc) => String(loc).trim().toLowerCase());
            const centerMatch = [center.location, center.name].some((value) => donorLocations.includes(String(value || "").trim().toLowerCase()));
            return centerMatch || donorLocations.includes(String(center.location || "").trim().toLowerCase());
          })
        : [];

      setDonors(donorList);
      setCenters(centerData || []);
      setCurrentDonorId(matchedDonor ? matchedDonor.id : null);
      setDonorAssignedCenters(donorCenters.map((center) => center.id));

      const filteredItems = (itemData || []).filter((item) => {
        if (!isDonor) return true;
        return Number(item.donorId) === Number(matchedDonor?.id ?? -1);
      });

      const normalizedItems = filteredItems.map(normalizeItem);
      setItems(normalizedItems);

      // Best-effort: tell the backend about auto-rejected (expired) items so
      // the database stays consistent. The UI already shows them as Rejected
      // regardless of whether this succeeds, and it'll retry next load.
      normalizedItems
        .filter((item) => item.autoRejected)
        .forEach((item) => {
          rejectWasteItem(item.id).catch(() => {});
        });
    } catch (requestError) {
      setError(requestError.message || "Unable to load waste items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canManage) loadItems();
    else setLoading(false);
  }, [canManage, isDonor]);

  const handleAdd = async (item) => {
    const payload = isDonor ? { ...item, donorId: currentDonorId || item.donorId } : item;
    if (isDonor && !payload.donorId) {
      throw new Error("Your donor profile could not be resolved. Please sign in again.");
    }

    const created = await createWasteItem(payload);
    setItems((previous) => [...previous, normalizeItem(created)]);
  };

  const handleEdit = async (item) => {
    if (isDonor && Number(item.donorId) !== Number(currentDonorId)) {
      throw new Error("You can only edit your own donated items.");
    }

    const saved = await updateWasteItem(item);
    setItems((previous) => previous.map((existing) => existing.id === saved.id ? normalizeItem(saved) : existing));
  };

  const handleDelete = async () => {
    await deleteWasteItem(targetItem.id);
    setItems((previous) => previous.filter((item) => item.id !== targetItem.id));
    setDeleteOpen(false);
    setTargetItem(null);
  };

  const handleAccept = async (item) => {
    if (!item || item.status !== "PENDING") return;
    const accepted = await acceptWasteItem(item.id);
    setItems((previous) => previous.map((entry) => entry.id === item.id ? normalizeItem(accepted) : entry));
    setReviewOpen(false);
    setReviewAction(null);
    setTargetItem(null);
  };

  const handleReject = async (item) => {
    if (!item || item.status !== "PENDING") return;
    const rejected = await rejectWasteItem(item.id);
    setItems((previous) => previous.map((entry) => entry.id === item.id ? normalizeItem(rejected) : entry));
    setReviewOpen(false);
    setReviewAction(null);
    setTargetItem(null);
  };

  const openReviewModal = (item, action) => {
    setTargetItem(item);
    setReviewAction(action);
    setReviewOpen(true);
  };

  const closeReviewModal = () => {
    setReviewOpen(false);
    setReviewAction(null);
    setTargetItem(null);
  };

  const filtered = useMemo(() => items
    .filter((item) => {
      // All dates removes the restriction; otherwise show items expiring on the selected date.
      const matchesDate = !filters.date || filters.date === "CUSTOM" || item.expiry === filters.date;
      const matchesType = !filters.type || item.type === filters.type;
      const matchesStatus = !filters.status || item.status === filters.status;
      return matchesDate && matchesType && matchesStatus;
    })
    .sort((firstItem, secondItem) => {
      const firstExpiry = firstItem.expiry ? Date.parse(firstItem.expiry) : Number.POSITIVE_INFINITY;
      const secondExpiry = secondItem.expiry ? Date.parse(secondItem.expiry) : Number.POSITIVE_INFINITY;
      return firstExpiry - secondExpiry;
    }), [items, filters]);

  if (!canManage) {
    return <div className="p-6 text-sm text-red-600">You do not have access to waste items. Current role: {getCurrentRole() || "unknown"}.</div>;
  }

  if (isDonor && !currentDonorId && !loading) {
    return <div className="p-6 text-sm text-red-600">Your donor profile could not be created automatically. Please refresh or contact an admin.</div>;
  }

  const columns = [
    { key: "type", label: "Type", width: "w-[10%]", render: (row) => <span className={`text-xs font-semibold px-2 py-1 rounded-full ${WASTE_TYPE_COLORS[row.type] || "bg-gray-100 text-gray-700"}`}>{row.type}</span> },
    { key: "weight", label: "Weight", width: "w-[8%]", render: (row) => <span className="text-sm font-medium">{row.weight} kg</span> },
    { key: "expiry", label: "Expiry Date", width: "w-[13%]", render: (row) => { const expired = isExpired(row.expiry); return <span className={`text-sm ${expired ? "text-red-500 font-medium" : "text-gray-600"}`}>{row.expiry}{expired && " ⚠️"}</span>; } },
    { key: "donorName", label: "Donor", width: "w-[15%]" },
    { key: "centerLocation", label: "Center", width: "w-[15%]" },
    {
      key: "status",
      label: "Status",
      width: "w-[13%]",
      render: (row) => (
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[row.status]}`}>
          {STATUS_LABELS[row.status]}{row.autoRejected ? " (expired)" : ""}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      width: "w-[26%]",
      render: (row) => {
        if (isOperator) {
          if (row.status !== "PENDING") {
            return (
              <span className={`inline-flex justify-center px-2.5 py-1 text-xs font-semibold rounded-full ${STATUS_STYLES[row.status]}`}>
                {STATUS_LABELS[row.status]}
              </span>
            );
          }
          return (
            <div className="flex flex-wrap items-center gap-1.5">
              <button onClick={() => openReviewModal(row, "accept")} className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700">Accept</button>
              <button onClick={() => openReviewModal(row, "reject")} className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-md hover:bg-red-600">Reject</button>
            </div>
          );
        }

        return (
          <div className="flex flex-wrap items-center gap-1.5">
            {canEditWaste && (!isDonor || row.status === "PENDING") && <button onClick={() => { setTargetItem(row); setEditOpen(true); }} className="px-2 py-1 bg-yellow-500 text-white text-xs rounded">Edit</button>}
            {canDeleteWaste && <button onClick={() => { setTargetItem(row); setDeleteOpen(true); }} className="px-2 py-1 bg-red-500 text-white text-xs rounded">Delete</button>}
          </div>
        );
      },
    },
  ];

  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  const pendingItems = items.filter((item) => item.status === "PENDING").length;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6"><div><h2 className="text-2xl font-bold text-gray-800">{isDonor ? "Donate Waste" : isOperator ? "Food Waste Operations" : "Waste Items"}</h2><p className="text-sm text-gray-500 mt-1">{isDonor ? "Submit a food donation for collection." : isOperator ? "Donors send waste to a collection center. Operators accept or reject it before dispatching to the processor." : "Track and manage all food waste items"}</p></div>{canAddWaste && <button onClick={() => setAddOpen(true)} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">{isDonor ? "+ Donate Waste Item" : "+ Add Waste Item"}</button>}</div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"><StatCard label="Total Items" value={items.length} icon="🗃️" color="blue" /><StatCard label="Total Weight" value={`${parseFloat(totalWeight.toFixed(2))} kg`} icon="⚖️" color="green" /><StatCard label="Pending" value={pendingItems} icon="⏳" color="yellow" /><StatCard label="Processed" value={items.length - pendingItems} icon="✅" color="green" /></div>
      {error && <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"><span>{error}</span><button onClick={loadItems} className="ml-4 font-semibold underline">Retry</button></div>}
      <WasteFilters filters={filters} onChange={(key, value) => setFilters((previous) => ({ ...previous, [key]: value }))} onReset={() => setFilters(DEFAULT_FILTERS)} />
      {loading ? <p className="text-gray-500">Loading waste items...</p> : <PaginatedTable columns={columns} data={filtered} pageSize={7} />}
      {canAddWaste && (
        <WasteFormModal
          open={addOpen}
          onClose={() => setAddOpen(false)}
          onSubmit={handleAdd}
          donors={donors}
          centers={isDonor ? (centers.filter((center) => donorAssignedCenters.includes(center.id))) : centers}
          defaultDonorId={isDonor ? currentDonorId : ""}
        />
      )}
      {canEditWaste && (
        <WasteFormModal
          open={editOpen}
          onClose={() => { setEditOpen(false); setTargetItem(null); }}
          onSubmit={handleEdit}
          item={targetItem}
          donors={donors}
          centers={isDonor ? (centers.filter((center) => donorAssignedCenters.includes(center.id))) : centers}
          defaultDonorId={isDonor ? currentDonorId : ""}
        />
      )}
      <DeleteWasteModal open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} item={targetItem} />

      <ReviewWasteModal
        open={reviewOpen && !!targetItem}
        onClose={closeReviewModal}
        onConfirm={() => {
          if (reviewAction === "accept") {
            handleAccept(targetItem);
          } else if (reviewAction === "reject") {
            handleReject(targetItem);
          }
        }}
        item={targetItem}
        action={reviewAction}
      />
    </div>
  );
};

export default WasteItemsPage;