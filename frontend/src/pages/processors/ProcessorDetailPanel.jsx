import CapacityBar from "../../components/ui/CapacityBar";

const ProcessorDetailPanel = ({ processor, onClose }) => {
  if (!processor) return null;

  const pct = processor.maxCapacity > 0
    ? ((processor.currentLoad / processor.maxCapacity) * 100).toFixed(0)
    : 0;

  return (
    <div className="mt-8 bg-white rounded-xl shadow p-6">

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{processor.name}</h3>
          <p className="text-sm text-gray-500 mt-0.5">📍 {processor.location}</p>
        </div>
        <button
          onClick={onClose}
          className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
        >
          Close
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-xs text-blue-600 font-medium">Max Capacity</p>
          <p className="text-xl font-bold text-blue-700 mt-1">{processor.maxCapacity} kg</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-xs text-yellow-600 font-medium">Current Load</p>
          <p className="text-xl font-bold text-yellow-700 mt-1">{processor.currentLoad} kg</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-xs text-green-600 font-medium">Total Processed</p>
          <p className="text-xl font-bold text-green-700 mt-1">{processor.totalProcessed} kg</p>
        </div>
      </div>

      {/* Capacity bar */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-600 mb-2">Current Load</p>
        <CapacityBar current={processor.currentLoad} max={processor.maxCapacity} />
        {+pct >= 100 && (
          <p className="text-xs mt-1 font-semibold text-red-600">⛔ Processor is at full capacity.</p>
        )}
        {+pct >= 80 && +pct < 100 && (
          <p className="text-xs mt-1 font-semibold text-yellow-600">⚠️ Approaching max capacity.</p>
        )}
      </div>

      {/* Collection centers sending to this processor */}
      <div>
        <h4 className="font-semibold text-gray-700 mb-3">
          Collection Centers Sending Here
          <span className="ml-2 text-xs font-normal text-gray-400">
            ({processor.centers?.length || 0} centers)
          </span>
        </h4>
        {!processor.centers || processor.centers.length === 0 ? (
          <p className="text-sm text-gray-400">No collection centers currently assigned.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {processor.centers.map((c) => (
              <div key={c.id} className="border rounded-xl p-3 bg-gray-50 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-800">{c.location}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Load: {c.currentLoad} / {c.maxCapacity} kg</p>
                </div>
                <div className="w-20">
                  <CapacityBar current={c.currentLoad} max={c.maxCapacity} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default ProcessorDetailPanel;
