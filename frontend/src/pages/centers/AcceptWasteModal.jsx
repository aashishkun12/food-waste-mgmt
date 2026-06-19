import { useState, useEffect } from "react";
import Modal from "../../components/ui/Modal";
import CapacityBar from "../../components/ui/CapacityBar";

const WASTE_TYPES = [
  "VEGETABLES",
  "DAIRY",
  "GRAINS",
  "MEAT",
  "FRUITS",
  "BEVERAGES",
  "OTHER",
];

const emptyForm = {
  type: "VEGETABLES",
  weight: "",
  expiry: "",
};

const AcceptWasteModal = ({ open, onClose, onAccept, center }) => {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const remainingCapacity =
    center ? center.maxCapacity - center.currentLoad : 0;

  useEffect(() => {
    if (open) {
      setForm(emptyForm);
      setErrors({});
      setSubmitError("");
    }
  }, [open]);

  const validate = () => {
    const e = {};

    const weight = Number(form.weight);

    if (!form.type) e.type = "Waste type is required";

    if (form.weight === "" || form.weight === null) {
      e.weight = "Weight is required";
    } else if (!Number.isFinite(weight) || weight <= 0) {
      e.weight = "Enter a valid weight greater than 0";
    } else if (center && weight > remainingCapacity) {
      e.weight = `Exceeds remaining capacity (${remainingCapacity} kg)`;
    }

    if (!form.expiry) {
      e.expiry = "Expiration date is required";
    }

    return e;
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleAccept = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      await onAccept(center.id, {
        id: Date.now(),
        type: form.type,
        weight: Number(form.weight),
        expiry: form.expiry,
      });

      onClose();
    } catch (err) {
      setSubmitError(err?.message || "Failed to accept waste. Try again.");
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
      title={`Accept Waste — ${center?.location}`}
      onClose={handleClose}
    >
      <div className="flex flex-col gap-3">

        {submitError && (
          <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded p-2">
            {submitError}
          </p>
        )}

        {/* Waste Type */}
        <div>
          <label className="text-sm text-gray-600 mb-1 block">Waste Type</label>
          <select
            value={form.type}
            disabled={submitting}
            onChange={(e) => handleChange("type", e.target.value)}
            className={`border rounded w-full p-2 text-sm focus:outline-none focus:border-green-500 ${
              errors.type ? "border-red-400" : "border-gray-300"
            }`}
          >
            {WASTE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {errors.type && (
            <p className="text-red-500 text-xs mt-1">{errors.type}</p>
          )}
        </div>

        {/* Weight */}
        <div>
          <label className="text-sm text-gray-600 mb-1 block">
            Weight (kg)
          </label>
          <input
            type="number"
            value={form.weight}
            disabled={submitting}
            onChange={(e) => handleChange("weight", e.target.value)}
            className={`border rounded w-full p-2 text-sm focus:outline-none focus:border-green-500 ${
              errors.weight ? "border-red-400" : "border-gray-300"
            }`}
            placeholder="e.g. 50"
            min={1}
          />
          {errors.weight && (
            <p className="text-red-500 text-xs mt-1">{errors.weight}</p>
          )}

          {center && (
            <p className="text-xs text-gray-500 mt-1">
              Remaining capacity: {remainingCapacity} kg
            </p>
          )}
        </div>

        {/* Expiry */}
        <div>
          <label className="text-sm text-gray-600 mb-1 block">
            Expiration Date
          </label>
          <input
            type="date"
            value={form.expiry}
            disabled={submitting}
            onChange={(e) => handleChange("expiry", e.target.value)}
            className={`border rounded w-full p-2 text-sm focus:outline-none focus:border-green-500 ${
              errors.expiry ? "border-red-400" : "border-gray-300"
            }`}
          />
          {errors.expiry && (
            <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>
          )}
        </div>

        {/* Capacity preview */}
        {center && (
          <div className="mt-1">
            <p className="text-xs text-gray-500 mb-1">Current capacity</p>
            <CapacityBar
              current={center.currentLoad}
              max={center.maxCapacity}
            />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 mt-5">
        <button
          onClick={handleClose}
          disabled={submitting}
          className="px-4 py-2 border rounded text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          onClick={handleAccept}
          disabled={submitting}
          className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
        >
          {submitting ? "Processing..." : "Accept Waste"}
        </button>
      </div>
    </Modal>
  );
};

export default AcceptWasteModal;