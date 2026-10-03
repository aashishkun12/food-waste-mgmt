import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import PaginatedTable from "../../components/ui/PaginatedTable";
import StatCard from "../../components/ui/StatCard";
import CapacityBar from "../../components/ui/CapacityBar";

import CenterDetailPanel from "./CenterDetailPanel";
import CenterFormModal from "./CenterFormModal";
import DeleteCenterModal from "./DeleteCenterModal";
import DispatchModal from "../dispatch/DispatchModal";
import DispatchWasteFilters from "../dispatch/DispatchWasteFilters";
import { getCurrentRole, hasRole } from "../../utils/auth";
import {
  createCenter,
  deleteCenter,
  dispatchCenter,
  dispatchWasteItem,
  getCenterSupportingData,
  getCenters,
  updateCenter,
} from "../../utils/centerApi";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getCapacityStatus = (current, max) => {
  const pct = (current / max) * 100;
  if (pct >= 100) return { label: "Full", cls: "bg-red-100 text-red-700" };
  if (pct >= 80) return { label: "Near Full", cls: "bg-yellow-100 text-yellow-700" };
  return { label: "OK", cls: "bg-green-100 text-green-700" };
};

const normalizeCenter = (center, wasteItems, donors, dispatchOnly) => {
  const dispatchReadyItems = wasteItems
    .filter((item) => item.collectionCenterId === center.id
      && item.accepted
      && !item.rejected
      && !item.processed
      && (dispatchOnly ? !item.dispatched : true))
    .map((item) => ({
      id: item.id,
      type: item.wasteType,
      donorName: item.donorName || "Unknown donor",
      weight: Number(item.weightKg || 0),
      expiry: item.expirationDate,
      status: item.processed ? "PROCESSED" : item.dispatched ? "DISPATCHED" : "ACCEPTED",
    }))
    .sort((first, second) => String(first.expiry || "9999-12-31").localeCompare(String(second.expiry || "9999-12-31")));

  const donorIds = new Set(
    wasteItems
      .filter((item) => item.collectionCenterId === center.id)
      .map((item) => item.donorId)
  );

  return {
    ...center,
    maxCapacity: Number(center.maxCapacityKg || 0),
    currentLoad: Number(center.currentLoadKg || 0),
    donors: donors.filter((donor) => donorIds.has(donor.id)),
    wasteItems: dispatchReadyItems,
  };
};

