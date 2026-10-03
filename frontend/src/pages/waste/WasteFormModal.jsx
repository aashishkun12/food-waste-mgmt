import { useEffect, useState } from "react";
import Modal from "../../components/ui/Modal";

const WASTE_TYPES = ["VEGETABLES", "DAIRY", "GRAINS", "MEAT", "FRUITS", "BEVERAGES", "OTHER"];
const MAX_EXPIRY_DAYS = { VEGETABLES: 7, MEAT: 5, DAIRY: 10, FRUITS: 7, GRAINS: 180, BEVERAGES: 90, OTHER: 30 };
const emptyForm = { weight: "", expiry: "", type: "", donorId: "", centerId: "" };
const toLocalDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const getToday = () => toLocalDateString(new Date());
const getFirstValidExpiryDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return toLocalDateString(tomorrow);
};
const getMaxExpiryDate = (type) => {
  const maxDays = MAX_EXPIRY_DAYS[type];
  if (!maxDays) return undefined;
  const latestDate = new Date();
  latestDate.setDate(latestDate.getDate() + maxDays);
  return toLocalDateString(latestDate);
};
const daysUntilExpiry = (expiry) => {
  const [year, month, day] = expiry.split("-").map(Number);
  const [todayYear, todayMonth, todayDay] = getToday().split("-").map(Number);
  return (Date.UTC(year, month - 1, day) - Date.UTC(todayYear, todayMonth - 1, todayDay)) / 86400000;
};

