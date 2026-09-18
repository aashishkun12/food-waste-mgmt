import Modal from "../../components/ui/Modal";

const DispatchModal = ({ open, onClose, onConfirm, center }) => {
  const totalItems = center?.wasteItems?.length ?? 0;
  const totalWeight = Number(center?.currentLoad ?? 0);
  const hasProcessor = Boolean(center?.processorName);
  const canDispatch = hasProcessor && totalItems > 0;

  return (
    <Modal
      open={open}
      title={`Dispatch to Processor — ${center?.location ?? "Center"}`}
      onClose={onClose}
    >
      <div className="text-sm text-gray-600 space-y-2">
        {hasProcessor ? (
          <>
            <p>You are about to dispatch all waste from this center to:</p>
            <p className="font-semibold text-gray-800">{center.processorName}</p>
          </>
        ) : (
          <p className="font-medium text-amber-700">
            This center does not have a processor assigned yet.
          </p>
        )}

        <div className="bg-gray-50 border rounded p-3 mt-2 space-y-1">
          <p>
            Total items:{" "}
            <span className="font-medium">{totalItems}</span>
          </p>
          <p>
            Total weight:{" "}
            <span className="font-medium">{totalWeight} kg</span>
          </p>
        </div>

        {canDispatch ? (
          <p className="text-yellow-600 text-xs mt-2">
            ⚠️ This will clear all waste items and reset the center load to 0.
          </p>
        ) : (
          <p className="text-amber-600 text-xs mt-2">
            ⚠️ Dispatch is unavailable until this center has a processor and pending waste.
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2 mt-5">
        <button
          onClick={onClose}
          className="px-4 py-2 border rounded text-sm text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={canDispatch ? onConfirm : undefined}
          disabled={!canDispatch}
          className={`px-4 py-2 rounded text-sm ${
            canDispatch
              ? "bg-purple-600 text-white hover:bg-purple-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Confirm Dispatch
        </button>
      </div>
    </Modal>
  );
};

export default DispatchModal;
