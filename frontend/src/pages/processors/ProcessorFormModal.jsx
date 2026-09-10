import { useState, useEffect } from "react";
import Modal from "../../components/ui/Modal";

const emptyForm = { name: "", location: "", maxCapacity: "" };

const ProcessorFormModal = ({ open, onClose, onSubmit, processor }) => {
  const isEdit = !!processor;
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (processor) {
      setForm({ name: processor.name, location: processor.location, maxCapacity: processor.maxCapacity });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
    setSubmitError("");
    setSaving(false);
  }, [processor, open]);

  const validate = () => {
    const e = {};
    if (!form.name.trim())        e.name        = "Name is required";
    if (!form.location.trim())    e.location    = "Location is required";
    if (!form.maxCapacity || +form.maxCapacity <= 0) e.maxCapacity = "Valid capacity is required";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSaving(true);
    setSubmitError("");
    try {
      await onSubmit({
        ...(processor || {}),
        id: processor?.id,
        name: form.name.trim(),
        location: form.location.trim(),
        maxCapacity: +form.maxCapacity,
      });
      onClose();
    } catch (error) {
      setSubmitError(error.message || "Unable to save processor.");
    } finally {
      setSaving(false);
    }
  };

  const inputCls = (key) =>
    `border rounded w-full p-2 text-sm focus:outline-none focus:border-green-500 ${errors[key] ? "border-red-400" : "border-gray-300"}`;

  return (
    <Modal open={open} title={isEdit ? "Edit Processor" : "Add Processor"} onClose={onClose}>
      <div className="flex flex-col gap-3">

        <div>
          <label className="text-sm text-gray-600 mb-1 block">Processor Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className={inputCls("name")}
            placeholder="e.g. GreenCycle Processor"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-1 block">Location</label>
          <input
            type="text"
            value={form.location}
            onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            className={inputCls("location")}
            placeholder="e.g. Kathmandu"
          />
          {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-1 block">Max Processing Capacity (kg)</label>
          <input
            type="number"
            value={form.maxCapacity}
            onChange={(e) => setForm((f) => ({ ...f, maxCapacity: e.target.value }))}
            className={inputCls("maxCapacity")}
            placeholder="e.g. 1000"
            min={1}
          />
          {errors.maxCapacity && <p className="text-red-500 text-xs mt-1">{errors.maxCapacity}</p>}
        </div>

      </div>
      {submitError && <p className="text-red-500 text-sm mt-3">{submitError}</p>}
      <div className="flex justify-end gap-2 mt-5">
        <button onClick={onClose} disabled={saving} className="px-4 py-2 border rounded text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50">
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className={`px-4 py-2 text-white rounded text-sm ${isEdit ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-600 hover:bg-green-700"}`}
        >
          {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Processor"}
        </button>
      </div>
    </Modal>
  );
};

export default ProcessorFormModal;
