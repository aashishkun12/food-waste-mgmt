import { useState } from "react";
import Table from "../../components/ui/Table";
import StatCard from "../../components/ui/StatCard";
import DonorFormModal from "./DonorFormModal";
import DeleteDonorModal from "./DeleteDonorModal";
import DonorDetailPanel from "./DonorDetailPanel";

// ─── Dummy Data ───────────────────────────────────────────────────────────────
const DUMMY_DONORS = [
  {
    id: 1,
    name: "Green Farm Foods",
    address: "Pokhara-8",
    email: "green@gmail.com",
    phone: "9800000001",
    donationCount: 12,
    centers: [
      { id: 1, location: "Kathmandu - Baneshwor" },
      { id: 2, location: "Pokhara - Lakeside" },
    ],
    wasteItems: [
      { id: 11, type: "VEGETABLES", weight: 80, expiry: "2026-06-21", processed: true },
      { id: 12, type: "FRUITS", weight: 40, expiry: "2026-06-22", processed: false },
    ],
  },
  {
    id: 2,
    name: "Fresh Market",
    address: "Kathmandu",
    email: "fresh@gmail.com",
    phone: "9800000002",
    donationCount: 8,
    centers: [{ id: 1, location: "Kathmandu - Baneshwor" }],
    wasteItems: [
      { id: 21, type: "DAIRY", weight: 60, expiry: "2026-06-20", processed: false },
    ],
  },
  {
    id: 3,
    name: "Pokhara Organics",
    address: "Pokhara Lakeside",
    email: "organics@gmail.com",
    phone: "9800000003",
    donationCount: 5,
    centers: [{ id: 2, location: "Pokhara - Lakeside" }],
    wasteItems: [],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
const FoodDonorsPage = () => {
  const [donors, setDonors] = useState(DUMMY_DONORS);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [targetDonor, setTargetDonor] = useState(null);

  // Get logged-in user role
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "ADMIN";
  const isDonor = user?.role === "DONOR";

  // Modal visibility
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // ── Summary stats ──
  const totalDonors = donors.length;
  const totalDonations = donors.reduce((s, d) => s + d.donationCount, 0);
  const totalCentersServed = [...new Set(donors.flatMap((d) => d.centers.map((c) => c.id)))].length;

  // ── Handlers ──
  const handleAdd = (newDonor) => {
    setDonors((prev) => [...prev, newDonor]);
  };

  const handleEdit = (updated) => {
    setDonors((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    if (selectedDonor?.id === updated.id) setSelectedDonor(updated);
  };

  const handleDelete = () => {
    setDonors((prev) => prev.filter((d) => d.id !== targetDonor.id));
    if (selectedDonor?.id === targetDonor.id) setSelectedDonor(null);
    setDeleteOpen(false);
  };

  const openEdit = (donor) => { setTargetDonor(donor); setEditOpen(true); };
  const openDelete = (donor) => { setTargetDonor(donor); setDeleteOpen(true); };

  // ── Table columns ──
  const columns = [
    { key: "name", label: "Name" },
    { key: "address", label: "Address" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    {
      key: "donationCount",
      label: "Donations",
      render: (row) => (
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
          {row.donationCount}
        </span>
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
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setSelectedDonor(row)}
            className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
          >
            View
          </button>

          {/* DONOR role sees read-only — no Edit or Delete */}
          {!isDonor && (
            <button
              onClick={() => openEdit(row)}
              className="px-2 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600"
            >
              Edit
            </button>
          )}

          {/* Delete is ADMIN only */}
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
          <h2 className="text-2xl font-bold text-gray-800">Food Donors</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage donors and their collection center assignments
          </p>
        </div>
        {/* Only ADMIN and OPERATOR can add donors */}
        {!isDonor && (
          <button
            onClick={() => setAddOpen(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
          >
            + Add Donor
          </button>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Donors" value={totalDonors} icon="🤝" color="blue" />
        <StatCard label="Total Donations" value={totalDonations} icon="📦" color="green" />
        <StatCard label="Centers Served" value={totalCentersServed} icon="🏭" color="yellow" />
      </div>

      {/* Table */}
      <Table columns={columns} data={donors} />

      {/* Detail Panel */}
      <DonorDetailPanel
        donor={selectedDonor}
        onClose={() => setSelectedDonor(null)}
      />

      {/* Modals */}
      <DonorFormModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
      />

      <DonorFormModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={handleEdit}
        donor={targetDonor}
      />

      <DeleteDonorModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        donor={targetDonor}
      />

    </div>
  );
};

export default FoodDonorsPage;