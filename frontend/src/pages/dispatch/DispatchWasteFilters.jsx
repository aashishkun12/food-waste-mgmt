const STATUS_OPTIONS = [
  { value: "ALL", label: "All statuses" },
  { value: "ACCEPTED", label: "Accepted / Ready" },
];

const DispatchWasteFilters = ({ value, onChange }) => (
  <div className="mb-5 flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-white p-3">
    <label htmlFor="dispatch-status" className="text-sm font-medium text-gray-700">
      Waste status
    </label>
    <select
      id="dispatch-status"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-purple-500 focus:outline-none"
    >
      {STATUS_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
    <span className="text-xs text-gray-500">
      Accepted items can be dispatched; dispatched items are being processed.
    </span>
  </div>
);

export default DispatchWasteFilters;