const WasteFormModal = ({ open, onClose, onSubmit, item, donors = [], centers = [], defaultDonorId = "", allowedCenterIds = [], allowAutoAssign = false }) => {
  const isEdit = Boolean(item);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const donorLocked = Boolean(defaultDonorId);
  const visibleCenters = allowedCenterIds.length > 0 ? centers.filter((center) => allowedCenterIds.includes(center.id)) : centers;

  useEffect(() => {
    if (!open) return;
    const nextDonorId = item?.donorId ?? defaultDonorId ?? "";
    setForm(item ? {
      weight: item.weight ?? "",
      expiry: item.expiry || "",
      type: item.type || "",
      donorId: nextDonorId,
      centerId: item.centerId ?? "",
    } : { ...emptyForm, donorId: nextDonorId });
    setErrors({});
    setSubmitError("");
  }, [open, item, defaultDonorId]);

  const validate = () => {
    const nextErrors = {};
    if (!form.type) nextErrors.type = "Waste type is required";
    if (!form.weight || Number(form.weight) <= 0) nextErrors.weight = "Valid weight is required";
    if (!form.expiry) nextErrors.expiry = "Expiration date is required";
    else if (form.expiry <= getToday()) nextErrors.expiry = "Expiration date must be in the future";
    else if (form.type && daysUntilExpiry(form.expiry) > MAX_EXPIRY_DAYS[form.type]) {
      nextErrors.expiry = `Expiration must be within ${MAX_EXPIRY_DAYS[form.type]} days for ${form.type.toLowerCase()}.`;
    }
    if (!form.donorId) nextErrors.donorId = "Donor is required";
    if (!allowAutoAssign && !form.centerId) nextErrors.centerId = "Collection center is required";
    return nextErrors;
  };

  // Clears a field's error the moment the user edits it, so stale errors
  // from a previous failed submit don't linger and shift layout unexpectedly.
  const updateField = (key, value) => {
    setForm((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => (previous[key] ? { ...previous, [key]: "" } : previous));
  };

  const handleSubmit = async () => {
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSubmitError("");
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    try {
      const shouldAutoAssign = allowAutoAssign && !form.centerId;
      await onSubmit({
        ...(item || {}),
        weight: Number(form.weight),
        expiry: form.expiry,
        type: form.type,
        donorId: Number(form.donorId),
        centerId: Number(form.centerId),
        autoAssign: shouldAutoAssign,
      });
      onClose();
    } catch (requestError) {
      const message = requestError.message || `Failed to ${isEdit ? "update" : "add"} waste item.`;
      // Backend capacity errors are really about the weight the user picked —
      // show them inline under Weight instead of as a top banner, so the
      // error sits next to the field it's actually about.
      if (/capacity|full/i.test(message)) {
        setErrors((previous) => ({ ...previous, weight: message }));
      } else {
        setSubmitError(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const field = (key, label, content) => (
    <div>
      <label className="text-sm text-gray-600 mb-1 block">{label}</label>
      {content}
      {errors[key] && <p className="text-red-500 text-xs mt-1 break-words">{errors[key]}</p>}
    </div>
  );

  return (
    <Modal open={open} title={isEdit ? "Edit Waste Item" : "Add Waste Item"} onClose={onClose} scrollable={true}>
      <div className="flex flex-col gap-4 max-h-[65vh] overflow-y-auto pr-1">
        {submitError && (
          <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded p-2 break-words whitespace-pre-wrap max-h-24 overflow-y-auto">
            {submitError}
          </p>
        )}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">{field("type", "Waste Type", <select value={form.type} disabled={submitting} onChange={(event) => updateField("type", event.target.value)} className="border border-gray-300 rounded w-full p-2 text-sm">
            <option value="">Select waste type</option>
            {WASTE_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>)}</div>
          <div>{field("weight", "Weight (kg)", <input
            type="number"
            min="0.01"
            step="any"
            value={form.weight}
            disabled={submitting}
            onChange={(event) => updateField("weight", event.target.value)}
            className="border border-gray-300 rounded w-full p-2 text-sm"
          />)}</div>
          <div>{field("expiry", "Expiration Date", <input type="date" min={getFirstValidExpiryDate()} max={getMaxExpiryDate(form.type)} value={form.expiry} disabled={submitting} onChange={(event) => updateField("expiry", event.target.value)} className="border border-gray-300 rounded w-full p-2 text-sm" />)}</div>
          <div className="md:col-span-2">{field("donorId", "Donor", <select value={form.donorId} disabled={submitting || donorLocked} onChange={(event) => updateField("donorId", event.target.value)} className="border border-gray-300 rounded w-full p-2 text-sm">
            <option value="">Select donor</option>
            {donors.map((donor) => <option key={donor.id} value={donor.id}>{donor.name}</option>)}
          </select>)}</div>
          {donorLocked && (
            <div className="md:col-span-2 -mt-1">
              <p className="text-xs text-green-600">This donation will be linked to your donor account.</p>
            </div>
          )}
          <div className="md:col-span-2">{field("centerId", allowAutoAssign ? "Collection Center (optional)" : "Collection Center", <select value={form.centerId} disabled={submitting} onChange={(event) => updateField("centerId", event.target.value)} className="border border-gray-300 rounded w-full p-2 text-sm">
            <option value="">{allowAutoAssign ? "Automatically choose best center" : "Select center"}</option>
            {visibleCenters.map((center) => <option key={center.id} value={center.id}>{center.name ? `${center.name} - ${center.location}` : center.location}</option>)}
          </select>)}</div>
          {allowAutoAssign && <p className="md:col-span-2 text-xs text-gray-500">Leave the center on automatic to choose the best available location from your assigned centers.</p>}
        </div>
        {donors.length === 0 && <p className="text-xs text-gray-500">No donors are available.</p>}
        {visibleCenters.length === 0 && !allowAutoAssign && <p className="text-xs text-gray-500">No collection centers are available for this donor.</p>}
      </div>
      <div className="flex justify-end gap-2 mt-5 sticky bottom-0 bg-white pt-2">
        <button onClick={onClose} disabled={submitting} className="px-4 py-2 border rounded text-sm text-gray-600 disabled:opacity-50">Cancel</button>
        <button onClick={handleSubmit} disabled={submitting} className={`px-4 py-2 text-white rounded text-sm disabled:opacity-50 ${isEdit ? "bg-yellow-500" : "bg-green-600"}`}>{submitting ? "Saving..." : isEdit ? "Save Changes" : allowAutoAssign && !form.centerId ? "Auto-assign Item" : "Add Item"}</button>
      </div>
    </Modal>
  );
};

export default WasteFormModal;