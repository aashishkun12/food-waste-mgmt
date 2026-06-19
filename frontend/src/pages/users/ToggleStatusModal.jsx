const ToggleStatusModal = ({ open, user, onClose, onConfirm }) => {
  if (!open || !user) return null;

  const willActivate = !user.active;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-lg font-semibold">
          {willActivate ? "Activate User" : "Deactivate User"}
        </h2>

        <p className="mt-2 text-gray-600">
          Are you sure you want to {willActivate ? "activate" : "deactivate"}{" "}
          <span className="font-medium">{user.username}</span>?
          {!willActivate && " They will lose access until reactivated."}
        </p>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-3 py-1 border rounded">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-3 py-1 rounded text-white ${
              willActivate ? "bg-green-600" : "bg-red-500"
            }`}
          >
            {willActivate ? "Activate" : "Deactivate"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToggleStatusModal;