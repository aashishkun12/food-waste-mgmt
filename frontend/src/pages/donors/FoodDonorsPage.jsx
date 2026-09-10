import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../components/ui/Table";
import StatCard from "../../components/ui/StatCard";
import { getCurrentRole, hasRole } from "../../utils/auth";
import { getCenters } from "../../utils/centerApi";
import { createDonor, deleteDonor, getDonors, updateDonor } from "../../utils/donorApi";
import DonorFormModal from "./DonorFormModal";
import DeleteDonorModal from "./DeleteDonorModal";
import DonorDetailPanel from "./DonorDetailPanel";

const normalizeDonor = (donor, centers) => {
  const locations = donor.collectionCenterLocations || [];
  const assignedCenters = locations.map((location, index) => {
    const center = centers.find((candidate) => candidate.location === location);
    return { id: center?.id || `${donor.id}-${index}`, location };
  });

  return {
    ...donor,
    contactEmail: donor.contactEmail || "",
    contactPhone: donor.contactPhone || "",
    totalDonations: Number(donor.totalDonations || 0),
    centers: assignedCenters,
    collectionCenterIds: assignedCenters.filter((center) => typeof center.id === "number").map((center) => center.id),
  };
};

const FoodDonorsPage = () => {
  const [donors, setDonors] = useState([]);
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [targetDonor, setTargetDonor] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const navigate = useNavigate();
  const role = getCurrentRole();
  const isAdmin = hasRole("ROLE_ADMIN");
  const isDonor = hasRole("ROLE_DONOR");
  const canViewDonors = isAdmin || hasRole("ROLE_OPERATOR") || isDonor;

  useEffect(() => {
    if (!canViewDonors) {
      navigate("/dashboard");
    }
  }, [canViewDonors, navigate]);

  const loadDonors = async () => {
    setLoading(true);
    setError("");
    try {
      const [donorData, centerData] = await Promise.all([getDonors(), getCenters()]);
      const availableCenters = centerData || [];
      setCenters(availableCenters);
      setDonors((donorData || []).map((donor) => normalizeDonor(donor, availableCenters)));
    } catch (requestError) {
      setError(requestError.message || "Unable to load donors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canViewDonors) loadDonors();
  }, [canViewDonors]);

  const handleAdd = async (donor) => {
    const created = await createDonor(donor);
    setDonors((previous) => [...previous, normalizeDonor(created, centers)]);
  };

  const handleEdit = async (donor) => {
    const saved = await updateDonor(donor);
    const normalized = normalizeDonor(saved, centers);
    setDonors((previous) => previous.map((item) => item.id === normalized.id ? normalized : item));
    if (selectedDonor?.id === normalized.id) setSelectedDonor(normalized);
  };

  const handleDelete = async () => {
    await deleteDonor(targetDonor.id);
    setDonors((previous) => previous.filter((donor) => donor.id !== targetDonor.id));
    if (selectedDonor?.id === targetDonor.id) setSelectedDonor(null);
    setDeleteOpen(false);
    setTargetDonor(null);
  };

  if (!canViewDonors) return null;

  const columns = [
    { key: "name", label: "Name" },
    { key: "address", label: "Address" },
    { key: "contactEmail", label: "Email" },
    { key: "contactPhone", label: "Phone" },
    {
      key: "totalDonations",
      label: "Donations",
      render: (row) => <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 text-sm font-semibold">{row.totalDonations}</span>,
    },
    {
      key: "centers",
      label: "Centers",
      render: (row) => <span className="text-sm text-gray-600">{row.centers.length} center{row.centers.length !== 1 ? "s" : ""}</span>,
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          <button onClick={() => setSelectedDonor(row)} className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600">View</button>
          {!isDonor && <button onClick={() => { setTargetDonor(row); setEditOpen(true); }} className="px-2 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600">Edit</button>}
          {isAdmin && <button onClick={() => { setTargetDonor(row); setDeleteOpen(true); }} className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600">Delete</button>}
        </div>
      ),
    },
  ];

  const totalDonations = donors.reduce((sum, donor) => sum + donor.totalDonations, 0);
  const totalCentersServed = new Set(donors.flatMap((donor) => donor.centers.map((center) => center.id))).size;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Food Donors</h2>
          <p className="text-sm text-gray-500 mt-1">Manage donors and their collection center assignments</p>
        </div>
        {!isDonor && <button onClick={() => setAddOpen(true)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">+ Add Donor</button>}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Donors" value={donors.length} icon="🤝" color="blue" />
        <StatCard label="Total Donations" value={totalDonations} icon="📦" color="green" />
        <StatCard label="Centers Served" value={totalCentersServed} icon="🏭" color="yellow" />
      </div>

      {error && <div className="mb-4 flex items-center justify-between rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"><span>{error}</span><button onClick={loadDonors} className="font-semibold underline">Retry</button></div>}
      {loading ? <p className="text-gray-500">Loading donors...</p> : <Table columns={columns} data={donors} />}

      <DonorDetailPanel donor={selectedDonor} onClose={() => setSelectedDonor(null)} />
      <DonorFormModal open={addOpen} onClose={() => setAddOpen(false)} onSubmit={handleAdd} centers={centers} />
      <DonorFormModal open={editOpen} onClose={() => { setEditOpen(false); setTargetDonor(null); }} onSubmit={handleEdit} donor={targetDonor} centers={centers} />
      <DeleteDonorModal open={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDelete} donor={targetDonor} />
    </div>
  );
};

export default FoodDonorsPage;
