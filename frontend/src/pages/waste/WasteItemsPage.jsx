import { useState, useMemo } from "react";
import Table from "../../components/ui/Table";
import StatCard from "../../components/ui/StatCard";
import WasteFormModal from "./WasteFormModal";
import DeleteWasteModal from "./DeleteWasteModal";
import WasteFilters from "./WasteFilters";

// ─── Constants ────────────────────────────────────────────────────────────────
const WASTE_TYPE_COLORS = {
  VEGETABLES: "bg-green-100 text-green-700",
  DAIRY:      "bg-blue-100 text-blue-700",
  GRAINS:     "bg-yellow-100 text-yellow-700",
  MEAT:       "bg-red-100 text-red-700",
  FRUITS:     "bg-orange-100 text-orange-700",
  BEVERAGES:  "bg-purple-100 text-purple-700",
  OTHER:      "bg-gray-100 text-gray-700",
};

// ─── Dummy Data ───────────────────────────────────────────────────────────────
const DUMMY_ITEMS = [
  { id: 1,  type: "VEGETABLES", weight: 120, expiry: "2026-06-21", donorId: 1, donorName: "Green Farm Foods",  centerId: 1, centerLocation: "Kathmandu - Baneshwor", processed: false },
  { id: 2,  type: "FRUITS",     weight: 80,  expiry: "2026-06-22", donorId: 1, donorName: "Green Farm Foods",  centerId: 2, centerLocation: "Pokhara - Lakeside",     processed: true  },
  { id: 3,  type: "DAIRY",      weight: 60,  expiry: "2026-06-20", donorId: 2, donorName: "Fresh Market",      centerId: 1, centerLocation: "Kathmandu - Baneshwor", processed: false },
  { id: 4,  type: "GRAINS",     weight: 200, expiry: "2026-06-25", donorId: 3, donorName: "Pokhara Organics",  centerId: 2, centerLocation: "Pokhara - Lakeside",     processed: true  },
  { id: 5,  type: "MEAT",       weight: 45,  expiry: "2026-06-19", donorId: 2, donorName: "Fresh Market",      centerId: 3, centerLocation: "Lalitpur - Patan",        processed: false },
  { id: 6,  type: "BEVERAGES",  weight: 30,  expiry: "2026-06-24", donorId: 1, donorName: "Green Farm Foods",  centerId: 2, centerLocation: "Pokhara - Lakeside",     processed: false },
  { id: 7,  type: "OTHER",      weight: 15,  expiry: "2026-06-23", donorId: 3, donorName: "Pokhara Organics",  centerId: 3, centerLocation: "Lalitpur - Patan",        processed: true  },
];

const DEFAULT_FILTERS = { date: "", type: "", processed: "" };

// ─── Component ────────────────────────────────────────────────────────────────
const WasteItemsPage = () => {
  const [items, setItems] = useState(DUMMY_ITEMS);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [targetItem, setTargetItem] = useState(null);

  // Modal visibility
  const [addOpen, setAddOpen]       = useState(false);
  const [editOpen, setEditOpen]     = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Role check
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "ADMIN";

  // ── Filter logic ──
  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (filters.date && item.expiry !== filters.date) return false;
      if (filters.type && item.type !== filters.type) return false;
      if (filters.processed !== "" && String(item.processed) !== filters.processed) return false;
      return true;
    });
  }, [items, filters]);

  // ── Summary stats ──
  const totalItems    = items.length;
  const totalWeight   = items.reduce((s, i) => s + i.weight, 0);
  const pendingItems  = items.filter((i) => !i.processed).length;
  const processedItems = items.filter((i) => i.processed).length;

  // ── Handlers ──
  const handleAdd = (newItem) => {
    setItems((prev) => [...prev, newItem]);
  };

  const handleEdit = (updated) => {
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  };

  const handleDelete = () => {
    setItems((prev) => prev.filter((i) => i.id !== targetItem.id));
    setDeleteOpen(false);
  };

  const openEdit = (item) => { setTargetItem(item); setEditOpen(true); };
  const openDelete = (item) => { setTargetItem(item); setDeleteOpen(true); };

  const handleFilterChange = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value }));
  };

  // ── Table columns ──
  const columns = [
    {
      key: "type",
      label: "Type",
      render: (row) => (
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${WASTE_TYPE_COLORS[row.type] || "bg-gray-100 text-gray-700"}`}>
          {row.type}
        </span>
      ),
    },
    {
      key: "weight",
      label: "Weight",
      render: (row) => <span className="text-sm font-medium">{row.weight} kg</span>,
    },
    {
      key: "expiry",
      label: "Expiry Date",
      render: (row) => {
        const isExpired = new Date(row.expiry) < new Date();
        return (
          <span className={`text-sm ${isExpired ? "text-red-500 font-medium" : "text-gray-600"}`}>
            {row.expiry} {isExpired && "⚠️"}
          </span>
        );
      },
    },
    { key: "donorName",       label: "Donor"  },
    { key: "centerLocation",  label: "Center" },
    {
      key: "processed",
      label: "Status",
      render: (row) => (
        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${row.processed ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
          <span className={`w-1.5 h-1.5 rounded-full inline-block ${row.processed ? "bg-green-500" : "bg-yellow-500"}`} />
          {row.processed ? "Processed" : "Pending"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-1">
          <button
            onClick={() => openEdit(row)}
            className="px-2 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600"
          >
            Edit
          </button>
          {isAdmin && (
            <button
              onClick={() => openDelete(row)}
              className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
            >
              Delete
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Waste Items</h2>
          <p className="text-sm text-gray-500 mt-1">
            Track and manage all food waste items
          </p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
        >
          + Add Waste Item
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Items"     value={totalItems}     icon="🗃️" color="blue"   />
        <StatCard label="Total Weight"    value={`${totalWeight} kg`} icon="⚖️" color="green"  />
        <StatCard label="Pending"         value={pendingItems}   icon="⏳" color="yellow" />
        <StatCard label="Processed"       value={processedItems} icon="✅" color="green"  />
      </div>

      {/* Filters */}
      <WasteFilters
        filters={filters}
        onChange={handleFilterChange}
        onReset={() => setFilters(DEFAULT_FILTERS)}
      />

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-3">
        Showing <span className="font-medium text-gray-700">{filtered.length}</span> of {totalItems} items
      </p>

      {/* Table */}
      <Table columns={columns} data={filtered} />

      {/* Modals */}
      <WasteFormModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
        item={null}
      />

      <WasteFormModal
        open={editOpen}
        onClose={() => { setEditOpen(false); setTargetItem(null); }}
        onSubmit={handleEdit}
        item={targetItem}
      />

      <DeleteWasteModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        item={targetItem}
      />

    </div>
  );
};

export default WasteItemsPage;
