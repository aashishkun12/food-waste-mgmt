import Modal from "../../components/ui/Modal";

import { useState } from "react";

const DeleteProcessorModal = ({ open, onClose, onConfirm, processor }) => {
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);
    setError("");
    try {
      await onConfirm();
      onClose();
    } catch (requestError) {
      setError(requestError.message || "Unable to delete processor.");
    } finally {
      setDeleting(false);
    }
  };

  return <Modal open={open} title="Delete Processor" onClose={onClose}>
    <p className="text-gray-600 text-sm">
      Are you sure you want to delete{" "}
      <span className="font-semibold text-gray-800">{processor?.name}</span>?
      This will unlink all collection centers assigned to it. This action cannot be undone.
    </p>
    <div className="flex justify-end gap-2 mt-5">
      {error && <p className="text-red-500 text-sm mr-auto">{error}</p>}
      <button onClick={onClose} disabled={deleting} className="px-4 py-2 border rounded text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50">
        Cancel
      </button>
      <button onClick={handleConfirm} disabled={deleting} className="px-4 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 disabled:opacity-50">
        {deleting ? "Deleting..." : "Delete"}
      </button>
    </div>
  </Modal>
};

export default DeleteProcessorModal;
