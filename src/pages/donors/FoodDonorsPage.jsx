import { useState } from "react";
import Table from "../../components/ui/Table";
import DeleteDonorModal from "./DeleteDonorModal";

const FoodDonorsPage = () => {
  const DUMMY = [
    {
      id: 1,
      name: "Green Farm Foods",
      address: "Pokhara-8",
      email: "green@gmail.com",
      phone: "9800000001",
      donationCount: 12,
    },
    {
      id: 2,
      name: "Fresh Market",
      address: "Kathmandu",
      email: "fresh@gmail.com",
      phone: "9800000002",
      donationCount: 8,
    },
  ];

  const [donors, setDonors] = useState(DUMMY);
  const [deleteId, setDeleteId] = useState(null);

  const handleDelete = () => {
    setDonors((prev) =>
      prev.filter((d) => d.id !== deleteId)
    );
    setDeleteId(null);
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "address", label: "Address" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "donationCount", label: "Donations" },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button className="px-2 py-1 bg-blue-500 text-white rounded">
            View
          </button>

          <button className="px-2 py-1 bg-yellow-500 text-white rounded">
            Edit
          </button>

          <button
            onClick={() => setDeleteId(row.id)}
            className="px-2 py-1 bg-red-500 text-white rounded"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          Food Donors
        </h2>

        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + Add Donor
        </button>
      </div>

      {/* TABLE */}
      <Table columns={columns} data={donors} />

      {/* DELETE MODAL */}
      <DeleteDonorModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default FoodDonorsPage;