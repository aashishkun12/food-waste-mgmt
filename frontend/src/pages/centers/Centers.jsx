import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Table from "../../components/ui/Table";
import StatCard from "../../components/ui/StatCard";
import CapacityBar from "../../components/ui/CapacityBar";

import CenterDetailPanel from "./CenterDetailPanel";
import CenterFormModal from "./CenterFormModal";
import DeleteCenterModal from "./DeleteCenterModal";
import DispatchModal from "./DispatchModal";
import { getCurrentRole, hasRole } from "../../utils/auth";
import {
  createCenter,
  deleteCenter,
  dispatchCenter,
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

const normalizeCenter = (center, wasteItems, donors) => {
  const wasteHeld = wasteItems
    .filter((item) => item.collectionCenterId === center.id && !item.processed)
    .map((item) => ({
      id: item.id,
      type: item.wasteType,
      weight: Number(item.weightKg || 0),
      expiry: item.expirationDate,
    }));
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
    wasteItems: wasteHeld,
  };
};

// ─── Component ────────────────────────────────────────────────────────────────
const Centers = () => {
  const [centers, setCenters] = useState([]);
  const [processors, setProcessors] = useState([]);
  const [donors, setDonors] = useState([]);
  const [wasteItems, setWasteItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [targetCenter, setTargetCenter] = useState(null);

  const navigate = useNavigate();
  const canManageCenters = hasRole("ROLE_ADMIN") || hasRole("ROLE_OPERATOR");
  const isAdmin = hasRole("ROLE_ADMIN");

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
        normalizeCenter(center, wasteData || [], donorData || [])
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

  // ── Summary stats ──
  const totalCenters = centers.length;
  const nearCapacity = centers.filter(
    (c) => c.currentLoad / c.maxCapacity >= 0.8
  ).length;
  const totalLoad = centers.reduce((s, c) => s + c.currentLoad, 0);
  const totalCapacity = centers.reduce((s, c) => s + c.maxCapacity, 0);

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
    await dispatchCenter(targetCenter.id);
    await loadCenters();
    setSelectedCenter(null);
    setDispatchOpen(false);
  };

  // Open helpers
  const openEdit = (center) => { setTargetCenter(center); setEditOpen(true); };
  const openDelete = (center) => { setTargetCenter(center); setDeleteOpen(true); };
  const openDispatch = (center) => { setTargetCenter(center); setDispatchOpen(true); };

  if (!canManageCenters) return null;

  // ── Table columns ──
  const columns = [
    { key: "name", label: "Name" },
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
            onClick={() => openDispatch(row)}
            className="px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700"
          >
            Dispatch
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

      {error && (
        <div className="mb-4 flex items-center justify-between rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>
          <button onClick={loadCenters} className="font-semibold underline">Retry</button>
        </div>
      )}

      {/* Table */}
      {loading ? <p className="text-gray-500">Loading collection centers...</p> : <Table columns={columns} data={centers} />}

      {/* Detail Panel */}
      <CenterDetailPanel
        center={selectedCenter}
        onClose={() => setSelectedCenter(null)}
        onDispatch={openDispatch}
      />

      {/* Modals */}
      <CenterFormModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
        processors={processors}
      />

      <CenterFormModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={handleEdit}
        processors={processors}
        center={targetCenter}
        donors={donors}
      />

      <DeleteCenterModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
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