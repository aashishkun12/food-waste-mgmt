const WASTE_TYPES = ["VEGETABLES", "DAIRY", "GRAINS", "MEAT", "FRUITS", "BEVERAGES", "OTHER"];

const WasteFilters = ({ filters, onChange, onReset }) => {
  return (
    <div className="bg-white border rounded-xl p-4 mb-5 flex flex-wrap gap-3 items-end">

      {/* Date filter */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 font-medium">Date</label>
        <input
          type="date"
          value={filters.date}
          onChange={(e) => onChange("date", e.target.value)}
          className="border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-green-500"
        />
      </div>

      {/* Waste type filter */}
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

      {/* Processed status filter */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500 font-medium">Status</label>
        <select
          value={filters.processed}
          onChange={(e) => onChange("processed", e.target.value)}
          className="border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-green-500"
        >
          <option value="">All Status</option>
          <option value="false">Pending</option>
          <option value="true">Processed</option>
        </select>
      </div>

      {/* Reset */}
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
