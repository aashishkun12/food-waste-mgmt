const DonorDetailPanel = ({ donor, onClose }) => {
  if (!donor) return null;

  return (
    <div className="mt-8 bg-white rounded-xl shadow p-6">

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{donor.name}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{donor.address}</p>
          <div className="flex gap-4 mt-1">
            <p className="text-sm text-gray-500">📧 {donor.contactEmail}</p>
            <p className="text-sm text-gray-500">📞 {donor.contactPhone}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
        >
          Close
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">

        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Donation Summary</h4>
          <p className="text-sm text-gray-600">Total donations recorded: <span className="font-semibold">{donor.totalDonations}</span></p>
          <p className="text-xs text-gray-400 mt-2">Waste item details are managed from the waste items section.</p>
        </div>

        {/* Collection Centers */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">
            Collection Centers
            <span className="ml-2 text-xs font-normal text-gray-400">
              ({donor.centers?.length || 0} centers)
            </span>
          </h4>
          {!donor.centers || donor.centers.length === 0 ? (
            <p className="text-sm text-gray-400">Not assigned to any center.</p>
          ) : (
            <ul className="space-y-2">
              {donor.centers.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 border rounded px-3 py-2"
                >
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block flex-shrink-0" />
                  {c.location}
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
};

export default DonorDetailPanel;
