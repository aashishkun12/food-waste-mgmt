import { useState } from "react";
import Modal from "../../components/ui/Modal";

const UserDetailsModal = ({ user, onClose, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!user) return null;

  const roleNames = (user.roles || []).map((role) => typeof role === "string" ? role : role.role).filter(Boolean);
  const startEditing = () => {
    setForm({
      email: user.email || "",
      name: user.name || "",
      address: user.address || "",
      phone: user.phone || "",
    });
    setError("");
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setForm(null);
    setError("");
  };

  const saveDetails = async () => {
    setSaving(true);
    setError("");
    try {
      await onSave(user.id, form);
      setEditing(false);
      setForm(null);
    } catch (requestError) {
      setError(requestError.message || "Unable to update user details.");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field, value) => setForm((previous) => ({ ...previous, [field]: value }));
  const handleClose = () => {
    cancelEditing();
    onClose();
  };

  const field = (label, name, type = "text", fullWidth = false) => (
    <label className={fullWidth ? "sm:col-span-2" : ""}>
      <span className="text-xs uppercase text-gray-400">{label}</span>
      <input
        type={type}
        value={form?.[name] || ""}
        onChange={(event) => updateField(name, event.target.value)}
        className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
      />
    </label>
  );

  return (
    <Modal open={!!user} onClose={handleClose} title={editing ? "Edit User Details" : "User Details"} scrollable>
      <div className="grid gap-4 text-sm sm:grid-cols-2">
        <div><p className="text-xs uppercase text-gray-400">Username</p><p className="mt-1 font-medium text-gray-800">{user.username}</p></div>
        {editing ? field("Name", "name") : <div><p className="text-xs uppercase text-gray-400">Name</p><p className="mt-1 font-medium text-gray-800">{user.name || "Not provided"}</p></div>}
        {editing ? field("Email", "email", "email") : <div><p className="text-xs uppercase text-gray-400">Email</p><p className="mt-1 break-all font-medium text-gray-800">{user.email}</p></div>}
        {editing ? field("Phone", "phone", "tel") : <div><p className="text-xs uppercase text-gray-400">Phone</p><p className="mt-1 font-medium text-gray-800">{user.phone || "Not provided"}</p></div>}
        <div><p className="text-xs uppercase text-gray-400">Role</p><p className="mt-1 font-medium text-gray-800">{roleNames.join(", ") || "No role"}</p></div>
        <div><p className="text-xs uppercase text-gray-400">Account</p><p className={`mt-1 font-medium ${user.active ? "text-green-700" : "text-red-700"}`}>{user.active ? "Active" : "Inactive"}</p></div>
        {editing ? field("Address", "address", "text", true) : <div className="sm:col-span-2"><p className="text-xs uppercase text-gray-400">Address</p><p className="mt-1 font-medium text-gray-800">{user.address || "Not provided"}</p></div>}
      </div>
      {error && <p className="mt-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <div className="mt-6 flex justify-end gap-2">
        {editing ? (
          <>
            <button type="button" onClick={cancelEditing} disabled={saving} className="rounded border px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="button" onClick={saveDetails} disabled={saving || !form?.email} className="rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-50">{saving ? "Saving..." : "Save changes"}</button>
          </>
        ) : (
          <button type="button" onClick={startEditing} className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">Edit details</button>
        )}
      </div>
    </Modal>
  );
};

export default UserDetailsModal;
