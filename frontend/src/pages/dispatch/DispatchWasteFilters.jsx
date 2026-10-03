const STATUS_OPTIONS = [
  { value: "ALL", label: "All statuses" },
  { value: "ACCEPTED", label: "Accepted / Ready" },
];

const DispatchWasteFilters = ({ value, onChange, centerName, onCenterNameChange, showStatus = true }) => (
  <div className="mb-5 flex flex-wrap items-end gap-3 rounded-lg border border-gray-200 bg-white p-3">
    <div className="flex min-w-56 flex-1 flex-col gap-1">
      <label htmlFor="dispatch-center-name" className="text-sm font-medium text-gray-700">Center name</label>
      <input
        id="dispatch-center-name"
        type="search"
        value={centerName}
        onChange={(event) => onCenterNameChange(event.target.value)}
        placeholder="Search collection centers"
        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-purple-500 focus:outline-none"
      />
    </div>
    {showStatus && <>
      <div className="flex flex-col gap-1">
        <label htmlFor="dispatch-status" className="text-sm font-medium text-gray-700">Waste status</label>
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
      </div>
      <span className="text-xs text-gray-500">Only centers with accepted items and an assigned processor are shown.</span>
    </>}
  </div>
);

export default DispatchWasteFilters;
