const WASTE_TYPES = ["VEGETABLES", "DAIRY", "GRAINS", "MEAT", "FRUITS", "BEVERAGES", "OTHER"];

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "DISPATCHED", label: "Dispatched" },
  { value: "PROCESSED", label: "Processed" },
  { value: "REJECTED", label: "Rejected" },
];

const todayStr = () => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${today.getFullYear()}-${month}-${day}`;
};

const WasteFilters = ({ filters, onChange, onReset }) => {
  const today = todayStr();
  const quickDate = !filters.date ? "ALL" : filters.date === today ? "TODAY" : "CUSTOM";

  return (
    <div className="bg-white border rounded-xl p-4 mb-5 flex flex-wrap gap-3 items-end">

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 font-medium">Date</label>
        <select
          value={quickDate}
          onChange={(e) => {
            if (e.target.value === "ALL") onChange("date", "");
            if (e.target.value === "TODAY") onChange("date", today);
            if (e.target.value === "CUSTOM") onChange("date", "CUSTOM");
          }}
          className="border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-green-500"
        >
          <option value="ALL">All dates</option>
          <option value="TODAY">Today</option>
          <option value="CUSTOM">Custom date</option>
        </select>
        {quickDate === "CUSTOM" && (
          <input
            type="date"
            value={filters.date === "CUSTOM" ? "" : filters.date}
            onChange={(e) => onChange("date", e.target.value)}
            className="border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-green-500"
          />
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 font-medium">Waste Type</label>
        <select
          value={filters.type}
          onChange={(e) => onChange("type", e.target.value)}
          className="border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-green-500"
        >
          <option value="">All Types</option>
          {WASTE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 font-medium">Status</label>
        <select
          value={filters.status}
          onChange={(e) => onChange("status", e.target.value)}
          className="border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-green-500"
        >
          <option value="">All</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <button
        onClick={onReset}
        className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 self-end"
      >
        Reset Filters
      </button>

    </div>
  );
};

export default WasteFilters;