// ─── Component ────────────────────────────────────────────────────────────────
const Centers = ({ dispatchOnly = false }) => {
  const [centers, setCenters] = useState([]);
  const [processors, setProcessors] = useState([]);
  const [donors, setDonors] = useState([]);
  const [wasteItems, setWasteItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [targetCenter, setTargetCenter] = useState(null);
  const [targetItem, setTargetItem] = useState(null);
  const [dispatchStatus, setDispatchStatus] = useState("ALL");
  const [dispatchCenterName, setDispatchCenterName] = useState("");

  const navigate = useNavigate();
  const canManageCenters = hasRole("ROLE_ADMIN") || hasRole("ROLE_OPERATOR");
  const isAdmin = hasRole("ROLE_ADMIN");
  const canAddCenters = isAdmin;
  const canEditCenters = isAdmin;
  const canDeleteCenters = isAdmin;
  const canDispatch = dispatchOnly || isAdmin;

  useEffect(() => {
    if (!canManageCenters) {
      navigate("/dashboard");
    }
  }, [canManageCenters, navigate]);

  const loadCenters = async () => {
    setLoading(true);
    setError("");
    try {
      const [centerData, [processorData, donorData, wasteData]] = await Promise.all([
        getCenters(),
        getCenterSupportingData(),
      ]);
      setProcessors(processorData || []);
      setDonors(donorData || []);
      setWasteItems(wasteData || []);
      setCenters((centerData || []).map((center) =>
        normalizeCenter(center, wasteData || [], donorData || [], dispatchOnly)
      ));
    } catch (requestError) {
      setError(requestError.message || "Unable to load collection centers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canManageCenters) loadCenters();
  }, [canManageCenters]);

  // Modal visibility
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [dispatchOpen, setDispatchOpen] = useState(false);

  const formatMetric = (value) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(Number(value || 0));

  // ── Summary stats ──
  const totalCenters = centers.length;
  const nearCapacity = centers.filter(
    (c) => c.currentLoad / c.maxCapacity >= 0.8
  ).length;
  const totalLoad = Number(centers.reduce((s, c) => s + c.currentLoad, 0).toFixed(2));
  const totalCapacity = Number(centers.reduce((s, c) => s + c.maxCapacity, 0).toFixed(2));
  const visibleCenters = useMemo(() => {
    const nameQuery = dispatchCenterName.trim().toLowerCase();
    return centers.filter((center) => {
      if (!String(center.name || "").toLowerCase().includes(nameQuery)) return false;
      if (!dispatchOnly) return true;
      return Boolean(center.processorName)
        && center.wasteItems.some((item) => item.status === "ACCEPTED")
        && (dispatchStatus === "ALL" || center.wasteItems.some((item) => item.status === dispatchStatus));
    });
  }, [centers, dispatchOnly, dispatchStatus, dispatchCenterName]);

  // ── Handlers ──
  const handleAdd = async (newCenter) => {
    await createCenter(newCenter);
    await loadCenters();
  };

  const handleEdit = async (updated) => {
    await updateCenter(updated);
    await loadCenters();
    setSelectedCenter(null);
  };

  const handleDelete = async () => {
    await deleteCenter(targetCenter.id);
    setCenters((prev) => prev.filter((c) => c.id !== targetCenter.id));
    if (selectedCenter?.id === targetCenter.id) setSelectedCenter(null);
    setDeleteOpen(false);
  };

  const handleDispatch = async () => {
    if (!targetCenter) return;
    if (!targetCenter.processorName || !targetCenter.wasteItems?.some((item) => item.status === "ACCEPTED")) return;

    if (targetItem) {
      await dispatchWasteItem(targetCenter.id, targetItem.id);
    } else {
      await dispatchCenter(targetCenter.id);
    }
    await loadCenters();
    setSelectedCenter(null);
    setDispatchOpen(false);
    setTargetItem(null);
  };

  // Open helpers
  const openEdit = (center) => { setTargetCenter(center); setEditOpen(true); };
  const openDelete = (center) => { setTargetCenter(center); setDeleteOpen(true); };
  const openDispatch = (center) => { setTargetCenter(center); setTargetItem(null); setDispatchOpen(true); };
  const openItemDispatch = (center, item) => { setTargetCenter(center); setTargetItem(item); setDispatchOpen(true); };

  if (!canManageCenters) return null;

  const getDispatchStatus = (row) => {
    const statuses = new Set(row.wasteItems.map((item) => item.status));
    if (statuses.has("ACCEPTED")) return { label: "Accepted / Ready", cls: "bg-green-100 text-green-700" };
    if (statuses.has("DISPATCHED")) return { label: "Dispatched / Processing", cls: "bg-blue-100 text-blue-700" };
    if (statuses.has("PROCESSED")) return { label: "Processed", cls: "bg-purple-100 text-purple-700" };
    return { label: "No items", cls: "bg-gray-100 text-gray-600" };
  };

  // ── Table columns ──
  const columns = [
    { key: "name", label: "Name", width: "w-32" },
    { key: "location", label: "Location", width: "w-40" },
    {
      key: "capacity",
      label: "Capacity",
      width: "w-52",
      render: (row) => (
        <div className="min-w-[150px]">
          <CapacityBar current={row.currentLoad} max={row.maxCapacity} />
        </div>
      ),
    },
    {
      key: "status",
      label: dispatchOnly ? "Waste Status" : "Status",
      width: dispatchOnly ? "w-44" : "w-28",
      render: (row) => {
        if (dispatchOnly) {
          const dispatchStatus = getDispatchStatus(row);
          return <span className={`inline-flex whitespace-nowrap items-center justify-center text-xs font-semibold px-2 py-1 rounded-full ${dispatchStatus.cls}`}>{dispatchStatus.label}</span>;
        }
        const s = getCapacityStatus(row.currentLoad, row.maxCapacity);
        return (
          <span className={`inline-flex whitespace-nowrap items-center justify-center text-xs font-semibold px-2 py-1 rounded-full ${s.cls}`}>
            {s.label}
          </span>
        );
      },
    },
    { key: "processorName", label: "Processor", width: "w-36" },
    {
      key: "actions",
      label: "Actions",
      width: "w-52",
      render: (row) => (
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedCenter(row)}
            className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
          >
            View
          </button>

          {canEditCenters && (
            <button
              onClick={() => openEdit(row)}
              className="px-2 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600"
            >
              Edit
            </button>
          )}

          {canDispatch && (
            <button
              onClick={() => openDispatch(row)}
              className="px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700"
            >
              Dispatch
            </button>
          )}

          {canDeleteCenters && (
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
          <h2 className="text-2xl font-bold text-gray-800">{dispatchOnly ? "Dispatch Waste" : "Collection Centers"}</h2>
          <p className="text-sm text-gray-500 mt-1">
            {dispatchOnly ? "Dispatch accepted waste that is still waiting for its processor." : "View collection centers and their capacity"}
          </p>
        </div>

        {canAddCenters && (
          <button
            onClick={() => setAddOpen(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
          >
            + Add Center
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Centers" value={totalCenters} icon="🏭" color="blue" />
        <StatCard label="Near / At Capacity" value={nearCapacity} icon="⚠️" color="yellow" />
        <StatCard label="Total Load (kg)" value={formatMetric(totalLoad)} icon="📦" color="green" />
        <StatCard label="Total Capacity (kg)" value={formatMetric(totalCapacity)} icon="📊" color="green" />
      </div>

      <DispatchWasteFilters
        value={dispatchStatus}
        onChange={setDispatchStatus}
        centerName={dispatchCenterName}
        onCenterNameChange={setDispatchCenterName}
        showStatus={dispatchOnly}
      />

      {error && (
        <div className="mb-4 flex items-center justify-between rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>
          <button onClick={loadCenters} className="font-semibold underline">Retry</button>
        </div>
      )}

      {/* Table */}
      {loading ? <p className="text-gray-500">Loading collection centers...</p> : <PaginatedTable columns={columns} data={visibleCenters} pageSize={5} responsiveCards={dispatchOnly} />}

      {/* Detail Panel */}
      <CenterDetailPanel
        center={selectedCenter}
        onClose={() => setSelectedCenter(null)}
        onDispatch={canDispatch ? openDispatch : undefined}
        onDispatchItem={canDispatch ? openItemDispatch : undefined}
      />

      {/* Modals */}
      {canAddCenters && (
        <CenterFormModal
          open={addOpen}
          onClose={() => setAddOpen(false)}
          onSubmit={handleAdd}
          processors={processors}
        />
      )}

      {canEditCenters && (
        <CenterFormModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          onSubmit={handleEdit}
          processors={processors}
          center={targetCenter}
          donors={donors}
        />
      )}

      {canDeleteCenters && (
        <DeleteCenterModal
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          onConfirm={handleDelete}
          center={targetCenter}
        />
      )}

      {canDispatch && (
        <DispatchModal
          open={dispatchOpen}
          onClose={() => setDispatchOpen(false)}
          onConfirm={handleDispatch}
          center={targetCenter}
          item={targetItem}
        />
      )}

    </div>
  );
};

export default Centers;