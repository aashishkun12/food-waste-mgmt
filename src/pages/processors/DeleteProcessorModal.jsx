import Modal from "../../components/ui/Modal";

const DeleteProcessorModal = ({ open, onClose, onConfirm, processor }) => (
  <Modal open={open} title="Delete Processor" onClose={onClose}>
    <p className="text-gray-600 text-sm">
      Are you sure you want to delete{" "}
      <span className="font-semibold text-gray-800">{processor?.name}</span>?
      This will unlink all collection centers assigned to it. This action cannot be undone.
    </p>
    <div className="flex justify-end gap-2 mt-5">
      <button onClick={onClose} className="px-4 py-2 border rounded text-sm text-gray-600 hover:bg-gray-50">
        Cancel
      </button>
      <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600">
        Delete
      </button>
    </div>
  </Modal>
);

export default DeleteProcessorModal;
