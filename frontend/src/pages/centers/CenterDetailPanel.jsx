import CapacityBar from "../../components/ui/CapacityBar";

const CenterDetailPanel = ({ center, onClose, onAccept, onDispatch }) => {
  if (!center) return null;

  const pct = center.maxCapacity > 0
    ? (center.currentLoad / center.maxCapacity) * 100
    : 0;

  return (
    <div className="mt-8 bg-white rounded-xl shadow p-6">

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{center.location}</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Processor: {center.processorName}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onAccept(center)}
            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
          >
            Accept Waste
          </button>
          <button
            onClick={() => onDispatch(center)}
            className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
          >
            Dispatch to Processor
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>

      {/* Capacity meter */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-600 mb-2">Capacity</p>
        <CapacityBar current={center.currentLoad} max={center.maxCapacity} />
        {pct >= 100 && (
          <p className="text-xs mt-1 font-semibold text-red-600">
            ⛔ Center is full. Please dispatch before accepting more waste.
          </p>
        )}
        {pct >= 80 && pct < 100 && (
          <p className="text-xs mt-1 font-semibold text-yellow-600">
            ⚠️ Approaching capacity. Consider dispatching soon.
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">

        {/* Waste Items */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Current Waste Items</h4>
          {center.wasteItems.length === 0 ? (
            <p className="text-sm text-gray-400">No waste items currently held.</p>
          ) : (
            <table className="w-full text-sm border rounded overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left font-medium">Type</th>
                  <th className="p-2 text-left font-medium">Weight</th>
                  <th className="p-2 text-left font-medium">Expiry</th>
                </tr>
              </thead>
              <tbody>
                {center.wasteItems.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="p-2">
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                        {item.type}
                      </span>
                    </td>
                    <td className="p-2">{item.weight} kg</td>
                    <td className="p-2 text-gray-500">{item.expiry}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Donors */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Donors Delivering Here</h4>
          {center.donors.length === 0 ? (
            <p className="text-sm text-gray-400">No donors assigned.</p>
          ) : (
            <ul className="space-y-1">
              {center.donors.map((d, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                  {d}
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
};

export default CenterDetailPanel;
