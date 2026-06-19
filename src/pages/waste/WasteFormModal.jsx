import { useState, useEffect } from "react";
import Modal from "../../components/ui/Modal";

const WASTE_TYPES = ["VEGETABLES", "DAIRY", "GRAINS", "MEAT", "FRUITS", "BEVERAGES", "OTHER"];

const DUMMY_DONORS = [
  { id: 1, name: "Green Farm Foods" },
  { id: 2, name: "Fresh Market" },
  { id: 3, name: "Pokhara Organics" },
];

const DUMMY_CENTERS = [
  { id: 1, location: "Kathmandu - Baneshwor" },
  { id: 2, location: "Pokhara - Lakeside" },
  { id: 3, location: "Lalitpur - Patan" },
];

const emptyForm = {
  weight: "",
  expiry: "",
  type: "VEGETABLES",
  donorId: "",
  centerId: "",
};

const WasteFormModal = ({ open, onClose, onSubmit, item }) => {
  const isEdit = !!item;
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (item) {
      setForm({
        weight: item.weight,
        expiry: item.expiry,
        type: item.type,
        donorId: item.donorId,
        centerId: item.centerId,
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [item, open]);

  const validate = () => {
    const e = {};
    if (!form.weight || +form.weight <= 0) e.weight = "Valid weight is required";
    if (!form.expiry) e.expiry = "Expiration date is required";
    if (!form.donorId) e.donorId = "Donor is required";
    if (!form.centerId) e.centerId = "Collection center is required";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    const donor = DUMMY_DONORS.find((d) => d.id === +form.donorId);
    const center = DUMMY_CENTERS.find((c) => c.id === +form.centerId);

    onSubmit({
      ...(item || {}),
      id: item?.id || Date.now(),
      weight: +form.weight,
      expiry: form.expiry,
      type: form.type,
      donorId: +form.donorId,
      donorName: donor?.name || "",
      centerId: +form.centerId,
      centerLocation: center?.location || "",
      processed: item?.processed || false,
    });
    onClose();
  };

  const field = (key, label, content) => (
    <div>
      <label className="text-sm text-gray-600 mb-1 block">{label}</label>
      {content}
      {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <Modal open={open} title={isEdit ? "Edit Waste Item" : "Add Waste Item"} onClose={onClose}>
      <div className="flex flex-col gap-3">

        {/* Waste Type */}
        {field("type", "Waste Type",
          <select
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            className="border border-gray-300 rounded w-full p-2 text-sm focus:outline-none focus:border-green-500"
          >
            {WASTE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        )}

        {/* Weight */}
        {field("weight", "Weight (kg)",
          <input
            type="number"
            value={form.weight}
            onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))}
            className={`border rounded w-full p-2 text-sm focus:outline-none focus:border-green-500 ${errors.weight ? "border-red-400" : "border-gray-300"}`}
            placeholder="e.g. 50"
            min={1}
          />
        )}

        {/* Expiry */}
        {field("expiry", "Expiration Date",
          <input
            type="date"
            value={form.expiry}
            onChange={(e) => setForm((f) => ({ ...f, expiry: e.target.value }))}
            className={`border rounded w-full p-2 text-sm focus:outline-none focus:border-green-500 ${errors.expiry ? "border-red-400" : "border-gray-300"}`}
          />
        )}

        {/* Donor */}
        {field("donorId", "Donor",
          <select
            value={form.donorId}
            onChange={(e) => setForm((f) => ({ ...f, donorId: e.target.value }))}
            className={`border rounded w-full p-2 text-sm focus:outline-none focus:border-green-500 ${errors.donorId ? "border-red-400" : "border-gray-300"}`}
          >
            <option value="">Select donor</option>
            {DUMMY_DONORS.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        )}

        {/* Collection Center */}
        {field("centerId", "Collection Center",
          <select
            value={form.centerId}
            onChange={(e) => setForm((f) => ({ ...f, centerId: e.target.value }))}
            className={`border rounded w-full p-2 text-sm focus:outline-none focus:border-green-500 ${errors.centerId ? "border-red-400" : "border-gray-300"}`}
          >
            <option value="">Select center</option>
            {DUMMY_CENTERS.map((c) => <option key={c.id} value={c.id}>{c.location}</option>)}
          </select>
        )}

      </div>
      <div className="flex justify-end gap-2 mt-5">
        <button onClick={onClose} className="px-4 py-2 border rounded text-sm text-gray-600 hover:bg-gray-50">
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className={`px-4 py-2 text-white rounded text-sm ${isEdit ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-600 hover:bg-green-700"}`}
        >
          {isEdit ? "Save Changes" : "Add Item"}
        </button>
      </div>
    </Modal>
  );
};

export default WasteFormModal;
