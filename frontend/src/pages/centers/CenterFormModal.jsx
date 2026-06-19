import { useState, useEffect } from "react";
import Modal from "../../components/ui/Modal";

const emptyForm = { location: "", maxCapacity: "", processorId: "" };

const CenterFormModal = ({ open, onClose, onSubmit, processors, center }) => {
  const isEdit = Boolean(center);

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (open) {
      setForm(
        center
          ? {
              location: center.location || "",
              maxCapacity: center.maxCapacity ?? "",
              processorId: center.processorId ?? "",
            }
          : emptyForm
      );
      setErrors({});
      setSubmitError("");
    }
  }, [open, center]);

  const validate = () => {
    const e = {};

    if (!form.location.trim()) e.location = "Location is required";
    else if (form.location.trim().length < 3) e.location = "Location must be at least 3 characters";

    const capacity = Number(form.maxCapacity);
    if (form.maxCapacity === "" || form.maxCapacity === null) {
      e.maxCapacity = "Max capacity is required";
    } else if (!Number.isFinite(capacity) || capacity <= 0) {
      e.maxCapacity = "Enter a valid capacity greater than 0";
    } else if (isEdit && center?.currentLoad && capacity < center.currentLoad) {
      e.maxCapacity = `Cannot be less than current load (${center.currentLoad} kg)`;
    }

    if (!form.processorId) e.processorId = "Select a processor";

    return e;
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const processor = processors.find((p) => p.id === +form.processorId);

    setSubmitting(true);
    setSubmitError("");
    try {
      await onSubmit({
        ...(isEdit ? center : { id: Date.now(), currentLoad: 0, donors: [], wasteItems: [] }),
        location: form.location.trim(),
        maxCapacity: +form.maxCapacity,
        processorId: +form.processorId,
        processorName: processor?.name || "",
      });
      onClose();
    } catch (err) {
      setSubmitError(
        err?.message || `Failed to ${isEdit ? "update" : "add"} center. Please try again.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  return (
    <Modal
      open={open}
      title={isEdit ? "Edit Collection Center" : "Add Collection Center"}
      onClose={handleClose}
    >
      <div className="flex flex-col gap-3">
        {submitError && (
          <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded p-2">
            {submitError}
          </p>
        )}

        <div>
          <label className="text-sm text-gray-600 mb-1 block">Location</label>
          <input
            type="text"
            value={form.location}
            disabled={submitting}
            onChange={(e) => handleChange("location", e.target.value)}
            className={`border rounded w-full p-2 text-sm focus:outline-none focus:border-green-500 disabled:bg-gray-100 ${errors.location ? "border-red-400" : "border-gray-300"}`}
            placeholder="e.g. Kathmandu - Baneshwor"
          />
          {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-1 block">Max Capacity (kg)</label>
          <input
            type="number"
            value={form.maxCapacity}
            disabled={submitting}
            onChange={(e) => handleChange("maxCapacity", e.target.value)}
            className={`border rounded w-full p-2 text-sm focus:outline-none focus:border-green-500 disabled:bg-gray-100 ${errors.maxCapacity ? "border-red-400" : "border-gray-300"}`}
            placeholder="e.g. 500"
            min={1}
          />
          {errors.maxCapacity && <p className="text-red-500 text-xs mt-1">{errors.maxCapacity}</p>}
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-1 block">Assigned Processor</label>
          <select
            value={form.processorId}
            disabled={submitting}
            onChange={(e) => handleChange("processorId", e.target.value)}
            className={`border rounded w-full p-2 text-sm focus:outline-none focus:border-green-500 disabled:bg-gray-100 ${errors.processorId ? "border-red-400" : "border-gray-300"}`}
          >
            <option value="">Select processor</option>
            {processors.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          {errors.processorId && <p className="text-red-500 text-xs mt-1">{errors.processorId}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-5">
        <button
          onClick={handleClose}
          disabled={submitting}
          className="px-4 py-2 border rounded text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className={`px-4 py-2 rounded text-sm text-white disabled:opacity-50 ${
            isEdit ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {submitting ? (isEdit ? "Saving..." : "Adding...") : isEdit ? "Save Changes" : "Add Center"}
        </button>
      </div>
    </Modal>
  );
};

export default CenterFormModal;