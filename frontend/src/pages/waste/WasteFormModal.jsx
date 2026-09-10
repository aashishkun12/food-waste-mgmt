import { useEffect, useState } from "react";
import Modal from "../../components/ui/Modal";

const WASTE_TYPES = ["VEGETABLES", "DAIRY", "GRAINS", "MEAT", "FRUITS", "BEVERAGES", "OTHER"];
const emptyForm = { weight: "", expiry: "", type: "VEGETABLES", donorId: "", centerId: "" };
const getToday = () => new Date().toISOString().split("T")[0];

const WasteFormModal = ({ open, onClose, onSubmit, item, donors = [], centers = [] }) => {
  const isEdit = Boolean(item);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!open) return;
    setForm(item ? {
      weight: item.weight ?? "",
      expiry: item.expiry || "",
      type: item.type || "VEGETABLES",
      donorId: item.donorId ?? "",
      centerId: item.centerId ?? "",
    } : emptyForm);
    setErrors({});
    setSubmitError("");
  }, [open, item]);

  const validate = () => {
    const nextErrors = {};
    if (!form.weight || Number(form.weight) <= 0) nextErrors.weight = "Valid weight is required";
    if (!form.expiry) nextErrors.expiry = "Expiration date is required";
    else if (new Date(`${form.expiry}T00:00:00`) <= new Date()) nextErrors.expiry = "Expiration date must be in the future";
    if (!form.donorId) nextErrors.donorId = "Donor is required";
    if (!form.centerId) nextErrors.centerId = "Collection center is required";
    return nextErrors;
  };

  const handleSubmit = async () => {
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    try {
      await onSubmit({
        ...(item || {}),
        weight: Number(form.weight),
        expiry: form.expiry,
        type: form.type,
        donorId: Number(form.donorId),
        centerId: Number(form.centerId),
      });
      onClose();
    } catch (requestError) {
      setSubmitError(requestError.message || `Failed to ${isEdit ? "update" : "add"} waste item.`);
    } finally {
      setSubmitting(false);
    }
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
        {submitError && <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded p-2">{submitError}</p>}
        {field("type", "Waste Type", <select value={form.type} disabled={submitting} onChange={(event) => setForm((previous) => ({ ...previous, type: event.target.value }))} className="border border-gray-300 rounded w-full p-2 text-sm">
          {WASTE_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
        </select>)}
        {field("weight", "Weight (kg)", <input type="number" min="0.01" value={form.weight} disabled={submitting} onChange={(event) => setForm((previous) => ({ ...previous, weight: event.target.value }))} className="border border-gray-300 rounded w-full p-2 text-sm" />)}
        {field("expiry", "Expiration Date", <input type="date" min={getToday()} value={form.expiry} disabled={submitting} onChange={(event) => setForm((previous) => ({ ...previous, expiry: event.target.value }))} className="border border-gray-300 rounded w-full p-2 text-sm" />)}
        {field("donorId", "Donor", <select value={form.donorId} disabled={submitting} onChange={(event) => setForm((previous) => ({ ...previous, donorId: event.target.value }))} className="border border-gray-300 rounded w-full p-2 text-sm">
          <option value="">Select donor</option>
          {donors.map((donor) => <option key={donor.id} value={donor.id}>{donor.name}</option>)}
        </select>)}
        {field("centerId", "Collection Center", <select value={form.centerId} disabled={submitting} onChange={(event) => setForm((previous) => ({ ...previous, centerId: event.target.value }))} className="border border-gray-300 rounded w-full p-2 text-sm">
          <option value="">Select center</option>
          {centers.map((center) => <option key={center.id} value={center.id}>{center.name ? `${center.name} - ${center.location}` : center.location}</option>)}
        </select>)}
        {donors.length === 0 && <p className="text-xs text-gray-500">No donors are available.</p>}
        {centers.length === 0 && <p className="text-xs text-gray-500">No collection centers are available.</p>}
      </div>
      <div className="flex justify-end gap-2 mt-5">
        <button onClick={onClose} disabled={submitting} className="px-4 py-2 border rounded text-sm text-gray-600 disabled:opacity-50">Cancel</button>
        <button onClick={handleSubmit} disabled={submitting} className={`px-4 py-2 text-white rounded text-sm disabled:opacity-50 ${isEdit ? "bg-yellow-500" : "bg-green-600"}`}>{submitting ? "Saving..." : isEdit ? "Save Changes" : "Add Item"}</button>
      </div>
    </Modal>
  );
};

export default WasteFormModal;
