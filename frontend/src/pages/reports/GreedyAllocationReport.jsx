import CapacityBar from "../../components/ui/CapacityBar";

const DUMMY_PROCESSORS = [
  {
    id: 1,
    name: "GreenCycle Processor",
    location: "Kathmandu",
    maxCapacity: 1000,
    currentLoad: 720,
    centersAssigned: ["Kathmandu - Baneshwor", "Lalitpur - Patan"],
  },
  {
    id: 2,
    name: "EcoWaste Solutions",
    location: "Pokhara",
    maxCapacity: 800,
    currentLoad: 210,
    centersAssigned: ["Pokhara - Lakeside"],
  },
  {
    id: 3,
    name: "BioConvert Ltd.",
    location: "Lalitpur",
    maxCapacity: 600,
    currentLoad: 598,
    centersAssigned: [],
  },
];

const statusLabel = (current, max) => {
  const pct = (current / max) * 100;
  if (pct >= 100) return { label: "Full",        cls: "bg-red-100 text-red-700"      };
  if (pct >= 80)  return { label: "Near Full",   cls: "bg-yellow-100 text-yellow-700" };
  if (pct >= 50)  return { label: "Moderate",    cls: "bg-blue-100 text-blue-700"     };
  return                 { label: "Available",   cls: "bg-green-100 text-green-700"   };
};

const GreedyAllocationReport = () => {
  const sorted = [...DUMMY_PROCESSORS].sort((a, b) => {
    const pctA = a.currentLoad / a.maxCapacity;
    const pctB = b.currentLoad / b.maxCapacity;
    return pctA - pctB; // least loaded first = greedy picks this
  });

  const totalCapacity = DUMMY_PROCESSORS.reduce((s, p) => s + p.maxCapacity, 0);
  const totalLoad     = DUMMY_PROCESSORS.reduce((s, p) => s + p.currentLoad, 0);
  const available     = totalCapacity - totalLoad;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">Greedy Processor Allocation</h3>
        <p className="text-sm text-gray-500 mt-0.5">
          Processors sorted by available capacity — the greedy algorithm routes new waste to the least-loaded processor first
        </p>
      </div>

      {/* System-wide summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Capacity", value: `${totalCapacity} kg`, color: "border-blue-200 bg-blue-50 text-blue-700"   },
          { label: "Currently Loaded", value: `${totalLoad} kg`,   color: "border-yellow-200 bg-yellow-50 text-yellow-700" },
          { label: "Available Space", value: `${available} kg`,    color: "border-green-200 bg-green-50 text-green-700"  },
        ].map((s) => (
          <div key={s.label} className={`border rounded-xl p-4 ${s.color}`}>
            <p className="text-xs font-medium opacity-70">{s.label}</p>
            <p className="text-xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Processor cards */}
      <div className="space-y-4">
        {sorted.map((p, i) => {
          const pct    = ((p.currentLoad / p.maxCapacity) * 100).toFixed(0);
          const status = statusLabel(p.currentLoad, p.maxCapacity);
          const isNext = i === 0; // greedy picks this one next

          return (
            <div
              key={p.id}
              className={`bg-white border rounded-xl p-5 ${isNext ? "border-green-400 ring-1 ring-green-300" : ""}`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  {isNext && (
                    <span className="text-xs font-bold px-2 py-0.5 bg-green-600 text-white rounded-full">
                      Next Allocation
                    </span>
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-800">{p.name}</h4>
                    <p className="text-xs text-gray-500">{p.location}</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${status.cls}`}>
                  {status.label}
                </span>
              </div>

              {/* Capacity bar */}
              <div className="mb-4">
                <CapacityBar current={p.currentLoad} max={p.maxCapacity} />
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>
                  Available:{" "}
                  <span className="font-semibold text-gray-800">
                    {p.maxCapacity - p.currentLoad} kg
                  </span>
                </span>
                <span>
                  Load:{" "}
                  <span className={`font-semibold ${+pct >= 80 ? "text-red-500" : "text-gray-800"}`}>
                    {pct}%
                  </span>
                </span>
              </div>

              {/* Assigned centers */}
              {p.centersAssigned.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-gray-500 mb-1">Assigned centers:</p>
                  <div className="flex flex-wrap gap-1">
                    {p.centersAssigned.map((c) => (
                      <span
                        key={c}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {p.centersAssigned.length === 0 && (
                <p className="mt-3 pt-3 border-t text-xs text-gray-400">No centers currently assigned</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GreedyAllocationReport;
