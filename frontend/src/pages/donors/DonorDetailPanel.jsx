const WASTE_TYPE_COLORS = {
  VEGETABLES: "bg-green-100 text-green-700",
  DAIRY:      "bg-blue-100 text-blue-700",
  GRAINS:     "bg-yellow-100 text-yellow-700",
  MEAT:       "bg-red-100 text-red-700",
  FRUITS:     "bg-orange-100 text-orange-700",
  BEVERAGES:  "bg-purple-100 text-purple-700",
  OTHER:      "bg-gray-100 text-gray-700",
};

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
            <p className="text-sm text-gray-500">📧 {donor.email}</p>
            <p className="text-sm text-gray-500">📞 {donor.phone}</p>
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

        {/* Waste Items */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">
            Waste Items Donated
            <span className="ml-2 text-xs font-normal text-gray-400">
              ({donor.wasteItems?.length || 0} items)
            </span>
          </h4>
          {!donor.wasteItems || donor.wasteItems.length === 0 ? (
            <p className="text-sm text-gray-400">No waste items donated yet.</p>
          ) : (
            <table className="w-full text-sm border rounded overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left font-medium">Type</th>
                  <th className="p-2 text-left font-medium">Weight</th>
                  <th className="p-2 text-left font-medium">Expiry</th>
                  <th className="p-2 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {donor.wasteItems.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="p-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${WASTE_TYPE_COLORS[item.type] || "bg-gray-100 text-gray-700"}`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="p-2">{item.weight} kg</td>
                    <td className="p-2 text-gray-500">{item.expiry}</td>
                    <td className="p-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.processed ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {item.processed ? "Processed" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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
