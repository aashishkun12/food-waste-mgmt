import Modal from "../../components/ui/Modal";

const DispatchModal = ({ open, onClose, onConfirm, center, item }) => {
  const readyItems = item
    ? [item]
    : center?.wasteItems?.filter((entry) => entry.status === "ACCEPTED") ?? [];

  const hasProcessor = Boolean(center?.processorName);
  const canDispatch = hasProcessor && readyItems.length > 0;

  return (
    <Modal
      open={open}
      title={`${item ? "Dispatch Item" : "Dispatch to Processor"} — ${
        center?.location ?? "Center"
      }`}
      onClose={onClose}
    >
      <div className="text-sm text-gray-600 space-y-3">
        {hasProcessor ? (
          <>
            <p>
              {item
                ? `${item.type} waste will be dispatched to:`
                : "Accepted waste from this collection center will be dispatched to:"}
            </p>

            <p className="font-semibold text-gray-800">
              {center.processorName}
            </p>
          </>
        ) : (
          <p className="font-medium text-amber-700">
            This center does not have a processor assigned yet.
          </p>
        )}

        {/* Current waste items */}
        {readyItems.length > 0 && (
          <div className="border rounded-lg overflow-hidden mt-3">
            <div className="bg-gray-50 px-3 py-2 border-b">
              <p className="font-medium text-gray-800">
                Current Waste Items
              </p>
            </div>

            <div className="divide-y">
              {readyItems.map((wasteItem, index) => (
                <div
                  key={wasteItem._id ?? wasteItem.id ?? index}
                  className="px-3 py-3"
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <p className="font-medium text-gray-800">
                        {wasteItem.type ?? "Waste"}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        Donor:{" "}
                        <span className="font-medium text-gray-700">
                          {wasteItem.donorName ?? wasteItem.donor?.name ?? "Unknown"}
                        </span>
                      </p>
                    </div>

                    <p className="text-sm font-medium text-gray-700">
                      {wasteItem.weight ?? 0} kg
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {canDispatch ? (
          <p className="text-yellow-600 text-xs mt-2">
            This sends the displayed waste items to the processor.
          </p>
        ) : (
          <p className="text-amber-600 text-xs mt-2">
            Dispatch requires an assigned processor and accepted waste ready
            to send.
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
