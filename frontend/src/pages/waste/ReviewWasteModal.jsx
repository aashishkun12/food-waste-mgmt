import Modal from "../../components/ui/Modal";

const ReviewWasteModal = ({ open, onClose, onConfirm, item, action }) => {
  const isAccept = action === "accept";

  return (
    <Modal
      open={open}
      title={isAccept ? "Accept Waste Item" : "Reject Waste Item"}
      onClose={onClose}
    >
      <div className="space-y-3 text-sm text-gray-600">
        <p>
          <span className="font-semibold text-gray-800">{item?.type || "Waste"}</span> item weighing <span className="font-semibold text-gray-800">{item?.weight ?? 0} kg</span>
        </p>
        <p>
          Donor: <span className="font-semibold text-gray-800">{item?.donorName || "Unknown donor"}</span>
        </p>
        <p>
          Collection center: <span className="font-semibold text-gray-800">{item?.centerLocation || "Not assigned"}</span>
        </p>
        <p className="text-xs text-gray-500">
          {isAccept
            ? "This item will be marked as accepted and ready for dispatch to the processor."
            : "This item will be marked as rejected and excluded from dispatch."
          }
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
          className={`px-4 py-2 rounded text-sm text-white ${
            isAccept ? "bg-blue-600 hover:bg-blue-700" : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {isAccept ? "Confirm Accept" : "Confirm Reject"}
        </button>
      </div>
    </Modal>
  );
};

export default ReviewWasteModal;
