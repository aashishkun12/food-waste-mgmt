import { useEffect, useState } from "react";
import {
  createProcessor,
  deleteProcessor,
  getProcessorSupportingData,
  getProcessors,
  updateProcessor,
} from "../../utils/processorApi";
import { getCurrentRole, hasRole } from "../../utils/auth";
import Table from "../../components/ui/Table";
import StatCard from "../../components/ui/StatCard";
import CapacityBar from "../../components/ui/CapacityBar";
import ProcessorFormModal from "./ProcessorFormModal";
import DeleteProcessorModal from "./DeleteProcessorModal";
import ProcessorDetailPanel from "./ProcessorDetailPanel";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const normalizeProcessor = (processor, centers = [], wasteItems = []) => {
  const assignedCenters = centers
    .filter((center) => center.processorId === processor.id)
    .map((center) => ({
      id: center.id,
      location: center.location,
      currentLoad: Number(center.currentLoadKg || 0),
      maxCapacity: Number(center.maxCapacityKg || 0),
    }));
  const centerIds = new Set(assignedCenters.map((center) => center.id));
  const totalProcessed = wasteItems
    .filter((item) => item.processed && centerIds.has(item.collectionCenterId))
    .reduce((sum, item) => sum + Number(item.weightKg || 0), 0);

  return {
    ...processor,
    maxCapacity: Number(processor.maxProcessingCapacityKg || 0),
    currentLoad: Number(processor.currentLoadKg || 0),
    totalProcessed,
    centers: assignedCenters,
  };
};

const getStatus = (current, max) => {
  const pct = (current / max) * 100;
  if (pct >= 100) return { label: "Full",      cls: "bg-red-100 text-red-700"       };
  if (pct >= 80)  return { label: "Near Full", cls: "bg-yellow-100 text-yellow-700" };
  return               { label: "Available", cls: "bg-green-100 text-green-700"   };
};

// ─── Component ────────────────────────────────────────────────────────────────
const ProcessorsPage = () => {
  const [processors, setProcessors] = useState([]);
  const [centers, setCenters] = useState([]);
  const [wasteItems, setWasteItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProcessor, setSelectedProcessor] = useState(null);
  const [targetProcessor, setTargetProcessor]     = useState(null);

  const [addOpen, setAddOpen]       = useState(false);
  const [editOpen, setEditOpen]     = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Role check
  const role = getCurrentRole();
  const isAdmin = hasRole("ROLE_ADMIN");
  const canManageProcessors = hasRole("ROLE_ADMIN") || hasRole("ROLE_OPERATOR");

  const loadProcessors = async () => {
    setLoading(true);
    setError("");
    try {
      const [processorData, [centerData, wasteData]] = await Promise.all([
        getProcessors(),
        getProcessorSupportingData(),
      ]);
      setCenters(centerData || []);
      setWasteItems(wasteData || []);
      setProcessors((processorData || []).map((processor) =>
        normalizeProcessor(processor, centerData || [], wasteData || [])
      ));
    } catch (requestError) {
      setError(requestError.message || "Unable to load processors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canManageProcessors) loadProcessors();
  }, [canManageProcessors]);

  // ── Summary stats ──
  const totalLoad       = processors.reduce((s, p) => s + p.currentLoad, 0);
  const totalProcessed  = processors.reduce((s, p) => s + p.totalProcessed, 0);
  const nearFull        = processors.filter((p) => p.currentLoad / p.maxCapacity >= 0.8).length;

  // ── Handlers ──
  const handleAdd = async (newProcessor) => {
    const created = await createProcessor(newProcessor);
    setProcessors((prev) => [...prev, normalizeProcessor(created, centers, wasteItems)]);
  };

  const handleEdit = async (updated) => {
    const saved = await updateProcessor(updated);
    const normalized = normalizeProcessor(saved, centers, wasteItems);
    setProcessors((prev) => prev.map((p) => (p.id === normalized.id ? normalized : p)));
    if (selectedProcessor?.id === normalized.id) setSelectedProcessor(normalized);
  };

  const handleDelete = async () => {
    await deleteProcessor(targetProcessor.id);
    setProcessors((prev) => prev.filter((p) => p.id !== targetProcessor.id));
    if (selectedProcessor?.id === targetProcessor.id) setSelectedProcessor(null);
    setDeleteOpen(false);
  };

  const openEdit   = (p) => { setTargetProcessor(p); setEditOpen(true);   };
  const openDelete = (p) => { setTargetProcessor(p); setDeleteOpen(true); };

  if (!canManageProcessors) {
    return <div className="p-6 text-sm text-red-600">You do not have access to processors. Current role: {role || "unknown"}.</div>;
  }

  // ── Table columns ──
  const columns = [
    { key: "name",     label: "Name"     },
    { key: "location", label: "Location" },
    {
      key: "capacity",
      label: "Current Load / Max Capacity",
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

      {error && (
        <div className="mb-4 flex items-center justify-between rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>
          <button onClick={loadProcessors} className="font-semibold underline">Retry</button>
        </div>
      )}

      {/* Table */}
      {loading ? <p className="text-gray-500">Loading processors...</p> : <Table columns={columns} data={processors} />}

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
