import { useState, useEffect } from "react";
import Modal from "../../components/ui/Modal";

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const PHONE_REGEX = /^(98|97)\d{8}$/;

const emptyForm = { name: "", address: "", contactEmail: "", contactPhone: "", collectionCenterIds: [] };

const DonorFormModal = ({ open, onClose, onSubmit, donor, centers }) => {
  const centerOptions = centers || [];
  const isEdit = Boolean(donor);

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Prefill on edit / reset on add, each time the modal opens
  useEffect(() => {
    if (open) {
      setForm(
        donor
          ? {
              name: donor.name || "",
              address: donor.address || "",
              contactEmail: donor.contactEmail || "",
              contactPhone: donor.contactPhone || "",
              collectionCenterIds: donor.collectionCenterIds || [],
            }
          : emptyForm
      );
      setErrors({});
      setSubmitError("");
    }
  }, [open, donor]);

  const validate = () => {
    const e = {};

    if (!form.name.trim()) e.name = "Name is required";
    else if (form.name.trim().length < 3) e.name = "Name must be at least 3 characters";

    if (!form.address.trim()) e.address = "Address is required";

    if (!form.contactEmail.trim()) e.contactEmail = "Email is required";
    else if (!EMAIL_REGEX.test(form.contactEmail.trim())) e.contactEmail = "Enter a valid email address";

    if (!form.contactPhone.trim()) e.contactPhone = "Phone is required";
    else if (!PHONE_REGEX.test(form.contactPhone.trim())) e.contactPhone = "Enter a valid 10-digit mobile number";

    if (form.collectionCenterIds.length === 0) e.collectionCenterIds = "Select at least one collection center";

    return e;
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const toggleCenter = (id) => {
    setForm((prev) => ({
      ...prev,
      collectionCenterIds: prev.collectionCenterIds.includes(id)
        ? prev.collectionCenterIds.filter((centerId) => centerId !== id)
        : [...prev.collectionCenterIds, id],
    }));
    setErrors((prev) => ({ ...prev, collectionCenterIds: "" }));
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    try {
      await onSubmit({
        ...(isEdit ? donor : {}),
        name: form.name.trim(),
        address: form.address.trim(),
        contactEmail: form.contactEmail.trim(),
        contactPhone: form.contactPhone.trim(),
        collectionCenterIds: form.collectionCenterIds,
      });
      onClose();
    } catch (err) {
      setSubmitError(
        err?.message || `Failed to ${isEdit ? "update" : "add"} donor. Please try again.`
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
    <Modal open={open} title={isEdit ? "Edit Donor" : "Add Donor"} onClose={handleClose}>
      <div className="flex flex-col gap-3">
        {submitError && (
          <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded p-2">
            {submitError}
          </p>
        )}

        <div>
          <label className="text-sm text-gray-600 mb-1 block">Full Name</label>
          <input
            type="text"
            value={form.name}
            disabled={submitting}
            onChange={(e) => handleChange("name", e.target.value)}
            className={`border rounded w-full p-2 text-sm focus:outline-none focus:border-green-500 disabled:bg-gray-100 ${errors.name ? "border-red-400" : "border-gray-300"}`}
            placeholder="e.g. Green Farm Foods"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-1 block">Address</label>
          <input
            type="text"
            value={form.address}
            disabled={submitting}
            onChange={(e) => handleChange("address", e.target.value)}
            className={`border rounded w-full p-2 text-sm focus:outline-none focus:border-green-500 disabled:bg-gray-100 ${errors.address ? "border-red-400" : "border-gray-300"}`}
            placeholder="e.g. Kathmandu-8"
          />
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-1 block">Contact Email</label>
          <input
            type="email"
            value={form.contactEmail}
            disabled={submitting}
            onChange={(e) => handleChange("contactEmail", e.target.value)}
            className={`border rounded w-full p-2 text-sm focus:outline-none focus:border-green-500 disabled:bg-gray-100 ${errors.contactEmail ? "border-red-400" : "border-gray-300"}`}
            placeholder="e.g. donor@example.com"
          />
          {errors.contactEmail && <p className="text-red-500 text-xs mt-1">{errors.contactEmail}</p>}
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-1 block">Phone</label>
          <input
            type="tel"
            value={form.contactPhone}
            disabled={submitting}
            onChange={(e) => handleChange("contactPhone", e.target.value.replace(/\D/g, ""))}
            maxLength={10}
            className={`border rounded w-full p-2 text-sm focus:outline-none focus:border-green-500 disabled:bg-gray-100 ${errors.contactPhone ? "border-red-400" : "border-gray-300"}`}
            placeholder="e.g. 9800000001"
          />
          {errors.contactPhone && <p className="text-red-500 text-xs mt-1">{errors.contactPhone}</p>}
        </div>

        <div>
          <label className="text-sm text-gray-600 mb-1 block">Collection Centers</label>
          <div className={`border rounded p-2 flex flex-col gap-2 ${errors.collectionCenterIds ? "border-red-400" : "border-gray-300"}`}>
            {centerOptions.length > 0 ? centerOptions.map((c) => (
              <label key={c.id} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.collectionCenterIds.includes(c.id)}
                  disabled={submitting}
                  onChange={() => toggleCenter(c.id)}
                  className="accent-green-600"
                />
                {c.location}
              </label>
            )) : (
              <p className="text-sm text-gray-500">No collection centers are available.</p>
            )}
          </div>
          {errors.collectionCenterIds && <p className="text-red-500 text-xs mt-1">{errors.collectionCenterIds}</p>}
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
          {submitting ? (isEdit ? "Saving..." : "Adding...") : isEdit ? "Save Changes" : "Add Donor"}
        </button>
      </div>
    </Modal>
  );
};

export default DonorFormModal;