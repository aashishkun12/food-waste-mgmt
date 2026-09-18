import { useEffect } from "react";
import CapacityBar from "../../components/ui/CapacityBar";
import { modalOverlayClass } from "../../components/ui/Modal";

const CloseIcon = () => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 6L18 18M18 6L6 18" />
  </svg>
);

const CenterDetailPanel = ({ center, onClose, onAccept, onDispatch }) => {
  useEffect(() => {
    if (!center) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [center]);

  if (!center) return null;

  const pct = center.maxCapacity > 0
    ? (center.currentLoad / center.maxCapacity) * 100
    : 0;

  return (
    <div className={modalOverlayClass}>
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden">
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              Center Details
            </p>
            <h3 className="text-xl font-bold text-gray-800 mt-1">{center.location}</h3>
            <p className="text-sm text-gray-500 mt-1">Processor: {center.processorName}</p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close center details"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-100 hover:text-red-600"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="max-h-[80vh] overflow-y-auto p-5">
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-600 mb-2">Capacity</p>
            <CapacityBar current={center.currentLoad} max={center.maxCapacity} />
            {pct >= 100 && (
              <p className="text-xs mt-2 font-semibold text-red-600">
                ⛔ Center is full. Please dispatch before accepting more waste.
              </p>
            )}
            {pct >= 80 && pct < 100 && (
              <p className="text-xs mt-2 font-semibold text-yellow-600">
                ⚠️ Approaching capacity. Consider dispatching soon.
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Donors Delivering Here</h4>
              {center.donors.length === 0 ? (
                <p className="text-sm text-gray-400">No donors assigned.</p>
              ) : (
                <ul className="space-y-2">
                  {center.donors.map((donor) => (
                    <li key={donor.id} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                      {donor.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            {onAccept && (
              <button
                onClick={() => onAccept(center)}
                className="px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                Accept Waste
              </button>
            )}
            {onDispatch && (
              <button
                onClick={() => onDispatch(center)}
                className="px-3 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
              >
                Dispatch to Processor
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CenterDetailPanel;
