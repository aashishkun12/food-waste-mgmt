import { useState } from "react";
import Table from "../../components/ui/Table";
import StatCard from "../../components/ui/StatCard";
import CapacityBar from "../../components/ui/CapacityBar";
import ProcessorFormModal from "./ProcessorFormModal";
import DeleteProcessorModal from "./DeleteProcessorModal";
import ProcessorDetailPanel from "./ProcessorDetailPanel";

// ─── Dummy Data ───────────────────────────────────────────────────────────────
const DUMMY_PROCESSORS = [
  {
    id: 1,
    name: "GreenCycle Processor",
    location: "Kathmandu",
    maxCapacity: 1000,
    currentLoad: 720,
    totalProcessed: 4800,
    centers: [
      { id: 1, location: "Kathmandu - Baneshwor", currentLoad: 420, maxCapacity: 500 },
      { id: 3, location: "Lalitpur - Patan",      currentLoad: 400, maxCapacity: 400 },
    ],
  },
  {
    id: 2,
    name: "EcoWaste Solutions",
    location: "Pokhara",
    maxCapacity: 800,
    currentLoad: 210,
    totalProcessed: 3100,
    centers: [
      { id: 2, location: "Pokhara - Lakeside", currentLoad: 90, maxCapacity: 300 },
    ],
  },
  {
    id: 3,
    name: "BioConvert Ltd.",
    location: "Lalitpur",
    maxCapacity: 600,
    currentLoad: 598,
    totalProcessed: 2200,
    centers: [],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getStatus = (current, max) => {
  const pct = (current / max) * 100;
  if (pct >= 100) return { label: "Full",      cls: "bg-red-100 text-red-700"       };
  if (pct >= 80)  return { label: "Near Full", cls: "bg-yellow-100 text-yellow-700" };
  return               { label: "Available", cls: "bg-green-100 text-green-700"   };
};

// ─── Component ────────────────────────────────────────────────────────────────
const ProcessorsPage = () => {
  const [processors, setProcessors] = useState(DUMMY_PROCESSORS);
  const [selectedProcessor, setSelectedProcessor] = useState(null);
  const [targetProcessor, setTargetProcessor]     = useState(null);

  const [addOpen, setAddOpen]       = useState(false);
  const [editOpen, setEditOpen]     = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Role check
  const user    = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "ADMIN";

  // ── Summary stats ──
  const totalCapacity   = processors.reduce((s, p) => s + p.maxCapacity, 0);
  const totalLoad       = processors.reduce((s, p) => s + p.currentLoad, 0);
  const totalProcessed  = processors.reduce((s, p) => s + p.totalProcessed, 0);
  const nearFull        = processors.filter((p) => p.currentLoad / p.maxCapacity >= 0.8).length;

  // ── Handlers ──
  const handleAdd = (newProcessor) => {
    setProcessors((prev) => [...prev, newProcessor]);
  };

  const handleEdit = (updated) => {
    setProcessors((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    if (selectedProcessor?.id === updated.id) setSelectedProcessor(updated);
  };

  const handleDelete = () => {
    setProcessors((prev) => prev.filter((p) => p.id !== targetProcessor.id));
    if (selectedProcessor?.id === targetProcessor.id) setSelectedProcessor(null);
    setDeleteOpen(false);
  };

  const openEdit   = (p) => { setTargetProcessor(p); setEditOpen(true);   };
  const openDelete = (p) => { setTargetProcessor(p); setDeleteOpen(true); };

  // ── Table columns ──
  const columns = [
    { key: "name",     label: "Name"     },
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
        const s = getStatus(row.currentLoad, row.maxCapacity);
        return (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${s.cls}`}>
            {s.label}
          </span>
        );
      },
    },
    {
      key: "totalProcessed",
      label: "Total Processed",
      render: (row) => (
        <span className="text-sm font-medium text-gray-700">{row.totalProcessed} kg</span>
      ),
    },
    {
      key: "centers",
      label: "Centers",
      render: (row) => (
        <span className="text-sm text-gray-600">
          {row.centers?.length || 0} center{row.centers?.length !== 1 ? "s" : ""}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-1">
          <button
            onClick={() => setSelectedProcessor(row)}
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
          <h2 className="text-2xl font-bold text-gray-800">Processors</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage waste processing facilities and their capacity
          </p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
        >
          + Add Processor
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Processors"  value={processors.length} icon="🏭" color="blue"   />
        <StatCard label="Near / At Capacity" value={nearFull}          icon="⚠️" color="yellow" />
        <StatCard label="Total Load (kg)"   value={totalLoad}          icon="📦" color="green"  />
        <StatCard label="Ever Processed"    value={`${totalProcessed} kg`} icon="✅" color="green" />
      </div>

      {/* Table */}
      <Table columns={columns} data={processors} />

      {/* Detail Panel */}
      <ProcessorDetailPanel
        processor={selectedProcessor}
        onClose={() => setSelectedProcessor(null)}
      />

      {/* Modals */}
      <ProcessorFormModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
        processor={null}
      />

      <ProcessorFormModal
        open={editOpen}
        onClose={() => { setEditOpen(false); setTargetProcessor(null); }}
        onSubmit={handleEdit}
        processor={targetProcessor}
      />

      <DeleteProcessorModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        processor={targetProcessor}
      />

    </div>
  );
};

export default ProcessorsPage;
