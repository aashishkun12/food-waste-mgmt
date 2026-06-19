import Modal from "../../components/ui/Modal";

const DispatchModal = ({ open, onClose, onConfirm, center }) => {
  return (
    <Modal
      open={open}
      title={`Dispatch to Processor — ${center?.location}`}
      onClose={onClose}
    >
      <div className="text-sm text-gray-600 space-y-2">
        <p>You are about to dispatch all waste from this center to:</p>
        <p className="font-semibold text-gray-800">{center?.processorName}</p>

        <div className="bg-gray-50 border rounded p-3 mt-2 space-y-1">
          <p>
            Total items:{" "}
            <span className="font-medium">{center?.wasteItems?.length}</span>
          </p>
          <p>
            Total weight:{" "}
            <span className="font-medium">{center?.currentLoad} kg</span>
          </p>
        </div>

        <p className="text-yellow-600 text-xs mt-2">
          ⚠️ This will clear all waste items and reset the center load to 0.
        </p>
      </div>

      <div className="flex justify-end gap-2 mt-5">
        <button
          onClick={onClose}
          className="px-4 py-2 border rounded text-sm text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
        >
          Confirm Dispatch
        </button>
      </div>
    </Modal>
  );
};

export default DispatchModal;
