import { useState } from "react";
import Modal from "../../components/ui/Modal";

const DeleteCenterModal = ({ open, onClose, onConfirm, center }) => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    setDeleting(true);
    setError("");
    try {
      await onConfirm();
      onClose();
    } catch (requestError) {
      setError(requestError.message || "Unable to delete center.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal open={open} title="Delete Center" onClose={onClose}>
      <p className="text-gray-600 text-sm">
        Are you sure you want to delete{" "}
        <span className="font-semibold text-gray-800">{center?.location}</span>?
        This action cannot be undone.
      </p>
      <div className="flex justify-end gap-2 mt-5">
        <button
          onClick={onClose}
          disabled={deleting}
          className="px-4 py-2 border rounded text-sm text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          disabled={deleting}
          className="px-4 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600"
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
    </Modal>
  );
};

export default DeleteCenterModal;
