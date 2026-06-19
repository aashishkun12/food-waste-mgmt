import { useState } from "react";

import Table from "../../components/ui/Table";
import StatCard from "../../components/ui/StatCard";
import CapacityBar from "../../components/ui/CapacityBar";

import CenterDetailPanel from "./CenterDetailPanel";
import CenterFormModal from "./CenterFormModal";
import DeleteCenterModal from "./DeleteCenterModal";
import AcceptWasteModal from "./AcceptWasteModal";
import DispatchModal from "./DispatchModal";

// ─── Dummy Data ───────────────────────────────────────────────────────────────
const DUMMY_PROCESSORS = [
  { id: 1, name: "GreenCycle Processor" },
  { id: 2, name: "EcoWaste Solutions" },
  { id: 3, name: "BioConvert Ltd." },
];

const DUMMY_CENTERS = [
  {
    id: 1,
    location: "Kathmandu - Baneshwor",
    maxCapacity: 500,
    currentLoad: 420,
    processorId: 1,
    processorName: "GreenCycle Processor",
    donors: ["Green Farm Foods", "Fresh Market"],
    wasteItems: [
      { id: 101, type: "VEGETABLES", weight: 120, expiry: "2026-06-21" },
      { id: 102, type: "FRUITS", weight: 80, expiry: "2026-06-22" },
      { id: 103, type: "DAIRY", weight: 220, expiry: "2026-06-20" },
    ],
  },
  {
    id: 2,
    location: "Pokhara - Lakeside",
    maxCapacity: 300,
    currentLoad: 90,
    processorId: 2,
    processorName: "EcoWaste Solutions",
    donors: ["Pokhara Organics"],
    wasteItems: [
      { id: 201, type: "GRAINS", weight: 60, expiry: "2026-06-25" },
      { id: 202, type: "BEVERAGES", weight: 30, expiry: "2026-06-24" },
    ],
  },
  {
    id: 3,
    location: "Lalitpur - Patan",
    maxCapacity: 400,
    currentLoad: 400,
    processorId: 3,
    processorName: "BioConvert Ltd.",
    donors: ["Patan Market", "City Grocers"],
    wasteItems: [
      { id: 301, type: "MEAT", weight: 200, expiry: "2026-06-20" },
      { id: 302, type: "OTHER", weight: 200, expiry: "2026-06-23" },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getCapacityStatus = (current, max) => {
  const pct = (current / max) * 100;
  if (pct >= 100) return { label: "Full", cls: "bg-red-100 text-red-700" };
  if (pct >= 80) return { label: "Near Full", cls: "bg-yellow-100 text-yellow-700" };
  return { label: "OK", cls: "bg-green-100 text-green-700" };
};

// ─── Component ────────────────────────────────────────────────────────────────
const Centers = () => {
  const [centers, setCenters] = useState(DUMMY_CENTERS);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [targetCenter, setTargetCenter] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const isAdmin = currentUser?.role === "ADMIN";

  // Modal visibility
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [acceptOpen, setAcceptOpen] = useState(false);
  const [dispatchOpen, setDispatchOpen] = useState(false);

  // ── Summary stats ──
  const totalCenters = centers.length;
  const nearCapacity = centers.filter(
    (c) => c.currentLoad / c.maxCapacity >= 0.8
  ).length;
  const totalLoad = centers.reduce((s, c) => s + c.currentLoad, 0);
  const totalCapacity = centers.reduce((s, c) => s + c.maxCapacity, 0);

  // ── Handlers ──
  const handleAdd = (newCenter) => {
    setCenters((prev) => [...prev, newCenter]);
  };

  const handleEdit = (updated) => {
    setCenters((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
    if (selectedCenter?.id === updated.id) setSelectedCenter(updated);
  };

  const handleDelete = () => {
    setCenters((prev) => prev.filter((c) => c.id !== targetCenter.id));
    if (selectedCenter?.id === targetCenter.id) setSelectedCenter(null);
    setDeleteOpen(false);
  };

  const handleAcceptWaste = (centerId, newItem) => {
    setCenters((prev) =>
      prev.map((c) =>
        c.id === centerId
          ? {
              ...c,
              currentLoad: c.currentLoad + newItem.weight,
              wasteItems: [...c.wasteItems, newItem],
            }
          : c
      )
    );
  };

  const handleDispatch = () => {
    setCenters((prev) =>
      prev.map((c) =>
        c.id === targetCenter.id
          ? { ...c, currentLoad: 0, wasteItems: [] }
          : c
      )
    );
    setDispatchOpen(false);
  };

  // Open helpers
  const openEdit = (center) => { setTargetCenter(center); setEditOpen(true); };
  const openDelete = (center) => { setTargetCenter(center); setDeleteOpen(true); };
  const openAccept = (center) => { setTargetCenter(center); setAcceptOpen(true); };
  const openDispatch = (center) => { setTargetCenter(center); setDispatchOpen(true); };

  // ── Table columns ──
  const columns = [
    { key: "location", label: "Location" },
    {
      key: "capacity",
      label: "Capacity",
      render: (row) => (
        <div className="min-w-[160px]">
          <CapacityBar current={row.currentLoad} max={row.maxCapacity} />
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const s = getCapacityStatus(row.currentLoad, row.maxCapacity);
        return (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${s.cls}`}>
            {s.label}
          </span>
        );
      },
    },
    { key: "processorName", label: "Processor" },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setSelectedCenter(row)}
            className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
          >
            View
          </button>

          <button
            onClick={() => openEdit(row)}
            className="px-2 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600"
          >
            Edit
          </button>

          <button
            onClick={() => openAccept(row)}
            className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
          >
            Accept
          </button>

          <button
            onClick={() => openDispatch(row)}
            className="px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700"
          >
            Dispatch
          </button>

          {/* DELETE ONLY FOR ADMIN */}
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

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Collection Centers</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage waste collection points and their capacity
          </p>
        </div>

        <button
          onClick={() => setAddOpen(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
        >
          + Add Center
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Centers" value={totalCenters} icon="🏭" color="blue" />
        <StatCard label="Near / At Capacity" value={nearCapacity} icon="⚠️" color="yellow" />
        <StatCard label="Total Load (kg)" value={totalLoad} icon="📦" color="green" />
        <StatCard label="Total Capacity (kg)" value={totalCapacity} icon="📊" color="green" />
      </div>

      {/* Table */}
      <Table columns={columns} data={centers} />

      {/* Detail Panel */}
      <CenterDetailPanel
        center={selectedCenter}
        onClose={() => setSelectedCenter(null)}
        onAccept={openAccept}
        onDispatch={openDispatch}
      />

      {/* Modals */}
      <CenterFormModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
        processors={DUMMY_PROCESSORS}
      />

      <CenterFormModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={handleEdit}
        processors={DUMMY_PROCESSORS}
        center={targetCenter}
      />

      <DeleteCenterModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        center={targetCenter}
      />

      <AcceptWasteModal
        open={acceptOpen}
        onClose={() => setAcceptOpen(false)}
        onAccept={handleAcceptWaste}
        center={targetCenter}
      />

      <DispatchModal
        open={dispatchOpen}
        onClose={() => setDispatchOpen(false)}
        onConfirm={handleDispatch}
        center={targetCenter}
      />

    </div>
  );
};

export default Centers;