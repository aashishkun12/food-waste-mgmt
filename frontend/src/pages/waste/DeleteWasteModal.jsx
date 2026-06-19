import Modal from "../../components/ui/Modal";

const DeleteWasteModal = ({ open, onClose, onConfirm, item }) => {
  return (
    <Modal open={open} title="Delete Waste Item" onClose={onClose}>
      <p className="text-gray-600 text-sm">
        Are you sure you want to delete this{" "}
        <span className="font-semibold text-gray-800">{item?.type}</span> item
        ({item?.weight} kg) from{" "}
        <span className="font-semibold text-gray-800">{item?.donorName}</span>?
        This action cannot be undone.
      </p>
      <div className="flex justify-end gap-2 mt-5">
        <button
          onClick={onClose}
          className="px-4 py-2 border rounded text-sm text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </Modal>
  );
};

export default DeleteWasteModal;
