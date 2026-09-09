import { useEffect, useMemo, useState } from "react";
import Table from "../../components/ui/Table";
import StatCard from "../../components/ui/StatCard";
import WasteFormModal from "./WasteFormModal";
import DeleteWasteModal from "./DeleteWasteModal";
import WasteFilters from "./WasteFilters";
import { getCurrentRole, hasRole } from "../../utils/auth";
import { getCenters } from "../../utils/centerApi";
import { getDonors } from "../../utils/donorApi";
import { createWasteItem, deleteWasteItem, getWasteItems, updateWasteItem } from "../../utils/wasteApi";

const WASTE_TYPE_COLORS = {
  VEGETABLES: "bg-green-100 text-green-700", DAIRY: "bg-blue-100 text-blue-700", GRAINS: "bg-yellow-100 text-yellow-700",
  MEAT: "bg-red-100 text-red-700", FRUITS: "bg-orange-100 text-orange-700", BEVERAGES: "bg-purple-100 text-purple-700", OTHER: "bg-gray-100 text-gray-700",
};
const DEFAULT_FILTERS = { date: "", type: "", processed: "" };

const normalizeItem = (item) => ({
  ...item,
  type: item.wasteType,
  weight: Number(item.weightKg || 0),
  expiry: item.expirationDate,
  centerId: item.collectionCenterId,
  centerLocation: item.collectionCenterLocation,
});

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

  const canManage = hasRole("ROLE_ADMIN") || hasRole("ROLE_OPERATOR");
  const isAdmin = hasRole("ROLE_ADMIN");

  const loadItems = async () => {
    setLoading(true);
    setError("");
    try {
      const [itemData, donorData, centerData] = await Promise.all([getWasteItems(), getDonors(), getCenters()]);
      setItems((itemData || []).map(normalizeItem));
      setDonors(donorData || []);
      setCenters(centerData || []);
    } catch (requestError) {
      setError(requestError.message || "Unable to load waste items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canManage) loadItems();
    else setLoading(false);
  }, [canManage]);

  const handleAdd = async (item) => {
    const created = await createWasteItem(item);
    setItems((previous) => [...previous, normalizeItem(created)]);
  };

  const handleEdit = async (item) => {
    const saved = await updateWasteItem(item);
    setItems((previous) => previous.map((existing) => existing.id === saved.id ? normalizeItem(saved) : existing));
  };

  const handleDelete = async () => {
    await deleteWasteItem(targetItem.id);
    setItems((previous) => previous.filter((item) => item.id !== targetItem.id));
    setDeleteOpen(false);
    setTargetItem(null);
  };

  const filtered = useMemo(() => items.filter((item) => (
    (!filters.date || item.expiry === filters.date)
    && (!filters.type || item.type === filters.type)
    && (filters.processed === "" || String(item.processed) === filters.processed)
  )), [items, filters]);

  if (!canManage) {
    return <div className="p-6 text-sm text-red-600">You do not have access to waste items. Current role: {getCurrentRole() || "unknown"}.</div>;
  }

  const columns = [
    { key: "type", label: "Type", render: (row) => <span className={`text-xs font-semibold px-2 py-1 rounded-full ${WASTE_TYPE_COLORS[row.type] || "bg-gray-100 text-gray-700"}`}>{row.type}</span> },
    { key: "weight", label: "Weight", render: (row) => <span className="text-sm font-medium">{row.weight} kg</span> },
    { key: "expiry", label: "Expiry Date", render: (row) => { const expired = new Date(row.expiry) < new Date(); return <span className={`text-sm ${expired ? "text-red-500 font-medium" : "text-gray-600"}`}>{row.expiry}{expired && " ⚠️"}</span>; } },
    { key: "donorName", label: "Donor" },
    { key: "centerLocation", label: "Center" },
    { key: "processed", label: "Status", render: (row) => <span className={`text-xs font-semibold px-2 py-1 rounded-full ${row.processed ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{row.processed ? "Processed" : "Pending"}</span> },
    {
      key: "actions", label: "Actions", render: (row) => <div className="flex gap-1">
        <button onClick={() => { setTargetItem(row); setEditOpen(true); }} className="px-2 py-1 bg-yellow-500 text-white text-xs rounded">Edit</button>
        {isAdmin && <button onClick={() => { setTargetItem(row); setDeleteOpen(true); }} className="px-2 py-1 bg-red-500 text-white text-xs rounded">Delete</button>}
      </div>,
    },
  ];

  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  const pendingItems = items.filter((item) => !item.processed).length;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6"><div><h2 className="text-2xl font-bold text-gray-800">Waste Items</h2><p className="text-sm text-gray-500 mt-1">Track and manage all food waste items</p></div><button onClick={() => setAddOpen(true)} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">+ Add Waste Item</button></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"><StatCard label="Total Items" value={items.length} icon="🗃️" color="blue" /><StatCard label="Total Weight" value={`${totalWeight} kg`} icon="⚖️" color="green" /><StatCard label="Pending" value={pendingItems} icon="⏳" color="yellow" /><StatCard label="Processed" value={items.length - pendingItems} icon="✅" color="green" /></div>
      {error && <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"><span>{error}</span><button onClick={loadItems} className="ml-4 font-semibold underline">Retry</button></div>}
      <WasteFilters filters={filters} onChange={(key, value) => setFilters((previous) => ({ ...previous, [key]: value }))} onReset={() => setFilters(DEFAULT_FILTERS)} />
      <p className="text-sm text-gray-500 mb-3">Showing <span className="font-medium text-gray-700">{filtered.length}</span> of {items.length} items</p>
      {loading ? <p className="text-gray-500">Loading waste items...</p> : <Table columns={columns} data={filtered} />}
      <WasteFormModal open={addOpen} onClose={() => setAddOpen(false)} onSubmit={handleAdd} donors={donors} centers={centers} />
      <WasteFormModal open={editOpen} onClose={() => { setEditOpen(false); setTargetItem(null); }} onSubmit={handleEdit} item={targetItem} donors={donors} centers={centers} />
      <DeleteWasteModal open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} item={targetItem} />
    </div>
  );
};

export default WasteItemsPage;
