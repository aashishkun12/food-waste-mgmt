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

const ProcessorDetailPanel = ({ processor, onClose }) => {
  useEffect(() => {
    if (!processor) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [processor]);

  if (!processor) return null;

  const pct = processor.maxCapacity > 0
    ? ((processor.currentLoad / processor.maxCapacity) * 100).toFixed(0)
    : 0;

  return (
    <div className={modalOverlayClass}>
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden">
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              Processor Details
            </p>
            <h3 className="text-xl font-bold text-gray-800 mt-1">{processor.name}</h3>
            <p className="text-sm text-gray-500 mt-1">📍 {processor.location}</p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close processor details"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-100 hover:text-red-600"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="max-h-[80vh] overflow-y-auto p-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
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
              <p className="text-xl font-bold text-green-700 mt-1">{Number(processor.totalProcessed || 0).toFixed(2)} kg</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm font-medium text-gray-600 mb-2">Current Load</p>
            <CapacityBar current={processor.currentLoad} max={processor.maxCapacity} />
            {+pct >= 100 && (
              <p className="text-xs mt-2 font-semibold text-red-600">⛔ Processor is at full capacity.</p>
            )}
            {+pct >= 80 && +pct < 100 && (
              <p className="text-xs mt-2 font-semibold text-yellow-600">⚠️ Approaching max capacity.</p>
            )}
          </div>

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
                  <div key={c.id} className="border rounded-xl p-3 bg-gray-50 flex justify-between items-center gap-3">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{c.location}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Load: {c.currentLoad} / {c.maxCapacity} kg</p>
                    </div>
                    <div className="w-20 shrink-0">
                      <CapacityBar current={c.currentLoad} max={c.maxCapacity} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessorDetailPanel;
