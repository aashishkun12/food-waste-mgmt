import { useEffect, useMemo, useState } from "react";
import {
  createProcessor,
  deleteProcessor,
  getProcessorSupportingData,
  getProcessors,
  updateProcessor,
} from "../../utils/processorApi";
import { getCurrentRole, hasRole } from "../../utils/auth";
import PaginatedTable from "../../components/ui/PaginatedTable";
import StatCard from "../../components/ui/StatCard";
import CapacityBar from "../../components/ui/CapacityBar";
import ProcessorFormModal from "./ProcessorFormModal";
import DeleteProcessorModal from "./DeleteProcessorModal";
import ProcessorDetailPanel from "./ProcessorDetailPanel";
import { completeWasteProcessing } from "../../utils/wasteApi";

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
  const processingItems = wasteItems.filter(
    (item) => item.dispatched && !item.processed && centerIds.has(item.collectionCenterId)
  ).sort((first, second) => String(first.expirationDate || "9999-12-31")
    .localeCompare(String(second.expirationDate || "9999-12-31")) || first.id - second.id);

  return {
    ...processor,
    maxCapacity: Number(processor.maxProcessingCapacityKg || 0),
    currentLoad: Number(processor.currentLoadKg || 0),
    totalProcessed,
    processingItems,
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
  const [searchTerm, setSearchTerm] = useState("");
  const [queueFilter, setQueueFilter] = useState("ALL");

  const [addOpen, setAddOpen]       = useState(false);
  const [editOpen, setEditOpen]     = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Role check
  const role = getCurrentRole();
  const isAdmin = hasRole("ROLE_ADMIN");
  const canManageProcessors = hasRole("ROLE_ADMIN") || hasRole("ROLE_OPERATOR");
  const canEditProcessors = isAdmin;

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

  const formatMetric = (value) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(Number(value || 0));

  // ── Summary stats ──
  const totalLoad       = Number(processors.reduce((s, p) => s + p.currentLoad, 0).toFixed(2));
  const totalProcessed  = Number(processors.reduce((s, p) => s + p.totalProcessed, 0).toFixed(2));
  const nearFull        = processors.filter((p) => p.currentLoad / p.maxCapacity >= 0.8).length;
  const visibleProcessors = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return processors
      .filter((processor) => {
        const matchesSearch = `${processor.name} ${processor.location}`.toLowerCase().includes(query);
        const hasWaitingItems = processor.processingItems.length > 0;
        const matchesQueue = queueFilter === "ALL"
          || (queueFilter === "WAITING" && hasWaitingItems)
          || (queueFilter === "IDLE" && !hasWaitingItems);
        return matchesSearch && matchesQueue;
      })
      .sort((first, second) => {
        const firstExpiry = first.processingItems[0]?.expirationDate || "9999-12-31";
        const secondExpiry = second.processingItems[0]?.expirationDate || "9999-12-31";
        return firstExpiry.localeCompare(secondExpiry) || first.name.localeCompare(second.name);
      });
  }, [processors, searchTerm, queueFilter]);

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

  const handleCompleteProcessing = async (itemId) => {
    await completeWasteProcessing(itemId);
    await loadProcessors();
    setSelectedProcessor(null);
  };

  const openEdit   = (p) => { setTargetProcessor(p); setEditOpen(true);   };
  const openDelete = (p) => { setTargetProcessor(p); setDeleteOpen(true); };

  if (!canManageProcessors) {
    return <div className="p-6 text-sm text-red-600">You do not have access to processors. Current role: {role || "unknown"}.</div>;
  }

  // ── Table columns ──
  const columns = [
    { key: "name",     label: "Name", width: "w-[14%]" },
    { key: "location", label: "Location", width: "w-[11%]" },
    {
      key: "nextExpiry",
      label: "Next Expiry",
      width: "w-[15%]",
      render: (row) => row.processingItems.length > 0 ? (
        <div>
          <p className="text-sm font-semibold text-amber-800">{row.processingItems[0].expirationDate || "Date unavailable"}</p>
          <p className="text-xs text-gray-500">{row.processingItems.length} item{row.processingItems.length === 1 ? "" : "s"} waiting</p>
        </div>
      ) : <span className="text-sm text-gray-400">No waiting items</span>,
    },
    {
      key: "capacity",
      label: "Load / Capacity",
      width: "w-[19%]",
      render: (row) => (
        <div className="min-w-0">
          <CapacityBar current={row.currentLoad} max={row.maxCapacity} />
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      width: "w-[9%]",
      render: (row) => {
        const s = getStatus(row.currentLoad, row.maxCapacity);
        return (
          <span className={`inline-flex whitespace-nowrap text-xs font-semibold px-2 py-1 rounded-full ${s.cls}`}>
            {s.label}
          </span>
        );
      },
    },
    {
      key: "totalProcessed",
      label: "Total Processed",
      width: "w-[12%]",
      render: (row) => (
        <span className="text-sm font-medium text-gray-700">{Number(row.totalProcessed || 0).toFixed(2)} kg</span>
      ),
    },
    {
      key: "centers",
      label: "Centers",
      width: "w-[8%]",
      render: (row) => (
        <span className="text-sm text-gray-600">
          {row.centers?.length || 0} center{row.centers?.length !== 1 ? "s" : ""}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      width: "w-[12%]",
      render: (row) => (
        <div className="flex flex-wrap items-center gap-1">
          <button
            onClick={() => setSelectedProcessor(row)}
            className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
          >
            View
          </button>
          {canEditProcessors && (
            <button
              onClick={() => openEdit(row)}
              className="px-2 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600"
            >
              Edit
            </button>
          )}
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
            {isAdmin ? "Manage waste processing facilities and their capacity" : "View processor details and current capacity"}
          </p>
        </div>
        {canEditProcessors && (
          <button
            onClick={() => setAddOpen(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
          >
            + Add Processor
          </button>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Processors"  value={processors.length} icon="🏭" color="blue"   />
        <StatCard label="Near / At Capacity" value={nearFull}          icon="⚠️" color="yellow" />
        <StatCard label="Total Load (kg)"   value={formatMetric(totalLoad)} icon="📦" color="green"  />
        <StatCard label="Ever Processed"    value={`${formatMetric(totalProcessed)} kg`} icon="✅" color="green" />
      </div>

      {error && (
        <div className="mb-4 flex items-center justify-between rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>
          <button onClick={loadProcessors} className="font-semibold underline">Retry</button>
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-end gap-3 border-y border-gray-200 py-3">
        <div className="flex min-w-56 flex-1 flex-col gap-1">
          <label htmlFor="processor-search" className="text-xs font-medium text-gray-600">Find processor</label>
          <input
            id="processor-search"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search name or location"
            className="rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="processor-queue-filter" className="text-xs font-medium text-gray-600">Processing queue</label>
          <select
            id="processor-queue-filter"
            value={queueFilter}
            onChange={(event) => setQueueFilter(event.target.value)}
            className="rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
          >
            <option value="ALL">All processors</option>
            <option value="WAITING">Has waiting items</option>
            <option value="IDLE">No waiting items</option>
          </select>
        </div>
        <p className="pb-2 text-xs text-gray-500">Processors are ordered by the soonest expiry.</p>
      </div>

      {/* Table */}
      {loading ? <p className="text-gray-500">Loading processors...</p> : <PaginatedTable columns={columns} data={visibleProcessors} pageSize={5} />}

      {/* Detail Panel */}
      <ProcessorDetailPanel
        processor={selectedProcessor}
        onClose={() => setSelectedProcessor(null)}
        onCompleteProcessing={handleCompleteProcessing}
      />

      {/* Modals */}
      {canEditProcessors && (
        <ProcessorFormModal
          open={addOpen}
          onClose={() => setAddOpen(false)}
          onSubmit={handleAdd}
          processor={null}
        />
      )}

      {canEditProcessors && (
        <ProcessorFormModal
          open={editOpen}
          onClose={() => { setEditOpen(false); setTargetProcessor(null); }}
          onSubmit={handleEdit}
          processor={targetProcessor}
        />
      )}

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
